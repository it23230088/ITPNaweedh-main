import { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/products')
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

  // Handle product delete
  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setLoading(true);
      axios
        .delete(`http://localhost:5555/products/${productId}`)
        .then(() => {
          setProducts(products.filter((product) => product._id !== productId));
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setError('Failed to delete product');
          setLoading(false);
        });
    }
  };

  // Filter products based on search query and category filter
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  // Function to truncate the description to 2 or 3 words
  const truncateDescription = (description, limit = 30) => {
    if (description.length > limit) {
      return description.substring(0, limit) + '...';
    }
    return description;
  };

  // Function to calculate total value of all products
  const calculateTotalValue = () => {
    return filteredProducts.reduce((acc, product) => acc + product.price * product.stockQuantity, 0);
  };

  // Function to calculate the number of products per category
  const calculateCategoryQuantities = () => {
    return filteredProducts.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + product.stockQuantity;
      return acc;
    }, {});
  };

  // PDF Generation (with hiding the Actions column)
  const generatePdfReport = () => {
    const actionColumns = document.querySelectorAll('.actions-column');
    // Hide the Actions column before generating the PDF
    actionColumns.forEach(column => column.style.display = 'none');

    const input = document.getElementById('product-table');

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();

      const imgWidth = 200;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 5, 5, imgWidth, imgHeight);
      pdf.save('product-report.pdf');

      // Restore the Actions column after generating the PDF
      actionColumns.forEach(column => column.style.display = '');
    }).catch((error) => {
      console.error('Error generating PDF:', error);
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
     <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Products</h1>

        {/* Button Group */}
        <div className="space-x-4">  {/* Spacing between buttons */}
          <Link to="/admin/dashboard">
            <button className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-md transition duration-300">
              Admin Dashboard
            </button>
          </Link>
          <Link to="/purchaseList">
            <button className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-md transition duration-300">
              Purchase Management
            </button>
          </Link>
          <Link to="/products/create">
            <button className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-md transition duration-300">
              Add New Product
            </button>
          </Link>
        </div>
      </div>


      {/* Search and Category Filter */}
      <div className="flex space-x-4 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by product name..."
          className="border rounded-md py-2 px-4 w-1/3"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border rounded-md py-2 px-4"
        >
          <option value="">All Categories</option>
          {[...new Set(products.map((product) => product.category))].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Generate PDF Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={generatePdfReport}
          className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Generate PDF Report
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div id="product-table" className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-sky-600 text-white text-lg">
                <th className="py-4 px-6 text-center">No.</th>
                <th className="py-4 px-6 text-left">Image</th>
                <th className="py-4 px-6 text-left">Name</th>
                <th className="py-4 px-6 text-left max-md:hidden">Description</th>
                <th className="py-4 px-6 text-left max-md:hidden">Price</th>
                <th className="py-4 px-6 text-left max-md:hidden">Quantity</th>
                <th className="py-4 px-6 text-left max-md:hidden">Category</th>
                <th className="py-4 px-6 text-center actions-column">Actions</th> {/* Add this class */}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={product._id} className="border-t hover:bg-gray-50 transition duration-300">
                  <td className="py-4 px-6 text-center">{index + 1}</td>
                  <td className="py-4 px-6">
                    {product.imageUrl ? (
                      <img
                        src={`http://localhost:5555${product.imageUrl}`}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      'No Image'
                    )}
                  </td>
                  <td className="py-4 px-6">{product.name}</td>
                  <td className="py-4 px-6 max-md:hidden">{truncateDescription(product.description)}</td>
                  <td className="py-4 px-6 max-md:hidden">{product.price}</td>
                  <td className="py-4 px-6 max-md:hidden">{product.stockQuantity}</td>
                  <td className="py-4 px-6 max-md:hidden">{product.category}</td>
                  <td className="py-4 px-6 text-center actions-column"> {/* Add this class */}
                    <div className="flex justify-center items-center space-x-4">
                      <Link to={`/products/details/${product._id}`} title="View Details">
                        <BsInfoCircle className="text-2xl text-green-600 hover:text-green-800 transition duration-300" />
                      </Link>
                      <Link to={`/products/edit/${product._id}`} title="Edit">
                        <AiOutlineEdit className="text-2xl text-yellow-500 hover:text-yellow-700 transition duration-300" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        title="Delete"
                        className="text-2xl text-red-600 hover:text-red-800 transition duration-300"
                      >
                        <MdOutlineDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary Section */}
          {filteredProducts.length > 0 && (
            <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Summary</h2>
              
              {/* Category Quantities */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Product Quantity by Category</h3>
                <ul className="list-disc list-inside">
                  {Object.entries(calculateCategoryQuantities()).map(([category, quantity]) => (
                    <li key={category}>
                      {category}: {quantity} items
                    </li>
                  ))}
                </ul>
              </div>

              {/* Total Value */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Total Value of Products</h3>
                <p>LKR {calculateTotalValue().toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Product;