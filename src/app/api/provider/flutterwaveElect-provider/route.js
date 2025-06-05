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
    if (!disco || !meterNumber || !meterType || !amount || !phone || !pin) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    const userId = await verifyToken(req);
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not authorized" }, { status: 401 });
    }

    const isPinMatch = await bcrypt.compare(pin, user.pin);
    if (!isPinMatch) {
      return NextResponse.json({ success: false, message: "Pin not correct" }, { status: 401 });
    }

    const saveAmount = Number(amount);
    if (user.walletBalance < saveAmount) {
      return NextResponse.json({ success: false, message: "Insufficient funds" }, { status: 400 });
    }

    // Correct mapping using item_code (not biller_code)
    const itemCodes = {
  ABUJA_ELECTRIC: {
    Prepaid: "UB584",
    Postpaid: "UB585"
  },
  IKEJA_ELECTRIC: {
    Prepaid: "UB586",
    Postpaid: "UB587"
  },
  EKO_ELECTRIC: {
    Prepaid: "UB588",
    Postpaid: "UB589"
  },
  ENUGU_ELECTRIC: {
    Prepaid: "UB590",
    Postpaid: "UB591"
  },
  IBADAN_ELECTRIC: {
    Prepaid: "UB592",
    Postpaid: "UB593"
  },
  KADUNA_ELECTRIC: {
    Prepaid: "UB594",
    Postpaid: "UB595"
  },
  KANO_ELECTRIC: {
    Prepaid: "UB596",
    Postpaid: "UB597"
  },
  JOS_ELECTRIC: {
    Prepaid: "UB598",
    Postpaid: "UB599"
  },
  PORTHACOURT_ELECTRIC: {
    Prepaid: "UB600",
    Postpaid: "UB601"
  },
  YOLA_ELECTRIC: {
    Prepaid: "UB602",
    Postpaid: "UB603"
  },
  BENIN_ELECTRIC: {
    Prepaid: "UB604",
    Postpaid: "UB605"
  },
  AEDC: {
    Prepaid: "UB606",
    Postpaid: "UB607"
  }
};


    const itemCode = itemCodes?.[disco]?.[meterType];

    if (!itemCode) {
      return NextResponse.json({ success: false, message: "Unsupported disco or meter type" }, { status: 400 });
    }

    const requestId = crypto.randomUUID();

    const flutterwaveRes = await fetch("https://api.flutterwave.com/v3/bills", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        country: "NG",
        customer: meterNumber,
        amount: saveAmount,
        recurrence: "ONCE",
        type: itemCode,
        reference: requestId,
        biller_name: phone // optional — used as reference name
      })
    });

    const result = await flutterwaveRes.json();
    console.log("🧾 Flutterwave Response:", result);

    if (result.status !== "success") {
      return NextResponse.json({ success: false, message: "Transaction failed", data: result }, { status: 400 });
    }

    await ProviderModel.findOneAndUpdate(
      { name: "Flutterwave" },
      {
        lastUser: userId,
        lastAction: "debit",
        note: "Electricity payment",
        amount: saveAmount
      },
      { new: true, upsert: true }
    );

    await UserModel.findByIdAndUpdate(
      userId,
      { walletBalance: user.walletBalance - saveAmount },
      { new: true }
    );

    await TransactionModel.create({
      userId,
      type: "electricity",
      amount: saveAmount,
      status: "success",
      reference: requestId,
      metadata: {
        disco,
        meterType,
        meterNumber,
        token: result.data?.token || "",
        units: result.data?.unit || ""
      }
    });

    return NextResponse.json({ success: true, message: "Payment successful", data: result.data }, { status: 200 });

  } catch (error) {
    console.error("💥 Electricity-FLW-ERROR:", error);
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}
