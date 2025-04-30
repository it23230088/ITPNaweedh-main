import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const PaymentPage = () => {
  const location = useLocation();
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

  const handleImageChange = () => {
    setPaymentImage({ name: "receipt.jpg" });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!customerName) formErrors.customerName = "Customer name is required";
    if (!email) formErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) formErrors.email = "Email is invalid";
    if (!phone) formErrors.phone = "Phone number is required";
    if (!address) formErrors.address = "Delivery address is required";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSavePurchase = () => {
    if (!validateForm()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Purchase successful!");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-900 to-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold uppercase tracking-wider">Payment</h1>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold uppercase tracking-wide mb-6">Order Summary</h2>
              <div className="mb-6">
                <img
                  src={productImage}
                  alt={productName}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-medium tracking-tight">{productName}</h3>
                <div>Size: {selectedSize}</div>
                <div>Quantity: {quantity}</div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total</span>
                    <span className="text-xl font-bold">LKR {totalPrice?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Payment Form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold uppercase tracking-wide mb-6">Customer Information</h2>
              <div className="space-y-6">
                {/* Customer Info Inputs (same as before) */}
                {/* ... */}
                {/* Payment Details */}
                <div className="pt-6 border-t border-gray-200">
                  <h2 className="text-xl font-semibold uppercase tracking-wide mb-6">Payment Details</h2>
                  <div className="bg-gray-50 p-6 mb-6 rounded-xl border border-gray-100">
                    <p className="text-sm font-medium mb-4">
                      Please make a payment to the following bank account:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Bank</p>
                        <p className="font-medium">Sampath Bank</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Branch</p>
                        <p className="font-medium">Malabe</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Account Name</p>
                        <p className="font-medium">Methma Gunasingha</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Account Number</p>
                        <p className="font-medium">710 890 4965</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Branch Code</p>
                        <p className="font-medium">053</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block uppercase text-xs font-medium text-gray-500 mb-2">
                      Upload Payment Receipt
                    </label>
                    <div className="border-2 border-dashed p-6 text-center border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-300">
                      <div className="cursor-pointer" onClick={handleImageChange}>
                        <div className="flex flex-col items-center">
                          {/* SVG icon */}
                          <p className="text-sm font-medium">
                            {paymentImage ? paymentImage.name : "Click to upload payment receipt"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            JPG, PNG or PDF
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-6">
                  <button
                    onClick={handleSavePurchase}
                    className="w-full bg-black text-white py-4 font-medium uppercase tracking-wide rounded-full hover:bg-gray-800 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Complete Purchase"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
