import UserModel from "@/app/ults/models/UserModel";
import { connectDb } from "@/app/ults/db/ConnectDb";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const registerUser = async (req) =>{
    const reBody = await req.json();
    try {
        await connectDb();
        const {name, email, password} = reBody;
        
        if(!name || !email || !password){
            return NextResponse.json({success:false, message:"All Filed is require"},{status:400})
        };

        const userExist = await UserModel.findOne({email:email});
        if(userExist){
            return NextResponse.json({success:false, message:"User already exist"},{status:400})
        }
    } catch (error) {
        
    }
}