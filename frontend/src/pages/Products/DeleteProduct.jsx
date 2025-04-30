import React, { useState } from 'react';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const DeleteProduct = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDeleteProduct = () => {
    setLoading(true);
    axios
      .delete(`http://localhost:5555/products/${id}`)
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

  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <BackButton />
      <h1 className="text-3xl font-bold text-gray-800 my-6">Delete Product</h1>
      
      {loading ? (
        <div className="flex justify-center my-8">
          <Spinner />
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-center mb-6">
              <svg 
                className="w-16 h-16 text-red-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                ></path>
              </svg>
            </div>
            
            <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6">
              Are you sure you want to delete this product?
            </h3>
            
            <p className="text-gray-600 text-center mb-8">
              This action cannot be undone.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="px-6 py-3 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors flex-1"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="px-6 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors flex-1"
                onClick={handleDeleteProduct}
              >
                Yes, Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteProduct;