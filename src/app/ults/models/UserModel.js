import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bvnVerify: { type: Boolean, default: false },
    walletBalance: { type: Number, default: 0 },
    phone: { type: String },
  },
  {
    minimize: true,
    timestamps: true,
  }
);

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;
