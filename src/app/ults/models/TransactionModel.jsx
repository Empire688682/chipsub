import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    type: { type: String, required: true }, 
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },

    reference: { type: String, unique: true },
    metadata: { type: Object },
  },
  {
    timestamps: true,
  }
);

const TransactionModel = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);

export default TransactionModel;
