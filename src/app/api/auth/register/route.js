import UserModel from "@/app/ults/models/UserModel";
import { connectDb } from "@/app/ults/db/ConnectDb";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
dotenv.config();

const registerUser = async (req) =>{
    const reBody = await req.json();
    try {
        await connectDb();
        const {name, email, phone, password} = reBody;
        
        if(!name || !email || !password || !phone){
            return NextResponse.json({success:false, message:"All Fields are require"},{status:400})
        };

        if(!validator.isEmail(email)){
            return NextResponse.json({success:false, message:"Invalid Email"}, {status:400})
        }

        const userExist = await UserModel.findOne({email});
        if(userExist){
            return NextResponse.json({success:false, message:"User already exist"},{status:400})
        }

        if(password.length < 8){
            return NextResponse.json({success:false, message:"Password too sort"},{status:400})
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const defaultPin = "1234"

        const newUser = await UserModel.create({
            name,
            email,
            phone,
            password: hashedPassword,
            pin: defaultPin,
            transactionIds: [],
          });

        await newUser.save();

        const { password: _, _id, ...userData } = newUser.toObject();

        const userId = newUser._id;

        const token = jwt.sign({userId}, process.env.SECRET_KEY, {expiresIn:"1d"});

        const res = NextResponse.json({success:true, message:"User aded", userData}, {status:200});

        res.cookies.set("UserToken", token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            maxAge: 60 * 60 * 24,
            sameSite: "lax",
            path:"/"
        });

        return res

    } catch (error) {
        console.log("Error:" ,error);
        return NextResponse.json({success:false, message:"Something went wrong"},{status:500})
    }
}

export async function POST(req) {
    return registerUser(req);
};