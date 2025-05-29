import mongoose from "mongoose";

const providerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, default: "ClubConnect" },
    amount: { type: Number, required: true, default: 0 },
    lastUser: { type: String, default: "" },
    lastAction: { type: String, enum: ["debit", "credit"], default: "debit" },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Provider || mongoose.model("Provider", providerSchema);
