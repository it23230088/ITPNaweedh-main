import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditPurchase = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentImage, setPaymentImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [productName, setProductName] = useState('');
  const [productSize, setProductSize] = useState('L');
  const [productPrice, setProductPrice] = useState(0);
  const [errors, setErrors] = useState({});
  const [stockError, setStockError] = useState('');
  const [maxQuantity, setMaxQuantity] = useState(null);

  useEffect(() => {
    const fetchPurchase = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5555/purchaseList/${id}`);
        const purchase = response.data;
        setCustomerName(purchase.customerName);
        setEmail(purchase.email);
        setPhone(purchase.phone);
        setAddress(purchase.address);
        setQuantity(purchase.quantity);
        setProductName(purchase.productName);
        setProductSize(purchase.productSize);
        setProductPrice(purchase.productPrice);
        setTotalPrice(purchase.totalPrice);
        setCurrentImageUrl(purchase.paymentSlipUrl);
      } catch (error) {
        console.error('Error fetching purchase:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchase();
  }, [id]);

  useEffect(() => {
    setTotalPrice(productPrice * quantity);
  }, [quantity, productPrice]);

  const handleImageChange = (e) => {
    setPaymentImage(e.target.files[0]);
  };

  const validateForm = () => {
    let formErrors = {};

    if (!customerName) formErrors.customerName = 'Customer name is required';
    if (!email) {
      formErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = 'Email is invalid';
    }
    if (!phone) formErrors.phone = 'Phone number is required';
    if (!address) formErrors.address = 'Delivery address is required';
    if (!quantity || quantity <= 0) formErrors.quantity = 'Quantity must be a positive number';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleUpdatePurchase = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('customerName', customerName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('address', address);
    formData.append('productName', productName);
    formData.append('quantity', quantity);
    formData.append('productSize', productSize);
    formData.append('productPrice', productPrice);
    formData.append('totalPrice', totalPrice);

    if (paymentImage) {
      formData.append('paymentImage', paymentImage);
    } else {
      formData.append('paymentSlipUrl', currentImageUrl);
    }

    setLoading(true);
    setStockError('');

    try {
      await axios.put(`http://localhost:5555/purchaseList/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoading(false);
      navigate('/purchaseList');
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 400) {
        if (error.response.data.message === 'Not enough stock available') {
          setMaxQuantity(error.response.data.availableQuantity);
          setStockError(`Not enough stock available. Maximum quantity available: ${error.response.data.availableQuantity}`);
        } else {
          setStockError(error.response.data.message || 'An error occurred while processing your request.');
        }
      } else {
        console.error('Error updating purchase:', error);
      }
    }
  };

  const SizeButton = ({ size }) => (
    <button
      type="button"
      className={`px-4 py-2 mr-2 rounded-full transition-all duration-300 ${productSize === size ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
      onClick={() => setProductSize(size)}
    >
      {size}
    </button>
  );

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Edit Purchase</h1>

      <div className="flex flex-col md:flex-row md:space-x-6 max-w-6xl mx-auto">
        <div className="w-full md:w-1/3 mb-6 md:mb-0">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mt-4">
              <p className="text-2xl font-semibold text-gray-800">{productName}</p>
              <p className="text-xl font-bold text-blue-600 mt-2">LKR {productPrice.toFixed(2)}</p>
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
            <form onSubmit={handleUpdatePurchase} className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-600 mb-2">Your Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.customerName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your full name"
                />
                {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-600 mb-2">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-600 mb-2">Delivery Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your delivery address"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-600 mb-2">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const newQuantity = parseInt(e.target.value);
                    setQuantity(newQuantity);
                    if (maxQuantity !== null && newQuantity > maxQuantity) {
                      setStockError(`Maximum quantity available: ${maxQuantity}`);
                    } else {
                      setStockError('');
                    }
                  }}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
                  min="1"
                  max={maxQuantity || undefined}
                />
                {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
                {stockError && (
                  <p className="text-red-500 mt-2 bg-red-100 border border-red-400 rounded p-2">
                    {stockError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-600 mb-2">Total Price</label>
                <input
                  type="text"
                  value={`LKR ${totalPrice.toFixed(2)}`}
                  className="w-full px-4 py-2 border rounded-md bg-gray-100 font-bold text-lg"
                  disabled
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-600 mb-2">Update Payment Slip</label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="w-full text-gray-700 mt-2 p-2 border rounded-md border-gray-300"
                />
                {currentImageUrl && (
                  <img
                    src={`http://localhost:5555${currentImageUrl}`}
                    alt="Current Payment Slip"
                    className="mt-2 max-w-xs rounded-md"
                  />
                )}
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-3 px-6 rounded-full w-full md:w-1/2 hover:bg-blue-600 transition-colors duration-300 text-lg font-semibold shadow-md"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Update Purchase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPurchase;