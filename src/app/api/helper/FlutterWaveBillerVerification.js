import dotenv from "dotenv";
import { NextResponse } from "next/server";


dotenv.config();

export const verifyCustomer = async (customer) =>{
        try {
        const url = `https://api.flutterwave.com/v3/bill-items/AT099/validate?customer=${customer}`
        const res = await fetch(url, {
            method: "GET",
            headers:{
                accept: "application/json",
                Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
                "Content-Type": "application/json"
            },
        });
        const data = await res.json();
        if(data.status === "success"){
            return data
        };
        return NextResponse.json({success:false, message:"Unable to verify customer"}, {status:500})
    } catch (error) {
        console.log("VerifyingError:", error);
        return NextResponse.json({success:false, message:error}, {status:500})
    }
}