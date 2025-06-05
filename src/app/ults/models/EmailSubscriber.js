import mongoose from "mongoose";

const EmailSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    source: {
      type: String,
      default: "footer-form", 
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const EmailSubscriber =
  mongoose.models.EmailSubscriber ||
  mongoose.model("EmailSubscriber", EmailSubscriberSchema);

export default EmailSubscriber;
