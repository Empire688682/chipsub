import axios from "axios";
import { NextResponse } from "next/server";
import dotenv from "dotenv";
import { connectDb } from "../ults/db/ConnectDb";
import UserModel from "../ults/models/UserModel";
import PaymentModel from "../ults/models/PaymentModel";
dotenv.config();

export default async function handler(req) {
  if (req.method !== "POST") return NextResponse.json({ success: false, message:"Method not allowed"}, { status: 405 });

  const reqBody = await req.json();
  const { amount, customerName, email } = reqBody;

  const basicAuth = Buffer.from(
    `${process.env.MONNIFY_APIKEY}:${process.env.MONNIFY_SECRETKEY}`
  ).toString("base64");

  try {
    const response = await axios.post(
      "https://api.monnify.com/api/v1/merchant/transactions/init-transaction",
      {
        amount,
        customerName,
        customerEmail: email,
        paymentReference: `REF-${Date.now()}`,
        paymentDescription: "Payment for Chipsub Service",
        currencyCode: "NGN",
        contractCode: process.env.MONNIFY_CONTRACT_CODE,
        redirectUrl: process.env.REDIRECT_URL,
        paymentMethods: ["CARD", "ACCOUNT_TRANSFER"],
      },
      {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data.responseBody);
  } catch (error) {
    console.error("Monnify Error:", error.response?.data);
    res.status(500).json({ error: "Payment initiation failed" });
  }
}
