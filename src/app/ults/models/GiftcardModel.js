// models/Giftcard.js
import mongoose from 'mongoose';

const giftcardSchema = new mongoose.Schema({
  cardType: { type: String, required: true },
  amount: { type: Number, required: true },
  code: { type: String, required: true },
  image: { type: String }, // URL or base64 maybe
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Giftcard || mongoose.model("Giftcard", giftcardSchema);
