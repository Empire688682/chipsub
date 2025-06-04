import crypto from "crypto";
import UserModel from "@/app/ults/models/UserModel";
import { verifyToken } from "../../helper/VerifyToken";
import { NextResponse } from "next/server";
import { connectDb } from "@/app/ults/db/ConnectDb";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import TransactionModel from "@/app/ults/models/TransactionModel";
import ProviderModel from "@/app/ults/models/ProviderModel";

dotenv.config();

export async function POST(req) {
  await connectDb();
  const body = await req.json();
  const { disco, meterNumber, meterType, amount, phone, pin } = body;

  console.log("Incoming request body:", body);

  try {
    // Validate fields
    if (!disco || !meterNumber || !meterType || !amount || !phone || !pin) {
      console.log("❌ Missing required fields");
      return NextResponse.json({ success: false, message: "All fields required" }, { status: 400 });
    }

    const userId = await verifyToken(req);
    console.log("✅ Verified user ID:", userId);

    const user = await UserModel.findById(userId);
    if (!user) {
      console.log("❌ User not found");
      return NextResponse.json({ success: false, message: "User not authorized" }, { status: 401 });
    }

    const isPinMatch = await bcrypt.compare(pin, user.pin);
    if (!isPinMatch) {
      console.log("❌ Incorrect PIN for user:", user.email);
      return NextResponse.json({ success: false, message: "Pin not correct" }, { status: 401 });
    }

    const saveAmount = Number(amount);
    if (user.walletBalance < saveAmount) {
      console.log("❌ Insufficient balance. Wallet:", user.walletBalance, "Amount:", saveAmount);
      return NextResponse.json({ success: false, message: "Insufficient funds" }, { status: 400 });
    }

    const itemCodes = {
      IKEJA_ELECTRIC: "BIL113",
      EKO_ELECTRIC: "BIL112",
      ABUJA_ELECTRIC: "BIL204",
      ENUGU_ELECTRIC: "BIL115",
      IBADAN_ELECTRIC: "BIL114",
      KADUNA_ELECTRIC: "BIL119",
      KANO_ELECTRIC: "BIL120",
      JOS_ELECTRIC: "BIL133",
      PORTHACOURT_ELECTRIC: "BIL116",
      YOLA_ELECTRIC: "BIL118",
      BENIN_ELECTRIC: "BIL117",
      AEDC: "BIL141",
    };

    const requestId = crypto.randomUUID()
    const item_code = itemCodes[disco];

    console.log("📦 Item Code:", item_code);

    if (!item_code) {
      console.log("❌ Invalid disco or meterType");
      return NextResponse.json({ success: false, message: "Unsupported Disco or meter type" }, { status: 400 });
    }

    // Send payment request to Flutterwave
    console.log("🚀 Sending bill payment request to Flutterwave...");
    const flutterwaveRes = await fetch("https://api.flutterwave.com/v3/bills", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.FLW_SECRET_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        country: "NG",
        customer: meterNumber,
        amount: saveAmount,
        recurrence: "ONCE",
        type: item_code,
        reference: requestId,
        biller_name: phone
      })
    });

    const result = await flutterwaveRes.json();
    console.log("🧾 Flutterwave Response:", result);

    if (result.status !== "success") {
      console.log("❌ Flutterwave transaction failed");
      return NextResponse.json({ success: false, message: "Transaction failed", data: result }, { status: 400 });
    }

    // Log provider update
    console.log("💾 Updating Provider record for Flutterwave...");
    await ProviderModel.findOneAndUpdate(
      { name: "Flutterwave" },
      {
        lastUser: userId,
        lastAction: "debit",
        note: `Electricity payment`,
        amount: saveAmount
      },
      { new: true, upsert: true }
    );

    console.log("💸 Deducting user wallet...");
    await UserModel.findByIdAndUpdate(
      userId,
      { walletBalance: user.walletBalance - saveAmount },
      { new: true }
    );

    console.log("📝 Creating transaction record...");
    await TransactionModel.create({
      userId,
      type: "electricity",
      amount: saveAmount,
      status: "success",
      reference: requestId,
      metadata: {
        disco,
        meterNumber,
        token: result.data?.token || "",
        units: result.data?.unit || "",
      }
    });

    console.log("✅ Transaction complete!");
    return NextResponse.json({ success: true, message: "Payment successful", data: result.data }, { status: 200 });

  } catch (error) {
    console.error("💥 Electricity-FLW-ERROR:", error);
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}
