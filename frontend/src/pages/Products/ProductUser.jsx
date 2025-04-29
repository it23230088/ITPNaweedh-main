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
    <div className="mx-4 sm:mx-[10%]">
      {/* Header section with title */}
      <div className="flex flex-col items-center gap-4 py-16 text-[#262626]">
        <h1 className="text-3xl font-medium">Our Collections</h1>
        <p className="sm:w-1/3 text-center text-sm">
          Simply browse through our extensive list of quality eye care products.
        </p>

        {/* Search and filter section */}
        <div className="flex flex-col md:flex-row w-full max-w-3xl gap-4 mt-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name..."
            className="flex-1 px-6 py-3 text-sm font-light rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-6 py-3 text-sm font-light rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Categories</option>
            {[...new Set(products.map((product) => product.category))].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products display section */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center py-20">{error}</p>
      ) : (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10 mb-20">
          {sortedProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => handleClick(product)}
              className={`cursor-pointer transition-all duration-300 ${
                product.stockQuantity === 0 ? 'opacity-70' : 'hover:translate-y-[-10px]'
              }`}
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative">
                  {product.imageUrl ? (
                    <img
                      src={`http://localhost:5555${product.imageUrl}`}
                      alt={product.name}
                      className="w-full h-56 object-cover"
                    />
                  ) : (
                    <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  {product.stockQuantity === 0 && (
                    <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
                      <span className="text-[#595959] text-lg font-medium">Sold Out</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-base font-medium text-[#262626] mb-1">{product.name}</h2>
                  <p className="text-primary font-semibold mb-2">LKR {product.price}</p>
                  <p className="text-sm text-gray-500 mb-4">{product.category}</p>
                  <button 
                    className={`w-full px-8 py-3 text-sm rounded-full transition-all duration-300 ${
                      product.stockQuantity === 0 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-primary text-white hover:scale-105'
                    }`}
                    disabled={product.stockQuantity === 0}
                  >
                    {product.stockQuantity === 0 ? 'Sold Out' : 'View Details'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* CTA section */}
      {!loading && !error && sortedProducts.length > 0 && (
        <div className="flex bg-primary rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20">
          <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-20 lg:pl-5">
            <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">
              <p>Premium Eye Care Products</p>
              <p className="mt-4">For Your Vision Health</p>
            </div>
            <button className="bg-white text-sm text-[#595959] px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all">
              Shop Now
            </button>
          </div>
          <div className="hidden md:block md:w-1/2 lg:w-[370px] relative">
            {/* This would be replaced with an actual product image */}
            <div className="w-full h-64 md:absolute bottom-0 right-0"></div>
          </div>
        </div>
      )}
      
      {/* No products found message */}
      {!loading && !error && sortedProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg text-gray-600 mb-6">No products found matching your criteria</p>
          <button 
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('');
            }}
            className="px-8 py-3 font-light text-white rounded-full bg-primary"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductUser;