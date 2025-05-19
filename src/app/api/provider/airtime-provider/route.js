import mongoose from "mongoose";
import TransactionModel from "@/app/ults/models/TransactionModel";
import UserModel from "@/app/ults/models/UserModel";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDb } from "@/app/ults/db/ConnectDb";
import { verifyToken } from "../../helper/VerifyToken";

dotenv.config();

export async function POST(req) {
  await connectDb();
  const reqBody = await req.json();

  const session = await mongoose.startSession(); // 👈 Start a session
  session.startTransaction(); // 👈 Begin the transaction

  try {
    const { network, amount, number, pin } = reqBody;

    if (!network || !amount || !number || !pin) {
      await session.abortTransaction(); session.endSession();
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const userId = await verifyToken(req);
    const verifyUser = await UserModel.findById(userId).session(session);

    if (!verifyUser) {
      await session.abortTransaction(); session.endSession();
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    if (Number(pin) === 1234) {
      await session.abortTransaction(); session.endSession();
      return NextResponse.json(
        { success: false, message: "1234 is not allowed" },
        { status: 400 }
      );
    }

    if (verifyUser.walletBalance < amount) {
      await session.abortTransaction(); session.endSession();
      return NextResponse.json(
        { success: false, message: "Insufficient balance" },
        { status: 400 }
      );
    }

    const isPinCorrect = await bcrypt.compare(pin, verifyUser.pin);
    if (!isPinCorrect) {
      await session.abortTransaction(); session.endSession();
      return NextResponse.json(
        { success: false, message: "Incorrect PIN provided!" },
        { status: 400 }
      );
    }

    // 👉 Call external API
    const res = await fetch(`https://www.nellobytesystems.com/APIAirtimeV1.asp?UserID=${process.env.CLUBKONNECT_USERID}&APIKey=${process.env.CLUBKONNECT_APIKEY}&MobileNetwork=${network}&Amount=${amount}&MobileNumber=${number}`, {
      method: "GET",
    });

    const result = await res.json();

    if (result.status !== "ORDER_RECEIVED") {
      await session.abortTransaction(); session.endSession();
      return NextResponse.json(
        { success: false, message: "API Transaction Failed", details: result },
        { status: 500 }
      );
    }

    // ✅ Deduct wallet and log transaction (within session)
    verifyUser.walletBalance -= amount;
    await verifyUser.save({ session });

    const newTransaction = await TransactionModel.create(
      [{
        userId,
        type: "airtime",
        amount,
        status: "success",
        reference: result.orderid,
        metadata: {
          network,
          number,
        }
      }],
      { session }
    );

    await session.commitTransaction(); // 👈 Commit if all is good
    session.endSession();

    return NextResponse.json(
      { success: true, message: "Airtime Purchase Successful", transaction: newTransaction[0] },
      { status: 200 }
    );

  } catch (error) {
    console.log("Transaction error:", error);
    await session.abortTransaction(); //Rollback everything on error
    session.endSession();

    return NextResponse.json(
      { success: false, message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
