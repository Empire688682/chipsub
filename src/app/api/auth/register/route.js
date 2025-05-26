import UserModel from "@/app/ults/models/UserModel";
import { connectDb } from "@/app/ults/db/ConnectDb";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import ReferralModel from "@/app/ults/models/ReferralModel";

dotenv.config();

const registerUser = async (req) => {
  const reBody = await req.json();

  try {
    await connectDb();

    const {
      name,
      email,
      number,
      password,
      refId,
      provider = "credentials", // 'credentials' or 'google'
    } = reBody;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Name and email are required" },
        { status: 400 }
      );
    }

    if (provider === "credentials" && (!password || !number)) {
      return NextResponse.json(
        { success: false, message: "Password and number are required" },
        { status: 400 }
      );
    }

    if (!validator.isEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: true, message: "User already exists", user: existingUser },
        { status: 200 }
      );
    }

    let hashedPassword = undefined;
    let defaultPin = undefined;

    if (provider === "credentials") {
      if (password.length < 8) {
        return NextResponse.json(
          { success: false, message: "Password must be at least 8 characters" },
          { status: 400 }
        );
      }

      hashedPassword = await bcrypt.hash(password, 10);
      defaultPin = "1234";
    }

    const newUser = await UserModel.create({
      name,
      email,
      number,
      password: hashedPassword,
      pin: defaultPin,
      referralHost: refId,
      provider,
    });

    // Handle referral if provided
    if (refId) {
      const refHost = await UserModel.findById(refId);
      if (refHost) {
        await ReferralModel.create({
          referrer: refHost._id,
          referredUser: newUser._id,
        });
      }
    }

    const { password: _, pin: __, ...userData } = newUser.toObject();
    const userId = newUser._id;
    const finalUserData = { ...userData, userId };

    const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const res = NextResponse.json(
      { success: true, message: "User created", finalUserData },
      { status: 200 }
    );

    res.cookies.set("UserToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
};

export async function POST(req) {
  return registerUser(req);
}
