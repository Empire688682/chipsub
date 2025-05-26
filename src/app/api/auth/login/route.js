import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserModel from "@/app/ults/models/UserModel";
import dotenv from "dotenv";
import { NextResponse } from "next/server";
import { connectDb } from "@/app/ults/db/ConnectDb";
dotenv.config();

export async function POST(req) {
    const reqBody = await req.json();
    try {
        await connectDb();
        const {email, password} = reqBody;
        const existUser = await UserModel.findOne({email});
        if(!existUser){
            return NextResponse.json({success:false, message:"User not exist"}, {status:400})
        }

        if(existUser.provider === "google"){
            if(existUser.password === "not set"){
                return NextResponse.json({success:false, message:"User not password not set, continue with google and set up your password"}, {status:400})
            }
        }

        const paswordMatch = await bcrypt.compare(password, existUser.password);
        if(!paswordMatch){
            return NextResponse.json({success:false, message:"Incorrect password"}, {status:400})
        }
        const { password: _, pin: __, ...userData } = existUser.toObject();
        const userId = existUser._id;

        const finalUserData = {...userData, userId}

        const token = jwt.sign({ userId: existUser._id }, process.env.SECRET_KEY, {expiresIn:"1d"});

        const res = NextResponse.json({success:true, message:"User loging", finalUserData}, {status:200});
        res.cookies.set("UserToken", token, 
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production"? true : false,
                maxAge: 24 * 60 * 60,
                sameSite: "lax",
                path: "/"
            }
        )
        return res;
    } catch (error) {
        console.log("Login-error:", error);
        return NextResponse.json({success:false, message:"An error occured"}, {status:500})
    }
}