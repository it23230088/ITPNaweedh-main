import mongoose from "mongoose";

const WarrantySchema = new mongoose.Schema({
  productName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Warranty = mongoose.model("Warranty", WarrantySchema);
export default Warranty;