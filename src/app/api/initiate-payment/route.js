import axios from "axios";
import { NextResponse } from "next/server";
import dotenv from "dotenv";
import { connectDb } from "../../ults/db/ConnectDb";
import UserModel from "../../ults/models/UserModel";
import PaymentModel from "../../ults/models/PaymentModel";
import { verifyToken } from "../helper/VerifyToken";
dotenv.config();

export async function POST(req) {
  if (req.method !== "POST") return NextResponse.json({ success: false, message:"Method not allowed"}, { status: 405 });

  const reqBody = await req.json();
  const { amount, customerName, email, method } = reqBody;

  const methodMap = {
    CARD: "CARD",
    ACCOUNT_TRANSFER: "ACCOUNT_TRANSFER",
    USSD: "USSD",
  };
  
  const monnifyMethod = methodMap[method];
  
  if (!monnifyMethod) {
    return NextResponse.json({ success: false, message: "Invalid payment method" }, { status: 400 });
  }

  const basicAuth = Buffer.from(
    `${process.env.MONNIFY_APIKEY}:${process.env.MONNIFY_SECRETKEY}`
  ).toString("base64");

  await connectDb();

  try {
    const userId = await verifyToken(req);
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
        paymentMethods: [monnifyMethod],
      },
      {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response:", response, user);

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
