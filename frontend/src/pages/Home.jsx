import hero from "../images/Seeman.jpg";
import { useEffect, useState } from "react";

const UnderConstruction = () => {
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    // Trigger text reveal after a short delay
    const timer = setTimeout(() => {
      setTextVisible(true);
    }, 500); // Delay to enhance the reveal effect

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div
        className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white relative"
        style={{
          backgroundImage: `url(${hero})`, // Local image in 'images' folder
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)", // This makes the hero much darker
            zIndex: 1, // Ensures the overlay is below the content
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10">
          <h1
            className={`text-6xl font-bold mb-6 transition-all duration-1000 ease-in-out ${
              textVisible
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            WWWWWWWWW.lk
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg bg-primary text-white p-8 md:p-16">
        <h2 className="text-4xl font-semibold mb-4">Naweedh?</h2>
        <p className="text-lg mb-6">
          E#####################tures have roamed t############## over
          ##########################y are under ################## activities.
        </p>
        <h3 className="text-2xl font-semibold mb-3">
          ##############################
        </h3>
        <p className="text-lg mb-6">
          #########################################
          ##########################################
          #################################
        </p>
        <h3 className="text-2xl font-semibold mb-3">
          ########################
        </h3>
        <p className="text-lg">
          #########################################
          ##########################################
          #################################
        </p>
      </div>
    </div>
  );
};

export default UnderConstruction;
