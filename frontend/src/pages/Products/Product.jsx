import { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';
import { FiDownload } from 'react-icons/fi';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Add Poppins font to your index.html head:
// <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [notifiedProducts, setNotifiedProducts] = useState(new Set());

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/products')
      .then((response) => {
        setProducts(response.data.data);
        setLoading(false);
        
        // Check for low stock items after loading products
        checkLowStockItems(response.data.data);
      })
      .catch((error) => {
        console.error(error);
        setError('Failed to fetch products');
        setLoading(false);
      });
  }, []);

  // Check for low stock items and show notifications
  const checkLowStockItems = (productsData) => {
    productsData.forEach(product => {
      if (product.stockQuantity <= 10 && !notifiedProducts.has(product._id)) {
        toast.warning(
          <div>
            <p><strong>Low Stock Alert!</strong></p>
            <p>{product.name} has only {product.stockQuantity} items left.</p>
            <button 
              className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-md text-sm"
              onClick={() => notifyVendor(product)}
            >
              Notify Vendor
            </button>
          </div>,
          {
            position: "top-right",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
          }
        );
        
        // Add to notified products set to avoid duplicate notifications
        setNotifiedProducts(prev => new Set(prev).add(product._id));
      }
    });
  };

  const notifyVendor = (product) => {
    // This would typically connect to your vendor notification system
    // For now, we'll just show a confirmation toast
    toast.success(`Vendor has been notified about low stock of ${product.name}`, {
      position: "bottom-right",
      autoClose: 3000,
    });
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setLoading(true);
      axios
        .delete(`http://localhost:5555/products/${productId}`)
        .then(() => {
          setProducts(products.filter((product) => product._id !== productId));
          setLoading(false);
          toast.success('Product deleted successfully', {
            position: "bottom-right",
            autoClose: 3000,
          });
        })
        .catch((error) => {
          console.error(error);
          setError('Failed to delete product');
          setLoading(false);
          toast.error('Failed to delete product', {
            position: "bottom-right",
            autoClose: 3000,
          });
        });
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const truncateDescription = (description, limit = 30) => {
    if (!description) return '';
    if (description.length > limit) {
      return description.substring(0, limit) + '...';
    }
    return description;
  };

  const calculateTotalValue = () => {
    return filteredProducts.reduce((acc, product) => acc + product.price * product.stockQuantity, 0);
  };

  const calculateCategoryQuantities = () => {
    return filteredProducts.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + product.stockQuantity;
      return acc;
    }, {});
  };

  const generatePdfReport = () => {
    const actionColumns = document.querySelectorAll('.actions-column');
    actionColumns.forEach(column => column.style.display = 'none');
    const input = document.getElementById('product-table');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 200;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 5, 5, imgWidth, imgHeight);
      pdf.save('product-report.pdf');
      actionColumns.forEach(column => column.style.display = '');
    }).catch((error) => {
      console.error('Error generating PDF:', error);
    });
  };

  return (
    <div
      className="min-h-screen w-full bg-[#f5f7fe] py-10 px-4 md:px-6"
      style={{ 
        fontFamily: 'Poppins, sans-serif',
        backgroundImage: 'radial-gradient(circle at top right, rgba(120, 119, 198, 0.1), transparent), radial-gradient(circle at bottom left, rgba(91, 143, 249, 0.1), transparent)',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover'
      }}
    >
      {/* Toast Container for notifications */}
      <ToastContainer />

      <div className="max-w-full mx-auto">
        {/* Header Section - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="col-span-1 md:col-span-2 bg-white rounded-2xl shadow-xl p-6 border border-indigo-100 backdrop-blur-sm bg-opacity-80">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Products Management
            </h1>
            <p className="text-gray-500">Organize, track, and manage your inventory with ease</p>
          </div>
          <div className="col-span-1 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex flex-col justify-between h-full">
              <h2 className="text-2xl font-semibold mb-2">Total Inventory</h2>
              <div className="text-5xl font-bold">{products.length}</div>
              <div className="text-indigo-100 text-sm mt-2">Products in database</div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link to="/admin/dashboard" className="col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 border border-blue-100 hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-80 flex items-center justify-center group h-full">
              <div className="text-center">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <p className="font-medium text-gray-700">Admin Dashboard</p>
              </div>
            </div>
          </Link>
          
          <Link to="/purchaseList" className="col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 border border-emerald-100 hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-80 flex items-center justify-center group h-full">
              <div className="text-center">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="font-medium text-gray-700">Purchase Management</p>
              </div>
            </div>
          </Link>
          
          <Link to="/products/create" className="col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 border border-rose-100 hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-80 flex items-center justify-center group h-full">
              <div className="text-center">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="font-medium text-gray-700">Add New Product</p>
              </div>
            </div>
          </Link>
          
          <div className="col-span-1">
            <button onClick={generatePdfReport} className="w-full h-full bg-white rounded-2xl shadow-lg p-4 border border-amber-100 hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-80 flex items-center justify-center group">
              <div className="text-center">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <FiDownload size={24} />
                </div>
                <p className="font-medium text-gray-700">Generate Report</p>
              </div>
            </button>
          </div>
        </div>

        {/* Search & Filter - Bento Style */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-blue-100 backdrop-blur-sm bg-opacity-80">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product name..."
                className="pl-10 w-full border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl py-3 px-4 transition font-medium bg-gray-50 focus:bg-white"
              />
            </div>
            <div className="w-full md:w-64">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl py-3 px-4 transition font-medium bg-gray-50 focus:bg-white appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: `right 0.5rem center`,
                  backgroundRepeat: `no-repeat`,
                  backgroundSize: `1.5em 1.5em`,
                  paddingRight: `2.5rem`
                }}
              >
                <option value="">All Categories</option>
                {[...new Set(products.map((product) => product.category))].map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center p-12">
            <Spinner />
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <p className="text-red-500 text-center font-medium">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {/* Product Table - Bento Style with responsive design */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100 backdrop-blur-sm bg-opacity-90">
              <div className="overflow-auto">
                <div id="product-table" className="min-w-full">
                  <table className="w-full text-base">
                    <thead>
                      <tr className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white text-lg">
                        <th className="py-4 px-2 text-center font-semibold">#</th>
                        <th className="py-4 px-2 text-left font-semibold">Image</th>
                        <th className="py-4 px-2 text-left font-semibold">Name</th>
                        <th className="py-4 px-2 text-left max-md:hidden font-semibold">Description</th>
                        <th className="py-4 px-2 text-left max-md:hidden font-semibold">Price</th>
                        <th className="py-4 px-2 text-left max-md:hidden font-semibold">Quantity</th>
                        <th className="py-4 px-2 text-left max-md:hidden font-semibold">Category</th>
                        <th className="py-4 px-2 text-center actions-column font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-gray-500 font-medium">
                            <div className="flex flex-col items-center justify-center">
                              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              <p className="text-lg">No products found.</p>
                              <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((product, index) => (
                          <tr
                            key={product._id}
                            className={`border-t ${index % 2 === 0 ? 'bg-indigo-50/50' : 'bg-white'} hover:bg-indigo-100/70 transition duration-300`}
                          >
                            <td className="py-4 px-2 text-center font-semibold">{index + 1}</td>
                            <td className="py-4 px-2">
                              {product.imageUrl ? (
                                <img
                                  src={`http://localhost:5555${product.imageUrl}`}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded-xl shadow-md border border-indigo-100"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                                  <span className="text-xs text-gray-400">No Image</span>
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-2 font-medium text-indigo-800">{product.name}</td>
                            <td className="py-4 px-2 max-md:hidden text-gray-600 max-w-xs truncate">{truncateDescription(product.description)}</td>
                            <td className="py-4 px-2 max-md:hidden whitespace-nowrap">
                              <span className="font-bold text-emerald-600">LKR {product.price}</span>
                            </td>
                            <td className="py-4 px-2 max-md:hidden">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                product.stockQuantity > 10 
                                  ? 'bg-green-100 text-green-800' 
                                  : product.stockQuantity > 0 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : 'bg-red-100 text-red-800'
                              }`}>
                                {product.stockQuantity}
                              </span>
                            </td>
                            <td className="py-4 px-2 max-md:hidden">
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {product.category}
                              </span>
                            </td>
                            <td className="py-4 px-2 text-center actions-column">
                              <div className="flex justify-center items-center gap-1">
                                <Link to={`/products/details/${product._id}`} title="View Details">
                                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition duration-300">
                                    <BsInfoCircle size={16} />
                                  </div>
                                </Link>
                                <Link to={`/products/edit/${product._id}`} title="Edit">
                                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 transition duration-300">
                                    <AiOutlineEdit size={16} />
                                  </div>
                                </Link>
                                <button
                                  onClick={() => handleDelete(product._id)}
                                  title="Delete"
                                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-200 transition duration-300"
                                >
                                  <MdOutlineDelete size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Summary Cards - Bento Style */}
            {filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Category Distribution Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100 backdrop-blur-sm bg-opacity-80">
                  <h2 className="text-xl font-bold mb-4 text-indigo-800 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Product Quantity by Category
                  </h2>
                  <div className="space-y-4">
                    {Object.entries(calculateCategoryQuantities()).map(([category, quantity]) => (
                      <div key={category} className="flex items-center">
                        <div className="w-32 flex-shrink-0 font-medium text-indigo-700">{category}</div>
                        <div className="flex-grow">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full" 
                              style={{ width: `${Math.min(100, (quantity / Math.max(...Object.values(calculateCategoryQuantities()))) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="ml-4 text-gray-700 font-semibold">{quantity}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Value Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-lg p-6 text-white flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Total Inventory Value
                    </h2>
                    <p className="text-indigo-200 text-sm">Combined value of all products in inventory</p>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mt-6">LKR {calculateTotalValue().toFixed(2)}</div>
                    <div className="text-indigo-200 text-sm mt-2">Based on current stock quantities</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Product;