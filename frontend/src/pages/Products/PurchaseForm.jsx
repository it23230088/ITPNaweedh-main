import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const CreatePurchase = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentImage, setPaymentImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState("L");
  const [stockError, setStockError] = useState("");
  const [maxQuantity, setMaxQuantity] = useState(null);
  const [errors, setErrors] = useState({});

  // Pre-fill product data from state
  const productName = state?.productName || "";
  const productPrice = state?.productPrice || 0;
  const productImage = state?.productImage || "";

  // Calculate total price when quantity changes
  useEffect(() => {
    setTotalPrice(productPrice * quantity);
  }, [quantity, productPrice]);

  const handleImageChange = (e) => {
    setPaymentImage(e.target.files[0]);
  };

  const validateForm = () => {
    let formErrors = {};

    if (!customerName) {
      formErrors.customerName = "Customer name is required";
    }
    if (!email) {
      formErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = "Email is invalid";
    }
    if (!phone) {
      formErrors.phone = "Phone number is required";
    }
    if (!address) {
      formErrors.address = "Delivery address is required";
    }
    if (!quantity || quantity <= 0) {
      formErrors.quantity = "Quantity must be a positive number";
    }
    if (!paymentImage) {
      formErrors.paymentImage = "Payment slip is required";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSavePurchase = () => {
    if (!validateForm()) return;

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

    if (paymentImage) {
      formData.append("image", paymentImage);
    }

    setLoading(true);
    setStockError("");

    axios
      .post("http://localhost:5555/productViews/purchaseForm", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setLoading(false);
        navigate("/productViews");
      })
      .catch((error) => {
        setLoading(false);
        if (error.response && error.response.status === 400) {
          if (error.response.data.message === "Not enough stock available") {
            setMaxQuantity(error.response.data.availableQuantity);
            setStockError(
              `Not enough stock available. Maximum quantity available: ${error.response.data.availableQuantity}`
            );
          } else {
            setStockError(
              error.response.data.message ||
                "An error occurred while processing your request."
            );
          }
        } else {
          alert("An error happened. Please check the console");
          console.log(error);
        }
      });
  };

  const SizeButton = ({ size }) => (
    <button
      type="button"
      className={`px-4 py-2 mr-2 rounded-full transition-all duration-300 ${
        selectedSize === size
          ? "bg-blue-500 text-white shadow-md"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
      onClick={() => setSelectedSize(size)}
    >
      {size}
    </button>
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen">
      {/* <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Purchase Product</h1> */}

      <div className="flex flex-col md:flex-row md:space-x-6 max-w-6xl mx-auto">
        <div className="w-full md:w-1/3 mb-6 md:mb-0">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {productImage ? (
              <img
                src={`http://localhost:5555${productImage}`}
                alt={productName}
                className="w-full h-64 object-cover rounded-md shadow-md"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center shadow-inner">
                No Image
              </div>
            )}
            <div className="mt-4">
              <p className="text-2xl font-semibold text-gray-800">
                {productName}
              </p>
              <p className="text-xl font-bold text-blue-600 mt-2">
                LKR {productPrice.toFixed(2)}
              </p>
              <div className="mt-4">
                <p className="text-gray-600 mb-2 font-medium">Size:</p>
                <div className="flex space-x-2">
                  <SizeButton size="L" />
                  <SizeButton size="M" />
                  <SizeButton size="XL" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/3">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSavePurchase();
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-lg font-semibold text-gray-600 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.customerName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.customerName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.customerName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-600 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-600 mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-600 mb-2">
                  Delivery Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your delivery address"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-600 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const newQuantity = parseInt(e.target.value);
                    setQuantity(newQuantity);
                    if (maxQuantity !== null && newQuantity > maxQuantity) {
                      setStockError(
                        `Maximum quantity available: ${maxQuantity}`
                      );
                    } else {
                      setStockError("");
                    }
                  }}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.quantity ? "border-red-500" : "border-gray-300"
                  }`}
                  min="1"
                  max={maxQuantity || undefined}
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                )}
                {stockError && (
                  <p className="text-red-500 mt-2 bg-red-100 border border-red-400 rounded p-2">
                    {stockError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-600 mb-2">
                  Total Price
                </label>
                <input
                  type="text"
                  value={`LKR ${totalPrice.toFixed(2)}`}
                  className="w-full px-4 py-2 border rounded-md bg-gray-100 font-bold text-lg"
                  disabled
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-600 mb-2">
                  Upload Payment Slip
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className={`w-full text-gray-700 mt-2 p-2 border rounded-md ${
                    errors.paymentImage ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.paymentImage && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.paymentImage}
                  </p>
                )}
              </div>

              <div className="bg-red-100 p-4 rounded-md">
                <p className="text-gray-700">
                  <strong>Attention:</strong> Please upload your payment
                  document here. We will process your payment and notify you as
                  soon as possible about the status. Payment details:
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Bank:</strong> Sampath Bank
                  <br />
                  <strong>Branch:</strong> Malabe
                  <br />
                  <strong>Account Name:</strong>####### Sri Lanka
                  <br />
                  <strong>Account Number:</strong> 710 890 4965
                  <br />
                  <strong>Branch Code:</strong> 053
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-3 px-6 rounded-full w-full md:w-1/2 hover:bg-blue-600 transition-colors duration-300 text-lg font-semibold shadow-md"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Checkout"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchase;
