import axios from "axios";
import { NextResponse } from "next/server";
import dotenv from "dotenv";
import { connectDb } from "../../ults/db/ConnectDb";
import UserModel from "../../ults/models/UserModel";
import PaymentModel from "../../ults/models/PaymentModel";
import { verifyToken } from "../helper/VerifyToken";
dotenv.config();

export async function POST(req) {
  const reqBody = await req.json();
  const { amount, email, name } = reqBody;

  try {
    await connectDb();

    if (!amount || !email || !name) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    const userId = await verifyToken(req);
    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 401 });
    }

    const response = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      {
        tx_ref: `TX-${Date.now()}`,
        amount,
        currency: "NGN",
        redirect_url: "http://localhost:3000/payment-success",
        customer: {
          email,
          name,
        },
        customizations: {
          title: "Chipsub",
          description: "Wallet Funding",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      const paymentData = response.data.data;

      await PaymentModel.create({
        userId,
        amount,
        currency: "NGN",
        reference: paymentData.tx_ref,
        status: "pending", // mark pending until verified
        paymentLink: paymentData.link,
      });

      return NextResponse.json({ success: true, message: "Payment initiated", data: paymentData }, { status: 200 });
    }

    return NextResponse.json({ success: false, message: "Payment creation failed" }, { status: 500 });
  } catch (err) {
    console.error(err.response?.data || err.message);
    return NextResponse.json({ success: false, message: "Payment initiation failed" }, { status: 500 });
  }
}
