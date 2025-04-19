import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    type: { type: String, required: true }, // e.g., "airtime", "data", "electricity"
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },

    reference: { type: String, unique: true, sparse: true }, // Optional: you can generate this on create
    metadata: {
      network: { type: String },
      number: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const TransactionModel = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);

export default TransactionModel;
