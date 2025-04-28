import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/Spinner';

const ProductUser = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/productViews')
      .then((response) => {
        setProducts(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError('Failed to fetch products');
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  // Sort products to push sold out items to the end
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (a.stockQuantity === 0 && b.stockQuantity > 0) return 1;
    if (a.stockQuantity > 0 && b.stockQuantity === 0) return -1;
    return 0;
  });

  const handleClick = (product) => {
    if (product.stockQuantity > 0) {
      navigate(`/productViews/purchaseForm`, {
        state: {
          productName: product.name,
          productPrice: product.price,
          productCategory: product.category,
          productImage: product.imageUrl
        }
      });
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <h1 className="text-5xl font-bold text-blue-800 mb-8 text-center mx-auto">Our Collections</h1>
      
      <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by product name..."
          className="border rounded-full py-2 px-6 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border rounded-full py-2 px-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Categories</option>
          {[...new Set(products.map((product) => product.category))].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {sortedProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => handleClick(product)}
              className={`cursor-pointer transform transition duration-300 ${
                product.stockQuantity === 0 ? 'opacity-50' : 'hover:scale-105'
              }`}
            >
              <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl relative">
                {product.stockQuantity === 0 && (
                  <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
                    <span className="text-white text-xl font-bold">Sold Out</span>
                  </div>
                )}
                <div className="flex justify-center mb-4">
                  {product.imageUrl ? (
                    <img
                      src={`http://localhost:5555${product.imageUrl}`}
                      alt={product.name}
                      className="w-48 h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold mb-2 text-center text-gray-800">{product.name}</h2>
                <p className="text-blue-600 font-semibold text-center mb-1">LKR {product.price}</p>
                <p className="text-gray-600 text-center">{product.category}</p>
                <button 
                  className={`mt-4 w-full bg-blue-500 text-white py-2 rounded-full transition duration-300 ${
                    product.stockQuantity === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                  }`}
                  disabled={product.stockQuantity === 0}
                >
                  {product.stockQuantity === 0 ? 'Sold Out' : 'View Details'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductUser;