import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { NextResponse } from "next/server";
dotenv.config();

export const sendPasswordResettingEmail = async (toEmail, resetingPwdLink) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        pass: process.env.EMAIL_PASS,
        user: process.env.EMAIL_USER,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      subject: "Password reset",
      to: toEmail,
      html: `<p>Please click the link to reset your password: <a href=${resetingPwdLink}>Password reset</a> </p>`,
    };
    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { success: true, message: "Email sent" },
      { status: 200 },
    );
  } catch (error) {
    console.log("ERROR Sending Msg:", error);
    return NextResponse.json(
      { success: false, message: "Unable to send message" },
      { status: 500 },
    );
  }
};
