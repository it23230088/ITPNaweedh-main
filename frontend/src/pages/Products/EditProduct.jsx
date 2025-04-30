import React, { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  const predefinedCategories = ['T-shirts', 'Hoodies', 'Caps & Hats', 'Accessories'];

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/products/${id}`)
      .then((response) => {
        const { name, description, price, stockQuantity, category } = response.data;
        setName(name);
        setDescription(description);
        setPrice(price);
        setStockQuantity(stockQuantity);
        setCategory(category);
        setLoading(false);
      }).catch((error) => {
        setLoading(false);
        alert('An error happened. Please check console');
        console.log(error);
      });
  }, [id]);

  const validateForm = () => {
    let formErrors = {};

    if (!name) {
      formErrors.name = 'Product name is required';
    }
    if (!description) {
      formErrors.description = 'Description is required';
    }
    if (!price) {
      formErrors.price = 'Price is required';
    } else if (price <= 0) {
      formErrors.price = 'Price must be a positive number';
    }
    if (!stockQuantity) {
      formErrors.stockQuantity = 'Stock quantity is required';
    } else if (stockQuantity <= 0) {
      formErrors.stockQuantity = 'Stock quantity must be a positive number';
    }
    if (!category) {
      formErrors.category = 'Category is required';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleEditProduct = () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stockQuantity', stockQuantity);
    formData.append('category', category);

    if (image) {
      formData.append('image', image);
    }

    setLoading(true);
    axios.put(`http://localhost:5555/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(() => {
        setLoading(false);
        navigate('/products');
      })
      .catch((error) => {
        setLoading(false);
        alert('An error happened. Please check console');
        console.log(error);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <BackButton destination="/products" />
        </div>
        
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="p-6 sm:p-10">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Edit Product</h1>
            
            {loading ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                      placeholder="Enter product name"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.description ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                      placeholder="Enter product description"
                      rows="4"
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">$</span>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className={`w-full pl-8 pr-4 py-3 rounded-lg border ${
                          errors.price ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                  </div>

                  {/* Stock Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      value={stockQuantity}
                      onChange={(e) => setStockQuantity(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.stockQuantity ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                      placeholder="0"
                    />
                    {errors.stockQuantity && <p className="text-red-500 text-xs mt-1">{errors.stockQuantity}</p>}
                  </div>

                  {/* Category */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.category ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white`}
                    >
                      <option value="">Select a category</option>
                      {predefinedCategories.map((cat, index) => (
                        <option key={index} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                  </div>

                  {/* Product Image */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-200 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                    {image && (
                      <p className="text-sm text-gray-600 mt-2">Selected file: {image.name}</p>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={() => navigate('/products')}
                    className="py-3 px-6 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-all duration-200 flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditProduct}
                    className="py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 flex-1 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;