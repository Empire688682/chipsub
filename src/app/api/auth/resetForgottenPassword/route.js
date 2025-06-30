import { connectDb } from "@/app/ults/db/ConnectDb";
import UserModel from "@/app/ults/models/UserModel";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { corsHeaders } from "@/app/ults/corsHeaders/corsHeaders";

dotenv.config();

export async function OPTIONS() {
    return new NextResponse(null, {status:200, headers:corsHeaders});
}

export async function POST(req) {
  try {
    const reqBody = await req.json();
    await connectDb();

    const { password, token } = reqBody;

    if (!password || !token) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400, headers:corsHeaders }
      );
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      console.log("Tokenerr:", error)
      if (error.name === "TokenExpiredError") {
        return NextResponse.json(
          {
            success: false,
            message: "Token has expired. Please request a new password reset.",
          },
          { status: 400, headers:corsHeaders }
        );
      }
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token. Please request a new password reset.",
        },
        { status: 400, headers:corsHeaders }
      );
    }

    const userEmail = decodedToken.email;
    const user = await UserModel.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401, headers:corsHeaders }
      );
    }

    if (user.forgottenPasswordToken !== token) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Token mismatch. Please check your latest email or request a new reset link.",
        },
        { status: 400, headers:corsHeaders }
      );
    };

    const isOldPassword = await bcrypt.compare(password, user.password);
    if (isOldPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot reuse your old password.",
        },
        { status: 400, headers:corsHeaders }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.forgottenPasswordToken = "";
    await user.save();

    return NextResponse.json(
      { success: true, message: "Password changed successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred" },
      { status: 500, headers:corsHeaders }
    );
  }
}
