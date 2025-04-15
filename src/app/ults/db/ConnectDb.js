import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDb = async () =>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Db connected successfully");
    } catch (error) {
        console.log("ERROR:", error);
    }
}