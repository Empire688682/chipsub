import mongoose from "mongoose";
import TransactionModel from "@/app/ults/models/TransactionModel";
import UserModel from "@/app/ults/models/UserModel";
import dotenv from "dotenv";
import bcrypt from "bcryptjs"; // <== YOU FORGOT THIS
import { NextResponse } from "next/server";
import { connectDb } from "@/app/ults/db/ConnectDb";
import { verifyToken } from "../../helper/VerifyToken";

dotenv.config();

export async function POST(req) {
  await connectDb();
  const reqBody = await req.json();

  try {
    const { network, amount, phone, pin } = reqBody;

    if (!network || !amount || !phone || !pin) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const userId = await verifyToken(req);
    const verifyUser = await UserModel.findById(userId);

    if (!verifyUser) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    if (pin === "1234") {
      return NextResponse.json(
        { success: false, message: "1234 is not allowed" },
        { status: 400 }
      );
    }

    if (verifyUser.amount < amount) {
      return NextResponse.json(
        { success: false, message: "Insufficient balance" },
        { status: 400 }
      );
    }

    const isPinCorrect = await bcrypt.compare(pin, verifyUser.pin);

    if (!isPinCorrect) {
      return NextResponse.json(
        { success: false, message: "Incorrect PIN" },
        { status: 400 }
      );
    }

    // ✅ 1. Deduct Wallet Balance
    verifyUser.amount -= amount;
    await verifyUser.save();

    // ✅ 2. Call Clubkonnect Airtime API
    const res = await fetch(`https://www.nellobytesystems.com/APIAirtimeV1.asp?UserID=${process.env.CLUBKONNECT_USERID}&APIKey=${process.env.CLUBKONNECT_APIKEY}&MobileNetwork=${network}&Amount=${amount}&MobileNumber=${phone}`, {
      method: "GET",
    });

    const result = await res.json();

    if (result.status !== "ORDER_RECEIVED") {
      return NextResponse.json(
        { success: false, message: "API Transaction Failed", details: result },
        { status: 500 }
      );
    }

    // ✅ 3. Log to DB
    const newTransaction = await TransactionModel.create({
        userId,
        type: "airtime",
        amount,
        status:"success",
        metadata: {
          network,
          phone
        }
      });
      

    return NextResponse.json(
      { success: true, message: "Airtime Purchase Successful", transaction: newTransaction },
      { status: 200 }
    );

  } catch (error) {
    console.error("Transaction error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
