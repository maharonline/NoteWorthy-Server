import nodemailer from 'nodemailer'
import dotenv from "dotenv";

dotenv.config();

export const generateOtp = () => {
  let otp = ''
  for (let i = 0; i <= 3; i++) {
    const randomNum = Math.round(Math.random() * 9)
    otp = otp + randomNum
  }
  return otp
}

export const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


