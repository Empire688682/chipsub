import axios from 'axios';
import dotenv from 'dotenv';
import { NextResponse } from 'next/server';
import { connectDb } from '../../ults/db/ConnectDb';
import PaymentModel from '../../ults/models/PaymentModel';
import UserModel from '../../ults/models/UserModel';

dotenv.config();

export async function POST(req) {
  const { transaction_id } = await req.json();

  if (!transaction_id) {
    return NextResponse.json({ success: false, message: 'No transaction ID provided' }, { status: 400 });
  }

  try {
    await connectDb();

    const verifyUrl = `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`;
    const response = await axios.get(verifyUrl, {
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
      },
    });

    const { status, amount, currency, customer, tx_ref } = response.data.data;

    if (status === 'successful') {
      // 1. Update payment record
      const payment = await PaymentModel.findOneAndUpdate(
        { reference: tx_ref },
        { status: 'successful' },
        { new: true }
      );

      if (payment) {
        await UserModel.findByIdAndUpdate(userId, { $inc: { walletBalance: amount } });

        return NextResponse.json({ success: true, message: 'Payment verified and wallet updated' }, { status: 200 });
      } else {
        return NextResponse.json({ success: false, message: 'Payment not found in DB' }, { status: 404 });
      }
    } else {
      return NextResponse.json({ success: false, message: 'Transaction not successful' }, { status: 400 });
    }
  } catch (err) {
    console.error(err.response?.data || err.message);
    return NextResponse.json({ success: false, message: 'Verification failed' }, { status: 500 });
  }
}
