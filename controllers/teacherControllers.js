import { Teacher } from "../models/teacherModel.js";
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import { sendApprovedTeacherEmail, sendRejectedTeacherEmail, sendVerificationEmail, sendVerificationEmailMsg } from "../utils/emailTemplate.js";
import { verifyToken } from "../models/verificationToken.js";
import { generateOtp } from "../utils/mail.js";
const { isValidObjectId } = mongoose;
import { createRandomByte } from "../utils/helper.js";


//Teacher Ki Register Api
export const registerTeacher = async (req, res) => {
    const { email, password, teacherName, department, employeeId,userName } = req.body;

    try {
        
        const teacher = await Teacher.findOne({ $or: [{ email }, { employeeId }] })
        if (teacher) { return res.status(409).json({ msg: "Already Exist!Please Contact with Department" }) }

        const hashPassword = await bcrypt.hash(password, 10)
        const newTeacher = new Teacher({ email, password: hashPassword, teacherName, department, employeeID:employeeId,status:"pending" ,userName})
        // Generate OTP
    const OTP = generateOtp();
    const verificationToken = new verifyToken({
      owner: newTeacher._id,
      token: OTP,
      ownerModel:"teacher"
    });
    await verificationToken.save();
    await newTeacher.save();

    // Send Email msg template that is in utlis
    await sendVerificationEmail(newTeacher,OTP)

    // res.status(201).json({ message: "Registered Successfully. Check Email for OTP", error: false,userId:newuser._id });

    res.cookie("uid", newTeacher._id.toString(), {
    httpOnly: true,
    secure: true, // production mein `true` hona chahiye (https)
    sameSite: "none", // ya "strict" agar same origin hai
    maxAge: 5 * 60 * 1000, // 5 minutes (OTP validity)
  })
  .status(201).json({message: "Registered Successfully. Check Email for OTP",success: true,});
        
    } catch (error) {
        res.status(501).json({ msg: "Something Went Wrong" ,success:false})
        console.error(error)
    }
}


//Tamam Teacher Ko Get Kr ne k liye 
export const getAllTeacher = async (req, res) => {
  try {
    const allTeachers = await Teacher.find();

    return res.status(200).json({
      success: true,
      count: allTeachers.length,
      teacher: allTeachers,
    });

  } catch (error) {
    console.error("Error fetching Teacher:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching Teacher",
    });
  }
};


//teacher ko Approve kr ne k liye admin
export const approvedTeacher = async (req, res) => {
  try {
    const { _id, status} = req.body; // Destructure _id and action from request
    console.log("Teacher ID:",_id);
    console.log("Action:",status);
    

    // Update teacher status
    const updatedTeacher = await Teacher.findByIdAndUpdate(_id, { status:"Approved" }, { new: true });

    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    const action=updatedTeacher.status

    if (action === "Approved") {
      
      await sendApprovedTeacherEmail(updatedTeacher)
  
      return res.status(200).json({ message: "Teacher Approved. Email Verification Sent." });
    }

    res.status(200).json({ message: "Teacher status updated successfully", teacher: updatedTeacher });

  } catch (error) {
    console.error("Error updating teacher status:", error);
    res.status(500).json({ message: "Something went wrong while updating teacher status", error: error.message });
  }
};


export const rejectTeacher = async (req, res) => {
  try {
    const teacher = req.body; 

    await sendRejectedTeacherEmail(teacher)
    
    // Deleting teacher from the Teacher collection
    const rejectedTeacher = await Teacher.findByIdAndDelete(teacher._id);
    
    if (!rejectedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({ message: "Teacher deleted successfully" });

  } catch (error) {
    console.error("Error deleting teacher:", error);
    res.status(500).json({ message: "Something went wrong while deleting the teacher", error: error.message });
  }
};


// After Aprroval From Admin

export const teacherVerifyEmail = async (req, res) => {
  try {
    const { teacherId, otp } = req.body;
    console.log(otp);
    
    if (!isValidObjectId(teacherId)) {
      return res.status(400).json({ message: "Invalid teacher ID" });
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher Not Found" });
    }

    if (teacher.isEmailVerified) {
      return res.status(400).json({ message: "Email Already Verified" });
    }

    const token = await verifyToken.findOne({ owner: teacher._id, ownerModel: "teacher" });
    if (!token) {
      return res.status(404).json({ message: "Token Not Found" });
    }

    // Ensure OTP and token exist before comparing
    if (!otp || !token.token) {
      return res.status(400).json({ message: "Invalid OTP or Token" });
    }

    const isMatch = await token.comparePassword(otp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    teacher.isEmailVerified = true;
    await teacher.save();
    await verifyToken.findByIdAndDelete(token._id);

    // Send Verification Message Back
    await sendVerificationEmailMsg(teacher);

    res.status(200).json({ message: "Email Verified Successfully" });
  } catch (error) {
    console.error("Error in teacherVerifyEmail:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

