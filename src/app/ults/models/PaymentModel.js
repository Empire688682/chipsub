import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "NGN",
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  reference: {
    type: String,
    required: true,
    unique: true, // ensures no duplicate payment
  },
  status: {
    type: String,
    enum: ["PENDING", "PAID", "FAILED"],
    required: true,
  },
  gatewayResponse: {
    type: Object, // Optional: store Monnify's full response for debugging/auditing
  },
  datePaid: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
