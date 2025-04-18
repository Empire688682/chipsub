import mongoose from "mongoose";
import TransactionModel from "@/app/ults/models/TransactionModel";
import UserModel from "@/app/ults/models/UserModel";
import dotenv from "dotenv";
import { NextResponse } from "next/server";
import { connectDb } from "@/app/ults/db/ConnectDb";
import { verifyToken } from "../../helper/VerifyToken";
dotenv.config();

export async function POST(req){
    await connectDb();
    const reqBody = await req.json();
    try {
        const {network, amount, phone, pin} = reqBody;
        if(!network || !amount || !phone || !pin){
            return NextResponse.json({success:false, message:"All field is required"},{status:400})
        };

        const userId = await verifyToken(req);

        const verifyUser = await UserModel.findById({_id:userId});

        if(!verifyUser){
            return NextResponse.json({success:false, message:"User not authenticated"},{status:400})
        };

        if(verifyUser.pin === "1234"){
           return NextResponse.json({success:false, message:"1234 is not allowed"},{status:400})
        }

    } catch (error) {
        console.log("Error:", error);
        return NextResponse.json({success:false, message:error.message},{status:500})
    }
}