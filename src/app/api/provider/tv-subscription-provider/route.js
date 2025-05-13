import crypto from "crypto";
import UserModel from "@/app/ults/models/UserModel";
import { verifyToken } from "../../helper/VerifyToken";
import { NextResponse } from "next/server";
import { connectDb } from "@/app/ults/db/ConnectDb";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import TransactionModel from "@/app/ults/models/TransactionModel";

dotenv.config();

export async function POST(req) {
  await connectDb();
  const body = await req.json();
  const { provider, smartcardNumber, amount, tvPackage, phone, pin } = body;

  const amountToBuy = Number(amount);
  if (isNaN(amountToBuy)) {
    return NextResponse.json({ success: false, message: "Invalid package amount" }, { status: 400 });
  }

  try {
    if (!provider || !smartcardNumber || !amount || !phone || !tvPackage || !pin) {
      return NextResponse.json({ success: false, message: "All fields required" }, { status: 400 });
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

    if (user.walletBalance < amountToBuy) {
      return NextResponse.json({ success: false, message: "Insufficient funds" }, { status: 400 });
    }

    const requestId = crypto.randomUUID();

    const TvUrl = `https://www.nellobytesystems.com/APICableTVV1.asp?UserID=${process.env.CLUBKONNECT_USERID}&APIKey=${process.env.CLUBKONNECT_APIKEY}&CableTV=${provider.toLowerCase()}&Package=${tvPackage}&SmartCardNo=${smartcardNumber}&PhoneNo=${phone}`

    const response = await fetch(TvUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    const result = await response.json();

    console.log("Response:", result);

    if (result?.status === "ORDER_RECEIVED") {
      await UserModel.findByIdAndUpdate(
        userId,
        { walletBalance: user.walletBalance - amountToBuy },
        { new: true }
      );

      await TransactionModel.create({
        userId,
        type: "tv",
        amount: amountToBuy,
        status: "success",
        reference: requestId,
        metadata: {
          network: provider,
          number: smartcardNumber,
        },
      });

      return NextResponse.json({ success: true, message: "Order successful", data: result }, { status: 200 });
    } else {
      await TransactionModel.create({
        userId,
        type: "tv",
        amount: amountToBuy,
        status: "failed",
        reference: requestId,
        metadata: {
          network: provider,
          number: smartcardNumber,
        },
      });

      return NextResponse.json({ success: false, message: "Order failed", data: result }, { status: 400 });
    }

  } catch (error) {
    console.error("Tv-ERROR:", error);
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}
