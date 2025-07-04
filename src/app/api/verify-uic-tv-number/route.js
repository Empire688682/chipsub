import { NextResponse } from "next/server";
import dotenv from "dotenv";
import { corsHeaders } from "@/app/ults/corsHeaders/corsHeaders";

dotenv.config();

export async function OPTIONS() {
    return new NextResponse(null, {status:200, headers:corsHeaders()});
}

export async function POST(req) {
    const {provider, smartcardNumber} = await req.json();
    const availableTvProviders = {
        "DStv": "01",
        "GOtv": "02",
        "Startimes": "03",
        "Showmax": "04"
      };

    const verifyUrl = `https://www.nellobytesystems.com/APIVerifyCableTVV1.0.asp?UserID=${process.env.CLUBKONNECT_USERID}&APIKey=${process.env.CLUBKONNECT_APIKEY}&cabletv=${availableTvProviders[provider]}&smartcardno=${smartcardNumber}`
    try {
        const res = await fetch(verifyUrl, {method: "POST"});
        const data = await res.json();

        if(data.status !== "00") {
            return NextResponse.json({ success: false, message: "An error occurred" }, { status: 500, headers:corsHeaders() });
        } else {
            return NextResponse.json({ success: true, message: "Decoder number Verified", data:data.customer_name }, { status: 200, headers:corsHeaders() });
        }
    } catch (error) {
        console.log("Verify-Error:", error);
        return NextResponse.json({ success: false, message: "An error occurred" }, { status: 500, headers:corsHeaders() });
    }
}