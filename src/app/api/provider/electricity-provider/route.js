import crypto from "crypto";
import UserModel from "@/app/ults/models/UserModel";
import { verifyToken } from "../../helper/VerifyToken";
import { NextResponse } from "next/server";
import { connectDb } from "@/app/ults/db/ConnectDb";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

export async function POST(req) {
  await connectDb();
  const body = await req.json();
  const { disco, meterNumber, amount, phone, pin } = body;

  try {
    // Validate request
    if (!disco || !meterNumber || !amount || !phone || !pin) {
      return NextResponse.json({ success: false, message: "All fields required" }, { status: 400 });
    }

    // Disco codes
    const availableDiscos = {
      "EKO_ELECTRIC": "01",
      "IKEJA_ELECTRIC": "02",
      "ABUJA_ELECTRIC": "03",
      "KANO_ELECTRIC": "04",
      "PORTHACOURT_ELECTRIC": "05",
      "JOS_ELECTRIC": "06",
      "IBADAN_ELECTRIC": "07",
      "KADUNA_ELECTRIC": "08",
      "ENUGU_ELECTRIC": "09",
      "BENIN_ELECTRIC": "10",
      "YOLA_ELECTRIC": "11",
      "ABA_ELECTRIC": "12",
    };

    // Auth and funds check
    const userId = verifyToken(req);
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

    // Generate request ID
    const requestId = crypto.randomUUID();

    // Construct URL
    const electricityUrl = `https://www.nellobytesystems.com/APIElectricityV1.asp?UserID=${process.env.CLUBKONNECT_USERID}&APIKey=${process.env.CLUBKONNECT_APIKEY}&ElectricCompany=${availableDiscos[disco]}&MeterType=01&MeterNo=${meterNumber}&Amount=${saveAmount}&PhoneNo=${phone}&RequestID=${requestId}`;

    // Fetch with GET method
    const response = await fetch(electricityUrl, { method: "GET" });
    const result = await response.json();

    console.log("Response:", result);

    if (result?.status === "ORDER_RECEIVED") {
      // Deduct wallet balance
      await UserModel.findByIdAndUpdate(
        userId,
        { walletBalance: user.walletBalance - saveAmount },
        { new: true }
      );

      return NextResponse.json({ success: true, message: "Order successful", data: result }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: "Order failed", data: result }, { status: 400 });
    }

  } catch (error) {
    console.error("Electricity-ERROR:", error);
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}
