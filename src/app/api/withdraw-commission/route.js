import { connectDb } from "@/app/ults/db/ConnectDb";
import UserModel from "@/app/ults/models/UserModel";
import { NextResponse } from "next/server";


export async function POST(req) {
    const reqBody = await req.json();
    const { userId } = reqBody;
    if (!userId) {
        return NextResponse.json({ success: false, message: "No Id provided" }, { status: 401 })
    }
    await connectDb();
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 401 })
        };
        if (user.commisionBalance <= 99) {
            return NextResponse.json({ success: false, message: "Blance most be above ₦99" }, { status: 401 })
        }
        await UserModel.findByIdAndUpdate(userId, {
            $inc: { walletBalance: user.commisionBalance },
            $set: { commisionBalance: 0 }
        });

        return NextResponse.json({ success: true, message: "Withdraw successful" }, { status: 200 });
    } catch (error) {
        console.log("CommisionError:", error);
        return NextResponse.json({ success: false, message: "An error occured" }, { status: 500 })
    }
}