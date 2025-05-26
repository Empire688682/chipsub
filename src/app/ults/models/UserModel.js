import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for Google users
    pin: { type: String },      // Optional for Google users
    bvnVerify: { type: Boolean, default: false },
    walletBalance: { type: Number, default: 0 },
    commisionBalance: { type: Number, default: 0 },
    number: { type: String }, // Optional for Google users
    referralHost: { type: String }, // Add this for referrals
    provider: { type: String, default: "credentials" }, // 'google' or 'credentials'
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
export default UserModel;
