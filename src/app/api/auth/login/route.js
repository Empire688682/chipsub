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
        const userExist = await UserModel.findOne({email});
        if(!userExist){
            return NextResponse.json({success:false, message:"User not exist"}, {status:400})
        }
        const paswordMatch = await bcrypt.compare(password, userExist.password);
        if(!paswordMatch){
            return NextResponse.json({success:false, message:"Incorrect password"}, {status:400})
        }
        const { password: _, _id, ...userData } = userExist.toObject();

        const token = jwt.sign({ userId: userExist._id }, process.env.SECRET_KEY, {expiresIn:"1d"});

        const res = NextResponse.json({success:true, message:"User loging", userData}, {status:200});
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