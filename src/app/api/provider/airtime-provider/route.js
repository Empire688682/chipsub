import mongoose from "mongoose";
import TransactionModel from "@/app/ults/models/TransactionModel";
import UserModel from "@/app/ults/models/UserModel";
import dotenv from "dotenv";
import { NextResponse } from "next/server";
import { connectDb } from "@/app/ults/db/ConnectDb";
dotenv.config();

export async function POST(req){
    await connectDb();
    const reqBody = await req.json();
    try {
        const {}
    } catch (error) {
        console.log("Error:", error);
        return NextResponse.json({success:false, message:error.message},{status:500})
    }
}