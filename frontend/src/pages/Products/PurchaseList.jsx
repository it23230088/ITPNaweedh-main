import React, { useEffect, useState } from "react";
import axios from "axios";
//import jsPDF from "jspdf";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import "jspdf-autotable";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";

// Spinner fallback if you don't have a Spinner component
const Spinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const PRIMARY = "#5F6FFF";
const PRIMARY_DARK = "#3a47b8";
const PRIMARY_LIGHT = "#e8ebff";

const PurchaseData = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favoriteProducts, setFavoriteProducts] = useState({
    most: null,
    least: null,
  });



  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchPurchases = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5555/purchaseList");
        const purchasesWithStatus = response.data.data.map((purchase) => ({
          ...purchase,
          approvalStatus: purchase.approvalStatus || null,
        }));
        setPurchases(purchasesWithStatus);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  useEffect(() => {
    const productCounts = purchases.reduce((acc, purchase) => {
      acc[purchase.productName] = (acc[purchase.productName] || 0) + 1;
      return acc;
    }, {});

    const sortedProducts = Object.entries(productCounts).sort(
      (a, b) => b[1] - a[1]
    );

    setFavoriteProducts({
      most: sortedProducts[0] ? sortedProducts[0][0] : null,
      least: sortedProducts[sortedProducts.length - 1]
        ? sortedProducts[sortedProducts.length - 1][0]
        : null,
    });
  }, [purchases]);

  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearchQuery =
      purchase.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(purchase.phone)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      purchase.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.productName.toLowerCase().includes(searchQuery.toLowerCase());

    const normalizeDate = (date) => {
      const normalizedDate = new Date(date);
      normalizedDate.setHours(0, 0, 0, 0);
      return normalizedDate;
    };

    const purchaseDate = normalizeDate(purchase.purchaseDate);
    const start = startDate ? normalizeDate(startDate) : null;
    const end = endDate ? normalizeDate(endDate) : null;

    const isWithinDateRange =
      (!start || purchaseDate >= start) && (!end || purchaseDate <= end);

    return matchesSearchQuery && isWithinDateRange;
  });

  const totalPurchases = filteredPurchases.length;
  const totalAmount = filteredPurchases.reduce(
    (sum, purchase) => sum + parseFloat(purchase.totalPrice),
    0
  );

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Purchase Data", 14, 16);

    doc.setFontSize(12);
    doc.text(
      `Most Favorite Product: ${favoriteProducts.most || "N/A"}`,
      14,
      25
    );
    doc.text(
      `Least Favorite Product: ${favoriteProducts.least || "N/A"}`,
      14,
      32
    );

    const tableColumn = [
      "No.",
      "Customer Name",
      "Email",
      "Phone",
      "Product Name",
      "Quantity",
      "Total Price",
      "Purchase Date",
    ];
    const tableRows = filteredPurchases.map((purchase, index) => [
      index + 1,
      purchase.customerName,
      purchase.email,
      purchase.phone,
      purchase.productName,
      purchase.quantity,
      `LKR ${purchase.totalPrice}`,
      new Date(purchase.purchaseDate).toLocaleDateString(),
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
    });

    doc.save("purchase-data.pdf");
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background: `linear-gradient(135deg, ${PRIMARY_LIGHT}, #fff 80%)`,
      }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1
          className="text-4xl font-bold drop-shadow mb-4 md:mb-0"
          style={{ color: PRIMARY }}
        >
          Purchase List
        </h1>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/admin/dashboard">
            <button
              className="font-bold py-2 px-4 rounded-full shadow transition duration-300"
              style={{
                background: PRIMARY,
                color: "#fff",
                border: "none",
              }}
            >
              Admin Dashboard
            </button>
          </Link>
          <Link to="/products">
            <button
              className="font-bold py-2 px-4 rounded-full shadow transition duration-300 border"
              style={{
                background: "#fff",
                color: PRIMARY,
                borderColor: PRIMARY,
              }}
            >
              Product Management
            </button>
          </Link>
          <Link to="/productViews">
            <button
              className="font-bold py-2 px-4 rounded-full shadow transition duration-300"
              style={{
                background: PRIMARY,
                color: "#fff",
                border: "none",
              }}
            >
              Add Purchase
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div
          className="bg-white rounded-2xl p-4 shadow border-l-4"
          style={{ borderColor: PRIMARY }}
        >
          <h3 className="text-lg text-gray-600">Total Purchases</h3>
          <p className="text-2xl font-bold" style={{ color: PRIMARY }}>
            {totalPurchases}
          </p>
        </div>
        <div
          className="bg-white rounded-2xl p-4 shadow border-l-4"
          style={{ borderColor: PRIMARY }}
        >
          <h3 className="text-lg text-gray-600">Total Amount</h3>
          <p className="text-2xl font-bold" style={{ color: PRIMARY }}>
            LKR {totalAmount.toFixed(2)}
          </p>
        </div>
        <div
          className="bg-white rounded-2xl p-4 shadow border-l-4"
          style={{ borderColor: PRIMARY }}
        >
          <h3 className="text-lg text-gray-600">Most Favorite Product</h3>
          <p className="text-xl" style={{ color: PRIMARY }}>
            {favoriteProducts.most || "N/A"}
          </p>
        </div>
        <div
          className="bg-white rounded-2xl p-4 shadow border-l-4"
          style={{ borderColor: PRIMARY }}
        >
          <h3 className="text-lg text-gray-600">Least Favorite Product</h3>
          <p className="text-xl" style={{ color: PRIMARY }}>
            {favoriteProducts.least || "N/A"}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <input
          type="text"
          placeholder="Search by customer name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-4 py-2 rounded-full focus:ring-2 w-full max-w-xs transition"
          style={{
            borderColor: PRIMARY,
            outlineColor: PRIMARY,
          }}
        />
        <div>
          <label className="mr-2" style={{ color: PRIMARY }}>
            From:
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-4 py-2 rounded-full focus:ring-2 transition"
            style={{
              borderColor: PRIMARY,
              outlineColor: PRIMARY,
            }}
          />
        </div>
        <div>
          <label className="mr-2" style={{ color: PRIMARY }}>
            To:
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-4 py-2 rounded-full focus:ring-2 transition"
            style={{
              borderColor: PRIMARY,
              outlineColor: PRIMARY,
            }}
          />
        </div>
        <button
          onClick={downloadPDF}
          className="font-bold py-2 px-4 rounded-full shadow transition duration-300"
          style={{
            background: PRIMARY,
            color: "#fff",
            border: "none",
          }}
        >
          Download PDF
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border shadow-lg rounded-xl overflow-hidden">
            <thead>
              <tr>
                {[
                  "No.",
                  "Customer Name",
                  "Email",
                  "Phone",
                  "Address",
                  "Product Name",
                  "Quantity",
                  "Size",
                  "Purchase Date",
                  "Total",
                  "Payment Slip",
                  "Operations",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
                    style={{
                      background: PRIMARY,
                      color: "#fff",
                      borderBottom: `2px solid ${PRIMARY_LIGHT}`,
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((purchase, index) => (
                  <tr key={purchase._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {purchase.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {purchase.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {purchase.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {purchase.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {purchase.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {purchase.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {purchase.productSize}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(purchase.purchaseDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      LKR {purchase.totalPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {purchase.paymentSlipUrl ? (
                        <img
                          src={`http://localhost:5555${purchase.paymentSlipUrl}`}
                          alt="Payment"
                          className="h-16 w-16 object-cover rounded-md border"
                          style={{ borderColor: PRIMARY }}
                        />
                      ) : (
                        <span className="text-sm text-gray-500">No Image</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex justify-center gap-x-4">
                        <Link to={`/purchaseList/edit/${purchase._id}`}>
                          <AiOutlineEdit style={{ color: "#FFD600", fontSize: 22 }} />
                        </Link>
                        <Link to={`/purchaseList/delete/${purchase._id}`}>
                          <MdOutlineDelete style={{ color: "#FF1744", fontSize: 22 }} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="13"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No Purchases found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PurchaseData;
