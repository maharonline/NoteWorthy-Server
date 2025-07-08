import mongoose from "mongoose";
import { Teacher } from "../models/teacherModel.js";
import { Student  } from "../models/auth.js";
import { ResetToken } from "../models/resetToken.js";



export const isResetEmail = async (req, res, next) => {
  try {
    const { token, userId } = req.body;

    let id = userId

    if (!token || !id) { return res.status(400).json({ message: "Invalid Request: Token and ID required" }); }

    if (!mongoose.Types.ObjectId.isValid(id)) { return res.status(400).json({ message: "Invalid User ID" }); }

    let user = await Student.findById(id);
    if (!user) {
      user = await Teacher.findById(id);
    }

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }


    const resetToken = await ResetToken.findOne({ owner: user._id });
    if (!resetToken) {
      return res.status(401).json({ message: "Reset Token Not Found or Expired" });
    }

    const isValid = await resetToken.compareToken(token);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid or Expired Token" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Reset Email Middleware Error:", error);
    res.status(500).json({ message: "Server Error in Reset Middleware", error: true });
  }
};
