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
      to: toEmail,
      subject: "Password Reset Request",
      html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
      <h2>Password Reset</h2>
      <p>We received a request to reset your password. Click the button below to choose a new password:</p>
      <p>
        <a href="${resetingPwdLink}" style="color: white; background-color: #007BFF; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </p>
      <p>If the button above doesn't work, copy and paste the link below into your browser:</p>
      <p style="word-break: break-all;">
        <a href="${resetingPwdLink}">${resetingPwdLink}</a>
      </p>
     <p style="color: red; font-weight: bold;">
       Please note that the link expires in 15 minutes.
     </p>
      <p>If you didn't request this, you can safely ignore this email.</p>
      <p>Thanks,<br/>The Team</p>
    </div>
  `,
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
