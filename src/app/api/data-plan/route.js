import { corsHeaders } from "@/app/ults/corsHeaders/corsHeaders";
import dotenv from "dotenv";
import { NextResponse } from "next/server";
dotenv.config();

export async function OPTIONS() {
    return new NextResponse(null, {status:200, headers:corsHeaders})
}

export async function GET() {
    try {
        const res = await fetch(process.env.DATA_PLAN);
        const data = await res.json();
        return NextResponse.json({ success: true, message: "Data plan", data }, { status: 200, headers:corsHeaders });
    } catch (error) {
        console.log("ERROR:", error);
        return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500, headers:corsHeaders });
    }
}