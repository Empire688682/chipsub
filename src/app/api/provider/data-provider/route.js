import mongoose from "mongoose";
import crypto from "crypto";
import TransactionModel from "@/app/ults/models/TransactionModel";
import UserModel from "@/app/ults/models/UserModel";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDb } from "@/app/ults/db/ConnectDb";
import { verifyToken } from "../../helper/VerifyToken";
import ProviderModel from "@/app/ults/models/ProviderModel";

dotenv.config();

export async function POST(req) {
  await connectDb();
  const reqBody = await req.json();

  const session = await mongoose.startSession(); // 👈 Start a session
  session.startTransaction(); // 👈 Begin the transaction

  try {
    const { network, plan, planId, number, amount, pin } = reqBody;

    if (!network || !plan || !planId || !number || !amount || !pin) {
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
    };

    const validNetwork = {
      "MTN": "01",
      "Glo": "02",
      "Airtel": "04",
      "m_9mobile": "03",
    };

    const mappedNetwork = validNetwork[network];
    // To fetch data plan and remove the service cost before sending to third party API
    const dataRes = await fetch(process.env.DATA_PLAN);

    const availablePlan = await dataRes.json();
    if (!availablePlan) {
      return NextResponse.json({ success: false, message: "Invalid Data plan" }, { status: 401 })
    }

    const networkPlans = availablePlan?.MOBILE_NETWORK[network]?.[0]?.PRODUCT;
    if (!networkPlans) {
      await session.abortTransaction(); session.endSession();
      return NextResponse.json(
        { success: false, message: "No data plans found for selected network" },
        { status: 400 }
      );
    };

    const validAmount = networkPlans.find((plan) => planId === plan.PRODUCT_ID);
    if (!validAmount) {
      await session.abortTransaction(); session.endSession();
      return NextResponse.json(
        { success: false, message: "Invalid data plan ID" },
        { status: 400 }
      );
    };

    const baseAmount = validAmount?.PRODUCT_ID;
    const generatedRef = crypto.randomUUID();

    // 👉 Call external API
    const res = await fetch(`https://www.nellobytesystems.com/APIDatabundleV1.asp?UserID=${process.env.CLUBKONNECT_USERID}&APIKey=${process.env.CLUBKONNECT_APIKEY}&MobileNetwork=${mappedNetwork}&DataPlan=${baseAmount}&MobileNumber=${number}&RequestID=${generatedRef}`, {
      method: "GET",
    });

    const result = await res.json();

    if (result.status !== "ORDER_RECEIVED") {
      await session.abortTransaction(); session.endSession();
      return NextResponse.json(
        { success: false, message: "API Transaction Failed", details: result },
        { status: 500 }
      );
    };

    // ✅ Update Provider balance
    await ProviderModel.findOneAndUpdate(
      { name: "ClubConnect" },
      {
        lastUser: userId,
        lastAction: "debit",
        note: `Debited for Data`,
        amount: result.walletbalance
      },
      { new: true, upsert: true }
    );

    // ✅ Deduct wallet and log transaction (within session)
    verifyUser.walletBalance -= Number(amount);
    await verifyUser.save({ session });

    const newTransaction = await TransactionModel.create(
      [{
        userId,
        type: "data",
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
      { success: true, message: "Data Purchase Successful", transaction: newTransaction[0] },
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
