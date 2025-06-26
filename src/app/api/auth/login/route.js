import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserModel from "@/app/ults/models/UserModel";
import dotenv from "dotenv";
import { NextResponse } from "next/server";
import { connectDb } from "@/app/ults/db/ConnectDb";

dotenv.config();

// CORS headers function
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// Handle preflight OPTIONS request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  });
}

export async function POST(request) {
  try {
    await connectDb();
    
    const reqBody = await request.json();
    const { email, password } = reqBody;
    
    const existUser = await UserModel.findOne({ email });
    if (!existUser) {
      return NextResponse.json(
        { success: false, message: "User not exist" }, 
        { 
          status: 400,
          headers: corsHeaders()
        }
      );
    }

    if (existUser.provider === "google") {
      if (existUser.password === "not set") {
        return NextResponse.json(
          { 
            success: false, 
            message: "User password not set, continue with google and set up your password" 
          }, 
          { 
            status: 400,
            headers: corsHeaders()
          }
        );
      }
    }

    const passwordMatch = await bcrypt.compare(password, existUser.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: "Incorrect password" }, 
        { 
          status: 400,
          headers: corsHeaders()
        }
      );
    }

    // Remove sensitive data from user object
    const { password: _, pin: __, ...userData } = existUser.toObject();
    const userId = existUser._id;
    const finalUserData = { ...userData, userId };

    // Generate JWT token
    const token = jwt.sign(
      { userId: existUser._id }, 
      process.env.SECRET_KEY, 
      { expiresIn: "1d" }
    );

    // Create response with CORS headers
    const response = NextResponse.json(
      { 
        success: true, 
        message: "User logged in successfully", 
        finalUserData,
        token // Include token in response for mobile app
      }, 
      { 
        status: 200,
        headers: corsHeaders()
      }
    );

    // Set cookie (mainly for web usage)
    response.cookies.set("UserToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      sameSite: "lax",
      path: "/"
    });

    return response;

  } catch (error) {
    console.log("Login-error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred" }, 
      { 
        status: 500,
        headers: corsHeaders()
      }
    );
  }
}