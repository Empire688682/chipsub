import { connectDb } from "@/app/ults/db/ConnectDb";
import UserModel from "@/app/ults/models/UserModel";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { verifyToken } from "../../helper/VerifyToken";

export async function POST(req){
    const { pin } = await req.json();
    await connectDb();

    try {
        const userId = await verifyToken(req);

        if (!userId) {
            return NextResponse.json({ success: false, message: "User not authorized" }, { status: 401 });
        }

        const hashedPin = await bcrypt.hash(pin, 10);

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { pin: hashedPin },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "PIN set successfully" }, { status: 200 });

    } catch (error) {
        console.error("Set PIN Error:", error);
        return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
    }
}
