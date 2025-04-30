import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const CreatePurchase = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedSize, setSelectedSize] = useState("L");
  const [stockError, setStockError] = useState("");
  const [maxQuantity, setMaxQuantity] = useState(null);

  // Pre-fill product data from state
  const productName = state?.productName || "";
  const productPrice = state?.productPrice || 0;
  const productImage = state?.productImage || "";

  // Calculate total price when quantity changes
  useEffect(() => {
    setTotalPrice(productPrice * quantity);
  }, [quantity, productPrice]);

  // Initialize particles
  useEffect(() => {
    const particlesScript = document.createElement('script');
    particlesScript.innerHTML = `
      function createParticles() {
        const container = document.getElementById('particles-container');
        if (!container) return;
        
        for (let i = 0; i < 50; i++) {
          const particle = document.createElement('div');
          particle.className = 'particle';
          
          // Random position
          const posX = Math.random() * 100;
          const posY = Math.random() * 100;
          
          // Random size
          const size = Math.random() * 8 + 2;
          
          // Random opacity
          const opacity = Math.random() * 0.5 + 0.1;
          
          // Random animation duration
          const duration = Math.random() * 15 + 10;
          
          // Apply styles
          particle.style.cssText = \`
            position: absolute;
            left: \${posX}%;
            top: \${posY}%;
            width: \${size}px;
            height: \${size}px;
            background-color: rgba(95, 111, 255, \${opacity});
            border-radius: 50%;
            pointer-events: none;
            animation: float \${duration}s ease-in-out infinite;
            animation-delay: \${Math.random() * 5}s;
          \`;
          
          container.appendChild(particle);
        }
      }
      
      //Create particles when page loads
      window.addEventListener('load', createParticles);
      
      // Create a style element for the animation
      const styleEl = document.createElement('style');
      styleEl.innerHTML = \`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-15px) translateX(15px);
          }
          50% {
            transform: translateY(5px) translateX(-5px);
          }
          75% {
            transform: translateY(10px) translateX(10px);
          }
        }
        
        #particles-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          top: 0;
          left: 0;
          z-index: 0;
          pointer-events: none;
        }
      \`;
      document.head.appendChild(styleEl);
    `;
    document.body.appendChild(particlesScript);

    return () => {
      document.body.removeChild(particlesScript);
    };
  }, []);

  const handleARTryNow = () => {
    // Placeholder for AR functionality
    alert("AR Try-on feature coming soon!");
    // In a real implementation, this would launch the AR experience
  };

  const handleBuyNow = () => {
    // Navigate to customer information page
    navigate("/payment", { 
      state: { 
        productName, 
        totalPrice, 
        quantity,
        selectedSize,
        productImage,
        productPrice
      } 
    });
  };

  const SizeButton = ({ size }) => (
    <button
      type="button"
      className={`px-4 py-2 mr-2 rounded-full transition-all duration-300 ${
        selectedSize === size
          ? "bg-[#5F6FFF] text-white shadow-md"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
      onClick={() => setSelectedSize(size)}
    >
      {size}
    </button>
  );

  SizeButton.propTypes = {
    size: PropTypes.string.isRequired,
  };

  // Sample product description - you should replace this with actual product data
  const productDescription = {
    title: "Product Details",
    description: "This premium quality product is designed with comfort and style in mind. Made from high-quality materials that ensure durability and a perfect fit for any occasion.",
    features: [
      "Premium quality fabric",
      "Comfortable fit",
      "Durable construction",
      "Easy to maintain",
      "Perfect for casual and formal occasions"
    ],
    careInstructions: "Machine wash cold. Tumble dry low. Do not bleach.",
    shipping: "Free shipping on orders over $50. Standard delivery in 3-5 business days."
  };

  return (
    <div className="p-4 bg-gradient-to-br from-[#F8F9FF] to-[#E6E9FF] min-h-screen relative">
      {/* Particles container */}
      <div id="particles-container"></div>
      
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden relative z-10">
        <div className="flex flex-col md:flex-row">
          {/* Product Image Section */}
          <div className="w-full md:w-1/2 bg-[#F0F2FF]">
            <div className="p-8 h-full flex flex-col justify-between">
              {productImage ? (
                <div className="relative h-96 w-full mb-4">
                  <img
                    src={`http://localhost:5555${productImage}`}
                    alt={productName}
                    className="w-full h-full object-contain rounded-lg"
                  />
                  <button
                    onClick={handleARTryNow}
                    className="absolute bottom-4 right-4 bg-white text-[#5F6FFF] font-semibold py-2 px-4 rounded-full shadow-md hover:bg-[#5F6FFF] hover:text-white transition-all duration-300 flex items-center space-x-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Try in AR</span>
                  </button>
                </div>
              ) : (
                <div className="h-96 w-full mb-4 bg-gray-200 rounded-lg flex items-center justify-center shadow-inner">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">{productName}</h2>
                    <p className="text-2xl font-bold text-[#5F6FFF] mt-2">
                      LKR {productPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-[#5F6FFF] text-white px-3 py-1 rounded-full text-sm">
                    In Stock
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-gray-700 mb-2 font-medium">Select Size:</p>
                  <div className="flex space-x-2">
                    <SizeButton size="L" />
                    <SizeButton size="M" />
                    <SizeButton size="XL" />
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-gray-700 mb-2 font-medium">Quantity:</p>
                  <div className="flex items-center space-x-3">
                    <button 
                      className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-700 hover:bg-[#5F6FFF] hover:text-white transition-colors"
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value) || 1;
                        setQuantity(newQuantity);
                        if (maxQuantity !== null && newQuantity > maxQuantity) {
                          setStockError(
                            `Maximum quantity available: ${maxQuantity}`
                          );
                        } else {
                          setStockError("");
                        }
                      }}
                      className="w-16 text-center py-1 px-2 border rounded-md focus:ring-2 focus:ring-[#5F6FFF] focus:border-transparent"
                      min="1"
                      max={maxQuantity || undefined}
                    />
                    <button 
                      className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-700 hover:bg-[#5F6FFF] hover:text-white transition-colors"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  {stockError && (
                    <p className="text-red-500 mt-2 text-sm">{stockError}</p>
                  )}
                </div>

                <div className="mt-6">
                  <p className="text-gray-700 font-medium">Total:</p>
                  <p className="text-2xl font-bold text-[#5F6FFF]">
                    LKR {totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description Section - Replacing Customer Information */}
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Product Description</h2>
            
            <div className="space-y-6">
              <div className="bg-[#F8F9FF] p-6 rounded-lg border border-[#E6E9FF]">
                <p className="text-gray-700 leading-relaxed">
                  {productDescription.description}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {productDescription.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-[#5F6FFF] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Care Instructions</h3>
                <p className="text-gray-700 bg-[#F0F2FF] p-4 rounded-lg">
                  {productDescription.careInstructions}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Shipping Information</h3>
                <p className="text-gray-700">
                  {productDescription.shipping}
                </p>
              </div>

              <div className="mt-8 flex flex-col space-y-4">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full bg-[#5F6FFF] text-white py-4 px-6 rounded-lg hover:bg-[#4F5FEF] transition-colors duration-300 text-lg font-semibold shadow-md flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Buy Now
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate("/productViews")}
                  className="w-full bg-transparent text-[#5F6FFF] border border-[#5F6FFF] py-3 px-6 rounded-lg hover:bg-[#F0F2FF] transition-colors duration-300 font-medium"
                >
                  Back to Products
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchase;