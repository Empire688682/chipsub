import dotenv from "dotenv";
import { NextResponse } from "next/server";
dotenv.config();

const dataPlanUrl = "https://www.nellobytesystems.com/APIDatabundlePlansV2.asp?UserID=";

export async function GET(req) {
    try {
        const res = await fetch(dataPlanUrl + process.env.CLUBKONNECT_USERID);
        const data = await res.json();
        return NextResponse.json({ success: true, message: "Data plan", data }, { status: 200 });
    } catch (error) {
        console.log("ERROR:", error);
        return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
    }
}