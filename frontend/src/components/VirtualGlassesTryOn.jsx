import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-cpu";
import "./VirtualGlassesTryOn.css";

const VirtualGlassesTryOn = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const glassesListRef = useRef(null);
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedGlasses, setSelectedGlasses] = useState(null);

  // Three.js variables
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const modelRef = useRef(null);
  const glassesArrayRef = useRef([]);
  const animationFrameRef = useRef(null);
  const glassesKeyPoints = {
    midEye: 168,
    leftEye: 143,
    noseBottom: 2,
    rightEye: 372,
  };

  useEffect(() => {
    const setupWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        // Wait a bit before accessing the ref
        setTimeout(() => {
          if (webcamRef.current) {
            webcamRef.current.srcObject = stream;
          } else {
            console.error("webcamRef is still null even after timeout");
          }
        }, 100); // small delay (can be 50–200ms)
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    setupWebcam();
  }, []);

  // Initialize the 3D scene
  useEffect(() => {
    setup3dScene();
    setup3dCamera();

    // Fetch available glasses data and set the first one as selected
    fetch("/api/glasses")
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setSelectedGlasses(data[0]);
          setup3dGlasses(data[0]);
        }
      })
      .catch((err) => {
        console.error("Error loading glasses data:", err);
        setError("Failed to load glasses models");
      });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Clean up Three.js resources
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Setup the 3D scene
  const setup3dScene = () => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
    });
    rendererRef.current = renderer;

    // Add lighting
    const frontLight = new THREE.SpotLight(0xffffff, 0.3);
    frontLight.position.set(10, 10, 10);
    scene.add(frontLight);

    const backLight = new THREE.SpotLight(0xffffff, 0.3);
    backLight.position.set(10, 10, -10);
    scene.add(backLight);
  };

  // Setup the 3D camera
  const setup3dCamera = () => {
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;

    if (isWebcamOn) {
      const videoWidth = webcamRef.current.videoWidth;
      const videoHeight = webcamRef.current.videoHeight;

      camera.position.x = videoWidth / 2;
      camera.position.y = -videoHeight / 2;
      camera.position.z = -(videoHeight / 2) / Math.tan(45 / 2);
      camera.lookAt({
        x: videoWidth / 2,
        y: -videoHeight / 2,
        z: 0,
        isVector3: true,
      });

      rendererRef.current.setSize(videoWidth, videoHeight);
      rendererRef.current.setClearColor(0x000000, 0);
    } else {
      camera.position.set(0, 0, 1.5);
      camera.lookAt(sceneRef.current.position);

      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      rendererRef.current.setClearColor(0x3399cc, 1);

      controlsRef.current = new OrbitControls(
        camera,
        rendererRef.current.domElement
      );
    }

    // Add camera to scene if not already there
    let cameraExists = false;
    sceneRef.current.children.forEach((child) => {
      if (child.type === "PerspectiveCamera") {
        cameraExists = true;
      }
    });

    if (!cameraExists) {
      camera.add(new THREE.PointLight(0xffffff, 0.8));
      sceneRef.current.add(camera);
    }

    setup3dAnimate();
  };

  // Load 3D glasses models
  const setup3dGlasses = async (glassesData) => {
    if (!glassesData) return;

    return new Promise((resolve) => {
      const gltfLoader = new GLTFLoader();
      const modelPath = `/3dmodel/${glassesData.folderName}/`;

      gltfLoader.setPath(modelPath);
      gltfLoader.load(glassesData.modelFile, (object) => {
        object.scene.position.set(
          glassesData.position.x,
          glassesData.position.y,
          glassesData.position.z
        );

        let scale = glassesData.scale;
        if (window.innerWidth < 480) {
          scale = scale * 0.5;
        }

        object.scene.scale.set(scale, scale, scale);
        sceneRef.current.add(object.scene);
        glassesArrayRef.current.push(object.scene);
        resolve("loaded");
      });
    });
  };

  // Animation loop
  const setup3dAnimate = () => {
    if (!isWebcamOn && controlsRef.current) {
      controlsRef.current.update();
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);

    if (!isWebcamOn) {
      animationFrameRef.current = requestAnimationFrame(setup3dAnimate);
    }
  };

  // Clear the canvas of any glasses models
  const clearCanvas = () => {
    for (let i = sceneRef.current.children.length - 1; i >= 0; i--) {
      const obj = sceneRef.current.children[i];
      if (obj.type === "Group") {
        sceneRef.current.remove(obj);
      }
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    glassesArrayRef.current = [];
  };

  // Toggle webcam on/off
  const toggleWebcam = async () => {
    if (!isWebcamOn) {
      setLoading(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });

        webcamRef.current.srcObject = stream;
        webcamRef.current.play();

        // Wait for video to be ready
        // webcamRef.current.onloadedmetadata = () => {
        //   setIsWebcamOn(true);
        //   switchSource(true);
        //   startVirtualGlasses();
        // };
        await webcamRef.current.play();
        setIsWebcamOn(true);
        switchSource(true);
        startVirtualGlasses();
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setError("Failed to access camera. Please allow camera permissions.");
        setLoading(false);
      }
    } else {
      // Stop webcam
      const stream = webcamRef.current.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      webcamRef.current.srcObject = null;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      setIsWebcamOn(false);
      switchSource(false);
    }
  };

  // Switch between webcam and normal view
  const switchSource = (isVideo) => {
    clearCanvas();
    setup3dCamera();

    if (!isVideo) {
      setup3dGlasses(selectedGlasses);
    }
  };

  // Start the virtual glasses detection
  const startVirtualGlasses = async () => {
    setLoading(true);

    try {
      const model = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
      );

      modelRef.current = model;
      detectFaces();
      setLoading(false);
    } catch (err) {
      console.error("Error loading face mesh model:", err);
      setError(
        "Failed to load face detection model. Please refresh and try again."
      );
      setLoading(false);
    }
  };

  // Detect faces and position glasses
  const detectFaces = async () => {
    if (!modelRef.current || !isWebcamOn || !webcamRef.current) return;

    try {
      const faces = await modelRef.current.estimateFaces({
        input: webcamRef.current,
        returnTensors: false,
        flipHorizontal: false,
        predictIrises: false,
      });

      // If number of faces changed, clear and recreate glasses
      if (glassesArrayRef.current.length !== faces.length) {
        clearCanvas();

        for (let j = 0; j < faces.length; j++) {
          await setup3dGlasses(selectedGlasses);
        }
      }

      // Position glasses on each face
      for (let i = 0; i < faces.length; i++) {
        const glasses = glassesArrayRef.current[i];
        const face = faces[i];

        if (glasses && face) {
          const pointMidEye = face.scaledMesh[glassesKeyPoints.midEye];
          const pointLeftEye = face.scaledMesh[glassesKeyPoints.leftEye];
          const pointNoseBottom = face.scaledMesh[glassesKeyPoints.noseBottom];
          const pointRightEye = face.scaledMesh[glassesKeyPoints.rightEye];

          // Position glasses
          glasses.position.x = pointMidEye[0];
          glasses.position.y = -pointMidEye[1] + 155;
          glasses.position.z = -cameraRef.current.position.z + pointMidEye[2];

          // Set up vector for orientation
          glasses.up.x = pointMidEye[0] - pointNoseBottom[0];
          glasses.up.y = -(pointMidEye[1] - pointNoseBottom[1]);
          glasses.up.z = pointMidEye[2] - pointNoseBottom[2];

          const length = Math.sqrt(
            glasses.up.x ** 2 + glasses.up.y ** 2 + glasses.up.z ** 2
          );

          glasses.up.x /= length;
          glasses.up.y /= length;
          glasses.up.z /= length;

          // Scale glasses based on eye distance
          const eyeDist = Math.sqrt(
            (pointLeftEye[0] - pointRightEye[0]) ** 2 +
              (pointLeftEye[1] - pointRightEye[1]) ** 2 +
              (pointLeftEye[2] - pointRightEye[2]) ** 2
          );

          glasses.scale.x = eyeDist * selectedGlasses.scale;
          glasses.scale.y = eyeDist * selectedGlasses.scale;
          glasses.scale.z = eyeDist * selectedGlasses.scale;

          // Set rotation
          glasses.rotation.y = Math.PI;
          glasses.rotation.z = Math.PI / 2 - Math.acos(glasses.up.x);
        }
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);

      if (isWebcamOn) {
        animationFrameRef.current = requestAnimationFrame(detectFaces);
      }
    } catch (err) {
      console.error("Error in face detection:", err);
    }
  };

  // Handle glasses selection
  const handleGlassesSelect = (glasses) => {
    setSelectedGlasses(glasses);
    clearCanvas();

    if (!isWebcamOn) {
      setup3dGlasses(glasses);
      setup3dAnimate();
    }
  };

  // Scroll glasses list
  const scrollGlassesList = (direction) => {
    if (glassesListRef.current) {
      const itemWidth =
        glassesListRef.current.querySelector("li").offsetWidth +
        parseInt(
          getComputedStyle(glassesListRef.current.querySelector("li"))
            .marginLeft
        ) +
        parseInt(
          getComputedStyle(glassesListRef.current.querySelector("li"))
            .marginRight
        );

      const currentMargin = parseInt(
        getComputedStyle(glassesListRef.current).marginLeft
      );
      const newMargin =
        direction === "left"
          ? currentMargin + itemWidth
          : currentMargin - itemWidth;

      glassesListRef.current.style.marginLeft = `${newMargin}px`;
      glassesListRef.current.style.transition = "0.3s";
    }
  };

  // Close error message
  const closeError = () => {
    setError("");
    setIsWebcamOn(false);
  };

  return (
    <div className="virtual-glasses-app">
      <div className="webcam-control">
        <label className="form-switch">
          <input type="checkbox" checked={isWebcamOn} onChange={toggleWebcam} />
          <i></i>
          <span>{isWebcamOn ? "on" : "Try it On"}</span>
        </label>
      </div>

      <div className="container-area">
        {isWebcamOn ? (
          <div className="webcam-container">
            <video
              ref={webcamRef}
              autoPlay
              playsInline
              width="640"
              height="480"
            />
          </div>
        ) : (
          <div className="image-container">{/* 3D preview container */}</div>
        )}

        <canvas ref={canvasRef} width="640" height="480" />

        {loading && (
          <div className="loading">
            Loading Model
            <div className="spinner-border" role="status">
              <span className="sr-only"></span>
            </div>
          </div>
        )}

        <div className="glasses-slider">
          <button
            className="arrow-left"
            onClick={() => scrollGlassesList("left")}
          >
            &lt;
          </button>

          <div className="glasses-list-container">
            <ul ref={glassesListRef} className="glasses-list">
              {/* Map through glasses models from API */}
              {/* Example item: */}
              <li
                className={
                  selectedGlasses?.id === "glasses-01" ? "selected-glasses" : ""
                }
                onClick={() =>
                  handleGlassesSelect({
                    id: "glasses-01",
                    folderName: "glasses-01",
                    modelFile: "scene.gltf",
                    position: { x: 0, y: 0.5, z: 0 },
                    scale: 0.01,
                  })
                }
              >
                <img src="/3dmodel/glasses-01/glasses_01.png" alt="Glasses 1" />
              </li>
              {/* Add more glasses options here */}
            </ul>
          </div>

          <button
            className="arrow-right"
            onClick={() => scrollGlassesList("right")}
          >
            &gt;
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={closeError}>OK</button>
        </div>
      )}
    </div>
  );
};

export default VirtualGlassesTryOn;
