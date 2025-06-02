import { connectDb } from "@/app/ults/db/ConnectDb";
import UserModel from "@/app/ults/models/UserModel";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
dotenv.config();

export async function POST(req) {
  try {
    const reqBody = await req.json();

    await connectDb();

    const { password, token } = reqBody;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token found" },
        { status: 400 }
      );
    }
    if (!password || !token) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userEmail = decodedToken.email;

    const user = await UserModel.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.forgettenPasswordToken = "";
    await user.save();

    return NextResponse.json(
      { success: true, message: "Password changed" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred" },
      { status: 500 }
    );
  }
}
