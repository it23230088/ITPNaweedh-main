import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Particle background animation (unchanged)
const ParticleAnimation = () => {
  useEffect(() => {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = [];
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        color: '#5F6FFF',
        alpha: Math.random() * 0.3 + 0.1,
        speed: Math.random() * 0.5 + 0.1,
        direction: Math.random() * 360
      });
    }
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        const angleRad = (particle.direction * Math.PI) / 180;
        particle.x += Math.cos(angleRad) * particle.speed;
        particle.y += Math.sin(angleRad) * particle.speed;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(95, 111, 255, ${particle.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <canvas
      id="particle-canvas"
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    productName,
    productPrice,
    quantity,
    selectedSize,
    totalPrice,
    productImage,
  } = location.state || {};

  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentImage, setPaymentImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);

  // Ref for file input
  const fileInputRef = useRef(null);

  // Open file dialog when upload area is clicked
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentImage(e.target.files[0]);
    }
  };

  const validateForm = () => {
    let formErrors = {};
    if (!customerName) formErrors.customerName = "Customer name is required";
    if (!email) formErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) formErrors.email = "Email is invalid";
    if (!phone) formErrors.phone = "Phone number is required";
    if (!address) formErrors.address = "Delivery address is required";
    if (!paymentImage) formErrors.paymentImage = "Payment receipt is required";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSavePurchase = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validateForm()) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("customerName", customerName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("address", address);
      formData.append("productName", productName);
      formData.append("quantity", quantity);
      formData.append("productSize", selectedSize);
      formData.append("productPrice", productPrice);
      formData.append("totalPrice", totalPrice);
      formData.append("image", paymentImage); // backend expects 'image'

      const response = await axios.post(
        "http://localhost:5555/purchaseList",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate("/"); // go to home or another page
      }, 2000);
    } catch (error) {
      setLoading(false);
      setSubmitError(
        error.response?.data?.message ||
          "Failed to submit purchase. Please try again."
      );
    }
  };

  useEffect(() => {
    // Load Poppins font
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    document.body.style.fontFamily = "'Poppins', sans-serif";
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-600 to-indigo-800">
        <ParticleAnimation />
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white relative z-10"></div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 min-h-screen relative">
      <ParticleAnimation />
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 shadow-lg relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold uppercase tracking-wider">
              Payment
            </h1>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-semibold uppercase tracking-wide mb-6 text-blue-700">
                Order Summary
              </h2>
              <div className="mb-6">
                <img
                  src={productImage}
                  alt={productName}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-medium tracking-tight text-gray-800">
                  {productName}
                </h3>
                <div className="text-gray-700">
                  Size: <span className="font-medium">{selectedSize}</span>
                </div>
                <div className="text-gray-700">
                  Quantity: <span className="font-medium">{quantity}</span>
                </div>
                <div className="pt-4 border-t border-blue-100">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Total</span>
                    <span className="text-xl font-bold text-blue-700">
                      LKR {totalPrice?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Payment Form */}
          <div className="lg:w-2/3">
            <form
              className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all duration-300"
              onSubmit={handleSavePurchase}
              encType="multipart/form-data"
            >
              <h2 className="text-xl font-semibold uppercase tracking-wide mb-6 text-blue-700">
                Customer Information
              </h2>
              <div className="space-y-6">
                {/* Customer Info Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block uppercase text-xs font-medium text-gray-500 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className={`w-full p-3 border ${
                        errors.customerName
                          ? "border-red-500"
                          : "border-blue-200"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Your full name"
                    />
                    {errors.customerName && (
                      <span className="text-red-500 text-xs mt-1">
                        {errors.customerName}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block uppercase text-xs font-medium text-gray-500 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full p-3 border ${
                        errors.email ? "border-red-500" : "border-blue-200"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Your email address"
                    />
                    {errors.email && (
                      <span className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block uppercase text-xs font-medium text-gray-500 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full p-3 border ${
                        errors.phone ? "border-red-500" : "border-blue-200"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Your phone number"
                    />
                    {errors.phone && (
                      <span className="text-red-500 text-xs mt-1">
                        {errors.phone}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block uppercase text-xs font-medium text-gray-500 mb-2">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={`w-full p-3 border ${
                        errors.address ? "border-red-500" : "border-blue-200"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Your delivery address"
                    />
                    {errors.address && (
                      <span className="text-red-500 text-xs mt-1">
                        {errors.address}
                      </span>
                    )}
                  </div>
                </div>
                {/* Payment Details */}
                <div className="pt-6 border-t border-blue-100">
                  <h2 className="text-xl font-semibold uppercase tracking-wide mb-6 text-blue-700">
                    Payment Details
                  </h2>
                  <div className="bg-blue-50 p-6 mb-6 rounded-xl border border-blue-100">
                    <p className="text-sm font-medium mb-4 text-gray-700">
                      Please make a payment to the following bank account:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Bank</p>
                        <p className="font-medium text-gray-800">
                          Sampath Bank
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Branch</p>
                        <p className="font-medium text-gray-800">Malabe</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Account Name</p>
                        <p className="font-medium text-gray-800">
                          Methma Gunasingha
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Account Number</p>
                        <p className="font-medium text-gray-800">
                          710 890 4965
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Branch Code</p>
                        <p className="font-medium text-gray-800">053</p>
                      </div>
                    </div>
                  </div>
                  {/* Upload Payment Receipt */}
                  <div>
                    <label className="block uppercase text-xs font-medium text-gray-500 mb-2">
                      Upload Payment Receipt
                    </label>
                    <div
                      className="border-2 border-dashed p-6 text-center border-blue-200 rounded-xl hover:bg-blue-50 transition-colors duration-300 cursor-pointer"
                      onClick={handleUploadClick}
                    >
                      <div className="flex flex-col items-center">
                        {/* SVG icon */}
                        <svg
                          className="w-10 h-10 text-blue-500 mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          ></path>
                        </svg>
                        <p className="text-sm font-medium text-blue-700">
                          {paymentImage
                            ? paymentImage.name
                            : "Click to upload payment receipt"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, PNG or PDF
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                      />
                    </div>
                    {errors.paymentImage && (
                      <span className="text-red-500 text-xs mt-1">
                        {errors.paymentImage}
                      </span>
                    )}
                  </div>
                </div>
                {submitError && (
                  <div className="text-red-600 text-sm mt-2">{submitError}</div>
                )}
                {success && (
                  <div className="text-green-600 text-sm mt-2">
                    Purchase successful! Redirecting...
                  </div>
                )}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-4 font-medium uppercase tracking-wide rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Complete Purchase"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
