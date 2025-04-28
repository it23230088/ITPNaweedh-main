import React, { useState } from "react";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateProducts = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState(1);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const predefinedCategories = [
    "T-shirts",
    "Hoodies",
    "Caps & Hats",
    "Accessories",
  ];

  const validateForm = () => {
    let formErrors = {};

    if (!name) formErrors.name = "Product name is required";
    if (!description) formErrors.description = "Description is required";
    if (!price) formErrors.price = "Price is required";
    else if (price <= 0) formErrors.price = "Price must be a positive number";
    if (!stockQuantity) formErrors.stockQuantity = "Stock quantity is required";
    else if (stockQuantity <= 0)
      formErrors.stockQuantity = "Stock quantity must be a positive number";
    if (!category) formErrors.category = "Category is required";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    // Clear the error for the specific field
    setErrors((prev) => ({ ...prev, [field]: undefined }));

    // Update the state for the field
    switch (field) {
      case "name":
        setName(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "price":
        setPrice(value);
        break;
      case "stockQuantity":
        setStockQuantity(value);
        break;
      case "category":
        setCategory(value);
        break;
      default:
        break;
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSaveProduct = () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stockQuantity", stockQuantity);
    formData.append("category", category);
    if (image) formData.append("image", image);

    setLoading(true);
    axios
      .post("http://localhost:5555/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        setLoading(false);
        navigate("/products");
      })
      .catch((error) => {
        setLoading(false);
        alert("An error happened. Please check console");
        console.log(error);
      });
  };

  return (
    <div className="min-h-screen bg-blue-100 p-8">
      <BackButton />
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-4xl font-bold mb-6 text-center text-sky-500">
          New Product
        </h1>
        {loading && <Spinner />}
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-4 py-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500`}
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={`w-full px-4 py-2 border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500`}
              placeholder="Enter product description"
              rows="4"
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              className={`w-full px-4 py-2 border ${
                errors.price ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500`}
              placeholder="Enter product price"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Stock Quantity
            </label>
            <input
              type="number"
              value={stockQuantity}
              onChange={(e) =>
                handleInputChange("stockQuantity", e.target.value)
              }
              className={`w-full px-4 py-2 border ${
                errors.stockQuantity ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500`}
              placeholder="Enter product quantity"
            />
            {errors.stockQuantity && (
              <p className="text-red-500 text-sm mt-1">
                {errors.stockQuantity}
              </p>
            )}
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className={`w-full px-4 py-2 border ${
                errors.category ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500`}
            >
              <option value="">Select a category</option>
              {predefinedCategories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Product Image
            </label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <button
            onClick={handleSaveProduct}
            className="w-full py-3 bg-sky-500 text-white font-bold rounded-md hover:bg-sky-600 transition duration-300"
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProducts;
9;
