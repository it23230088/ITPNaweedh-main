import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import shopbg from "../../images/Seeman.jpg"; // Import the underwater background image

const LandingPage = () => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate("/productViews");
  };

  // State to control text and button visibility
  const [textVisible, setTextVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);

  // Trigger the effect to make text visible when component mounts
  useEffect(() => {
    setTextVisible(true);

    // Delay button appearance by 1 second after the heading is visible
    const timer = setTimeout(() => {
      setButtonVisible(true);
    }, 1000); // 1000ms = 1 second

    return () => clearTimeout(timer); // Cleanup the timeout on unmount
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top banner */}
      <div className="bg-blue-900 text-white text-center py-2 text-sm">
        FREE STANDARD SHIPPING ON ORDERS OVER $75! USE CODE: SEATURTLE AT
        CHECKOUT
      </div>

      {/* Hero Section */}
      <div
        className="flex-grow bg-cover bg-center relative"
        style={{ backgroundImage: `url(${shopbg})` }}
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
        <div className="absolute inset-0 bg-blue-500 bg-opacity-30"></div>
        <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center h-full text-center relative z-10">
          {/* Add fade-in effect to this title */}
          <h1
            className={`text-6xl font-bold text-yellow-300 mb-4 shadow-text transition-all duration-1000 ease-in-out ${
              textVisible
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            #############.lk
          </h1>

          {/* Add fade-in and hover effect to this line */}
          <p
            className={`text-3xl text-white mb-8 shadow-text transition-all duration-1000 ease-in-out transform ${
              textVisible
                ? "opacity-100 translate-x-0 scale-100"
                : "opacity-0 translate-x-[-100%] scale-95"
            } hover:scale-110 hover:text-yellow-300`}
          >
            DIVE INTO OUR COLLECTION
          </p>

          {/* Add delayed appearance and hover pulse effect to the button */}
          <button
            onClick={handleShopNow}
            className={`bg-buttons text-white px-8 py-4 rounded-full text-xl font-semibold transition-all duration-300 ease-in-out transform hover:bg-green-600 hover:scale-110 hover:shadow-xl hover:-translate-y-1 shadow-lg ${
              buttonVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5 pointer-events-none"
            }`}
          >
            SHOP NOW
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-800 py-6 text-white">
        <div className="container mx-auto px-6 text-center">
          <p
            className={`text-lg transition-all duration-1000 ease-in-out ${
              textVisible
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 translate-y-10"
            } hover:scale-110 hover:text-yellow-300`}
          >
            #################### #########
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
