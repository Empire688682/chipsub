import axios from "axios";
import { NextResponse } from "next/server";
import dotenv from "dotenv";
import { connectDb } from "../ults/db/ConnectDb";
import UserModel from "../ults/models/UserModel";
import PaymentModel from "../ults/models/PaymentModel";
import { verifyToken } from "./helper/VerifyToken";
dotenv.config();

export default async function handler(req) {
  if (req.method !== "POST") return NextResponse.json({ success: false, message:"Method not allowed"}, { status: 405 });

  const reqBody = await req.json();
  const { amount, customerName, email } = reqBody;

  const basicAuth = Buffer.from(
    `${process.env.MONNIFY_APIKEY}:${process.env.MONNIFY_SECRETKEY}`
  ).toString("base64");

  try {
    const userId = await verifyToken();
    const user = await UserModel.findById({_id:userId});

    if(!user){
        return NextResponse.json({success:false, message:"User not allowed"}, {status:400})
    }

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

    await connectDb();
    if (response.status === 200) {
      const { data } = response;
      const payment = new PaymentModel({ ...data, userId: reqBody.userId });
      await payment.save();
      return NextResponse.json({ success: true, message: "Payment initiated", data }, { status: 200 });
    }
  } catch (error) {
    console.error("Monnify Error:", error.response?.data);
    return NextResponse.json({ success: false, message: "Payment initiation failed"}, { status: 500 });
  }
}
