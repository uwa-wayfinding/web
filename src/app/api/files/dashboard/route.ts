import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getUser } from "@/lib/auth-server";
import { isNullish } from "remeda";
import { db } from '@/lib/db';
// this page sends email to the UWAWayfinder admin
export async function POST(req: NextRequest) {
  try {

    
    const user = await getUser();
    if (isNullish(user)) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

    
    // email content
    const { to, subject, text } = await req.json();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'UWA Wayfiner, Thank you for your participation',
      html: text,
    };
    console.log('Sending email with options:', mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
  }
}