import { Admin } from "../models/adminModel.js";
import bcrypt from "bcrypt"
import { Teacher } from "../models/teacherModel.js";
import { sendVerificationEmail } from "../utils/emailTemplate.js";
import { generateOtp } from "../utils/mail.js";
import { verifyToken } from "../models/verificationToken.js";


export const registerAdmin = async (req, res) => {
    const { email, password, userName, department } = req.body;

    try {
        const admin = await Admin.findOne({ email })
        if (admin) { return res.status(409).json({ msg: "Already Exist!Please Contact with Department" }) }

        const hashPassword = await bcrypt.hash(password, 10)
        const newAdmin = new Admin({ email, password: hashPassword, userName, department })
        await newAdmin.save()
        res.status(201).json({ msg: "Admin Register Successfully", success: true, })
    } catch (error) {
        res.status(501).json({ msg: "Something Went Wrong", success: false })
        console.error(error)
    }
}

export const approveTeacher = async (req, res) => {
    try {
        const { teacherId, action, } = req.body; // "approve" or "reject"

        const teacher = await Teacher.findById(teacherId);
        if (!teacher) return res.status(404).json({ msg: "Teacher not found" });

        if (action === "approve") {
            teacher.status = "approved";
            await teacher.save();

            // Generate OTP for email verification
            const OTP = generateOtp();
            const verificationToken = new verifyToken({
                ownerModel: "teacher",
                owner: teacher._id,
                token: OTP,
            });

            await verificationToken.save();
            await sendVerificationEmail(teacher, OTP);

            return res.status(200).json({ msg: "Teacher Approved. Email Verification Sent.", success: true });

        } else {
            return res.status(400).json({ msg: "Invalid action", success: false, });
        }



    } catch (error) {
        console.error("Error approving/rejecting teacher:", error);
        res.status(500).json({ msg: "Error processing request", success: false, });
    }
};
