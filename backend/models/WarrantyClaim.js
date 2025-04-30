import mongoose from "mongoose";

const WarrantyClaimSchema = new mongoose.Schema({
  warrantyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warranty",
    required: true,
  },
  issueDescription: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  claimDate: { type: Date, default: Date.now },
});

const WarrantyClaim =
  mongoose.models.WarrantyClaim ||
  mongoose.model("WarrantyClaim", WarrantyClaimSchema);
export default WarrantyClaim;
