import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, email, name } = body;

    // Check if any required parameters are missing
    if (!amount || !email || !name) {
      console.error("Required parameters missing:", { amount, email, name });
      return NextResponse.json(
        { success: false, message: "One or more required parameters missing" },
        { status: 400 }
      );
    }

    const response = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      {
        tx_ref: `tx-${Date.now()}`,
        amount,
        currency: "NGN",
        redirect_url: process.env.REDIRECT_URL,
        payment_options: "card,banktransfer,ussd",
        customer: {
          email,
          name,
        },
        customizations: {
          title: "ChipSub Wallet Top-Up",
          logo: "https://chipsub.vercel.app/favicon.ico",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    console.error("Flutterwave error:", error.message || error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
