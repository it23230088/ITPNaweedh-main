import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const WarrantyList = () => {
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWarranties = async () => {
      try {
        const response = await axios.get('http://localhost:5555/api/warranties');
        setWarranties(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching warranties:', error);
        setLoading(false);
      }
    };

    fetchWarranties();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const daysLeft = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">Expired</span>;
    } else if (daysLeft <= 30) {
      return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Expiring Soon</span>;
    } else {
      return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span>;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Warranties</h1>
        <Link
          to="/warranties/add"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add New Warranty
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {warranties.map((warranty) => (
              <tr key={warranty._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{warranty.productName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{formatDate(warranty.startDate)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{formatDate(warranty.endDate)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(warranty.endDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    to={`/warranties/edit/${warranty._id}`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WarrantyList; 