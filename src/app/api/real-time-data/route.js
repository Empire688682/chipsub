import UserModel from "@/app/ults/models/UserModel";
import TransactionModel from "@/app/ults/models/TransactionModel";
import { connectDb } from "@/app/ults/db/ConnectDb";
import { verifyToken } from "../helper/VerifyToken";
import { NextResponse } from "next/server";

export async function GET(req) {
    await connectDb();
    try {
        const userId = await verifyToken(req);
        if (!userId) {
            return NextResponse.json({ success: false, message: "User not authorized" }, { status: 401 });
        }
        const user = await UserModel.findById({_id:userId});
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }
        const transactions = await TransactionModel.find({ userId });
        const walletBalance = user.walletBalance || 0;
        const commisionBalance = user.commisionBalance || 0;
        return NextResponse.json({ success: true, message: "Transaction history", data:{walletBalance, transactions, commisionBalance} }, { status: 200 });
    } catch (error) {
        console.log("ERROR:", error);
        return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
    }
}