import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "NGN" },
    reference: { type: String, required: true, unique: true },
    status: { type: String, enum: ["PENDING", "PAID", "FAILED"], default: "PENDING" },
    paymentMethod: { type: String, default: "FLUTTERWAVE" },
    checkoutLink: { type: String },
    initResponse: {
      status: { type: String },
      message: { type: String },
    },
    datePaid: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
