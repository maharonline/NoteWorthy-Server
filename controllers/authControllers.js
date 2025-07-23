// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { Student } from "../models/auth.js";
// import { verifyToken } from "../models/verificationToken.js";
// import { Teacher } from "../models/teacherModel.js";
// import { generateOtp } from "../utils/mail.js";
// import { isValidObjectId } from "mongoose";
// import { ResetToken } from "../models/resetToken.js";
// import { createRandomByte } from "../utils/helper.js";
// import { sendForgotPasswordEmail, sendPasswordResetSuccessEmail, sendVerificationEmail, sendVerificationEmailMsg } from "../utils/emailTemplate.js";
// import { Admin } from "../models/adminModel.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.js";


// // Register User
// export const registerUser = async (req, res) => {
//   try {
//     const { userName, email, password, rollno, semester, department } = req.body;

//     if (rollno.toString().length !== 5) {
//       return res.status(400).json({ message: "Roll Number must be exactly 5 digits long" });
//     }

//     const user = await Student.findOne({ $or: [{ email }, { rollno }] });
//     if (user) return res.status(409).json({ message: "Already Registered" });

//     const hashPassword = await bcrypt.hash(password, 10);
//     const newuser = new Student({ userName, email, RollNo: rollno, Semester: semester, password: hashPassword, department });

//     // Generate OTP
//     const OTP = generateOtp();
//     const verificationToken = new verifyToken({
//       owner: newuser._id,
//       token: OTP,
//       ownerModel: "auth"
//     });
//     await verificationToken.save();
//     await newuser.save();

//     // Send Email msg template that is in utlis
//     await sendVerificationEmail(newuser, OTP)

//     // res.status(201).json({ message: "Registered Successfully. Check Email for OTP", error: false,userId:newuser._id });

//     res.cookie("uid", newuser._id.toString(), {
//       httpOnly: true,
//       secure: true, // production mein `true` hona chahiye (https)
//       sameSite: "none", // ya "strict" agar same origin hai
//       maxAge: 5 * 60 * 1000, // 5 minutes (OTP validity)
//     })
//       .status(201).json({ message: "Registered Successfully. Check Email for OTP", success: true, });

//   } catch (error) {
//     res.status(500).json({ message: "Error in Registration", success: false });
//     console.log("Registration Error:", error);
//   }
// };

// // Login User
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     let user =
//       (await Student.findOne({ email })) ||
//       (await Teacher.findOne({ email })) ||
//       (await Admin.findOne({ email }));

//     if (!user) {
//       return res.status(404).json({ message: "User Not Found" });
//     }

//     // ✅ Check if user is currently blocked
//     if (user.blockUntil && user.blockUntil > Date.now()) {
//       const remaining = Math.ceil((user.blockUntil - Date.now()) / 1000);
//       return res.status(403).json({
//         message: `Too many failed attempts. Try again in `,
//       });
//     }

//     const matchPassword = await bcrypt.compare(password, user.password);

//     if (!matchPassword) {
//       // ❌ Wrong password — increase failed attempts
//       user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

//       // 🔐 Block if reached 5 attempts
//       if (user.failedLoginAttempts >= 5) {
//         user.blockUntil = new Date(Date.now() + 1 * 60 * 1000); // 5 minutes
//         await user.save();
//         return res.status(403).json({
//           message: "Account locked for 1 minutes due to repeated login failures.",
//         });
//       }

//       await user.save();
//       return res.status(401).json({ message: "Invalid Email or Password" });
//     }

//     // ✅ Password matched — reset failed attempts
//     user.failedLoginAttempts = 0;
//     user.blockUntil = null;
//     await user.save();

//     // 🧠 Generate token
//     const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

//     const cookieOptions = {
//       httpOnly: true,
//       secure: true, // set true in production (HTTPS)
//       sameSite: "none",
//     };

//     res.cookie("token", token, {
//       ...cookieOptions,
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });

//     if (!user.isEmailVerified) {
//       res.cookie("uid", user._id.toString(), {
//         ...cookieOptions,
//         maxAge: 5 * 60 * 1000, // 5 minutes
//       });
//     }

//     res.status(200).json({
//       message: "Login Successful",
//       error: false,
//       token,
//       isEmailVerified: user.isEmailVerified,
//     });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ message: "Error in Login", error: true });
//   }
// };


// //GET user
// export const getUser = async (req, res) => {
//   try {

//     const _id = req.uid
//     let user = await Student.findOne({ _id });

//     if (!user) {
//       user = await Teacher.findOne({ _id });
//     }

//     if (!user) {
//       user = await Admin.findOne({ _id });
//     }

//     if (!user) {
//       return res.status(404).json({ message: "User Not Found" });
//     }
//     const isEmailVerified = user.isEmailVerified
//     const roles = user.roles
//     res.status(200).json({ user, isEmailVerified, roles })


//   } catch (error) {

//     console.log("User Geting Error", error);

//   }
// }

// // Verify Email

// export const verifyEmail = async (req, res) => {
//   try {
//     const { enteredOtp } = req.body;
//     const userId = req.cookies.uid;

//     if (!userId) return res.status(400).json({ success: false, message: "Missing User ID" });

//     let user = await Student.findById(userId) || await Teacher.findById(userId);
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     if (user.isEmailVerified) {
//       return res.status(400).json({ success: false, message: "Email already verified" });
//     }

//     let token = await verifyToken.findOne({ owner: user._id });
//     if (!token) {
//       return res.status(404).json({ success: false, message: "OTP expired or not found" });
//     }

//     const isMatch = await bcrypt.compare(enteredOtp, token.token);
//     if (!isMatch) {
//       return res.status(400).json({ success: false, message: "Invalid OTP" });
//     }

//     user.isEmailVerified = true;
//     await user.save();
//     await verifyToken.findByIdAndDelete(token._id);
//     await sendVerificationEmailMsg(user);

//     res.clearCookie("uid");
//     return res.status(200).json({ success: true, message: "Email Verified Successfully!" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // RESEND OTP
// export const resendOtp = async (req, res) => {
//   try {
//     const userId = req.cookies.uid;

//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     let user = await Student.findById(userId);
//     if (!user) user = await Teacher.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     if (user.isEmailVerified) {
//       return res.status(400).json({ success: false, message: "Email is already verified" });
//     }

//     // ✅ Delete existing OTP token (if any)
//     await verifyToken.deleteMany({ owner: user._id });

//     // ✅ Generate new OTP
//     const otp = generateOtp();

//     // ✅ Save new hashed OTP
//     const token = new verifyToken({
//       owner: user._id,
//       ownerModel: user.__t === "Teacher" ? "teacher" : "auth",
//       token: otp,
//     });

//     await token.save();

//     // ✅ Send Email
//     await sendVerificationEmail(user, otp)

//     return res.status(200).json({ success: true, message: "New OTP sent successfully." });
//   } catch (error) {
//     console.error("Error in resendOtp:", error);
//     return res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// //==== Forgot Password ====
// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     if (!email) return res.status(400).json({ message: "Please Provide a Valid Email" });

//     let user = await Student.findOne({ email });
//     let ownerModel = null;

//     if (user) {
//       ownerModel = "auth";
//     } else {
//       user = await Teacher.findOne({ email });
//       if (user) ownerModel = "teacher";
//     }

//     if (!user) return res.status(404).json({ message: "User Not Found" });

//     const tokenExists = await ResetToken.findOne({ owner: user._id, ownerModel });
//     if (tokenExists) return res.status(400).json({ message: "Wait 1 hour before requesting another token" });

//     const generateToken = await createRandomByte();
//     const resetToken = new ResetToken({ owner: user._id, token: generateToken, ownerModel });
//     await resetToken.save();

//     //==== Send Forgot Password Email =====
//     await sendForgotPasswordEmail(user, generateToken);

//     res.status(201).json({ message: "Reset Link Sent to Email" });
//   } catch (error) {
//     res.status(500).json({ message: "Error in Forgot Password Request", error: true });
//     console.log("Forgot Password Error:", error);
//   }
// };


// //==== Reset Password =====
// export const resetPassword = async (req, res) => {
//   const { password, userId } = req.body;
//   let id = userId

//   let user = await Student.findById(id);
//   let ownerModel = null;

//   if (user) {
//     ownerModel = "auth";
//   } else {
//     user = await Teacher.findById(id);
//     if (user) ownerModel = "teacher";
//   }

//   if (!user) return res.status(404).json({ message: "User Not Found" });

//   const matchPassword = await bcrypt.compare(password, user.password);
//   if (matchPassword) return res.status(400).json({ message: "New Password Must Be Different and Strong" });

//   if (password.length < 8 || password.length > 20)
//     return res.status(400).json({ message: "Password Must Be 8-20 Characters" });

//   user.password = await bcrypt.hash(password, 10);
//   await user.save();
//   await ResetToken.findOneAndDelete({ owner: user._id, ownerModel });

//   await sendPasswordResetSuccessEmail(user)


//   res.status(200).json({ message: "Password Reset Successful" });
// };

// // ========EditProfile========
// export const editProfile = async (req, res) => {
//   const { _id, userName, Semester, photoURL } = req.body.payload;
//   console.log(req.body.payload);
  

//   try {
//     let updateFields = { userName, Semester,photoURL };

    

//     let user = await Student.findByIdAndUpdate(_id, updateFields, { new: true });

//     if (!user) {
//       user = await Teacher.findByIdAndUpdate(_id, updateFields, { new: true });
//     }
//     if (!user) {
//       user = await Admin.findByIdAndUpdate(_id, updateFields, { new: true });
//     }

//     if (!user) {
//       return res.status(404).json({ message: "User Not Found" });
//     }

//     res.status(201).json({ message: "Profile is Updated", user });
//   } catch (error) {
//     console.error("Error while updating profile:", error);
//     res.status(500).json({ message: "Something Went Wrong While Updating Profile" });
//   }
// };


// export const getallStudent = async (req, res) => {
//   try {
//     const student = await Student.find();

//     return res.status(200).json({
//       success: true,
//       count: student.length,
//       student,
//     });
//   } catch (error) {
//     console.error("Error fetching student:", error.message);

//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong while fetching student",
//     });
//   }
// };

// //==== LOgout Router ====
// export const logoutUser = (req, res) => {
//   res.clearCookie("token", {
//     httpOnly: true,
//     secure: true, 
//     sameSite: "none",
//   });
//   res.json({ message: "Logged out Successfully" });
// }



// // DELETE /api/Student/delete/:id
// export const deleteAccount = async (req, res) => {
//   try {
//     let user = await Student.findByIdAndDelete(req.params.id);

//     if (!user) {
//       user = await Teacher.findByIdAndDelete(req.params.id); // No `let` again
//     }

//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found." });
//     }

//     res.json({ success: true, message: "Account deleted successfully." });

//   } catch (error) {
//     res.status(500).json({ success: false, message: "Something went wrong." });
//   }

// };


// // PUT /api/auth/update-password/:id
// export const updatePassword = async (req, res) => {
//   const { currentPassword, newPassword } = req.body;

//   try {
//     const user =
//       (await Student.findById(req.params.id)) ||
//       (await Teacher.findById(req.params.id));

//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found." });
//     }

//     const isMatch = await bcrypt.compare(currentPassword, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ success: false, message: "Current password is incorrect." });
//     }

//     const hashed = await bcrypt.hash(newPassword, 10);
//     user.password = hashed;
//     await user.save();

//     res.json({ success: true, message: "Password updated successfully." });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error." });
//   }
// };

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Student } from "../models/auth.js";
import { verifyToken } from "../models/verificationToken.js";
import { Teacher } from "../models/teacherModel.js";
import { generateOtp } from "../utils/mail.js";
import { isValidObjectId } from "mongoose";
import { ResetToken } from "../models/resetToken.js";
import { createRandomByte } from "../utils/helper.js";
import { sendForgotPasswordEmail, sendPasswordResetSuccessEmail, sendVerificationEmail, sendVerificationEmailMsg } from "../utils/emailTemplate.js";
import { Admin } from "../models/adminModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { DeletedUser } from "../models/deletedUserModel.js";

//Resolved merge conflicts in authControllers.js and emailTemplate.js

// Register User
export const registerUser = async (req, res) => {
  try {
    const { userName, email, password, rollno, semester, department } = req.body;

    if (rollno.toString().length !== 5) {
      return res.status(400).json({ message: "Roll Number must be exactly 5 digits long" });
    }

    const user = await Student.findOne({ $or: [{ email }, { rollno }] });
    if (user) return res.status(409).json({ message: "Already Registered" });

    const hashPassword = await bcrypt.hash(password, 10);
    const newuser = new Student({ userName, email, RollNo: rollno, Semester: semester, password: hashPassword, department });

    // Generate OTP
    const OTP = generateOtp();
    const verificationToken = new verifyToken({
      owner: newuser._id,
      token: OTP,
      ownerModel: "auth"
    });
    await verificationToken.save();
    await newuser.save();

    // Send Email msg template that is in utlis
    await sendVerificationEmail(newuser, OTP)

    // res.status(201).json({ message: "Registered Successfully. Check Email for OTP", error: false,userId:newuser._id });

    res.cookie("uid", newuser._id.toString(), {
      httpOnly: true,
      secure: true, // production mein `true` hona chahiye (https)
      sameSite: "none", // ya "strict" agar same origin hai
      maxAge: 5 * 60 * 1000, // 5 minutes (OTP validity)
    })
      .status(201).json({ message: "Registered Successfully. Check Email for OTP", success: true, });

  } catch (error) {
    res.status(500).json({ message: "Error in Registration", success: false });
    console.log("Registration Error:", error);
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user =
      (await Student.findOne({ email })) ||
      (await Teacher.findOne({ email })) ||
      (await Admin.findOne({ email }));

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    // ✅ Cancel deletion if within grace period
    if (user.isMarkedForDeletion && user.deletionTimestamp > new Date()) {
      user.isMarkedForDeletion = false;
      user.deletionTimestamp = null;
      await user.save(); // 🔄 Save cancellation
    }

    // ❌ Blocked user check
    if (user.blockUntil && user.blockUntil > Date.now()) {
      const remaining = Math.ceil((user.blockUntil - Date.now()) / 1000);
      return res.status(403).json({
        message: `Too many failed attempts. Try again in ${remaining} seconds.`,
      });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      if (user.failedLoginAttempts >= 5) {
        user.blockUntil = new Date(Date.now() + 1 * 60 * 1000); // 1 minute block
        await user.save();
        return res.status(403).json({
          message: "Account locked for 1 minute due to repeated login failures.",
        });
      }

      await user.save();
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    // ✅ Successful login
    user.failedLoginAttempts = 0;
    user.blockUntil = null;
    await user.save();

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

    const cookieOptions = {
      httpOnly: true,
      secure: true, 
      sameSite: "none",
    };

    res.cookie("token", token, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    if (!user.isEmailVerified) {
      res.cookie("uid", user._id.toString(), {
        ...cookieOptions,
        maxAge: 5 * 60 * 1000,
      });
    }

    res.status(200).json({
      message: "Login Successful",
      error: false,
      token,
      isEmailVerified: user.isEmailVerified,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Error in Login", error: true });
  }
};

// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     let user =
//       (await Student.findOne({ email })) ||
//       (await Teacher.findOne({ email })) ||
//       (await Admin.findOne({ email }));

//     if (!user) {
//       return res.status(404).json({ message: "User Not Found" });
//     }

//     // ✅ Check if user is currently blocked
//     if (user.blockUntil && user.blockUntil > Date.now()) {
//       const remaining = Math.ceil((user.blockUntil - Date.now()) / 1000);
//       return res.status(403).json({
//         message: `Too many failed attempts. Try again in `,
//       });
//     }

//     const matchPassword = await bcrypt.compare(password, user.password);

//     if (!matchPassword) {
//       // ❌ Wrong password — increase failed attempts
//       user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

//       // 🔐 Block if reached 5 attempts
//       if (user.failedLoginAttempts >= 5) {
//         user.blockUntil = new Date(Date.now() + 1 * 60 * 1000); // 5 minutes
//         await user.save();
//         return res.status(403).json({
//           message: "Account locked for 1 minutes due to repeated login failures.",
//         });
//       }

//       await user.save();
//       return res.status(401).json({ message: "Invalid Email or Password" });
//     }

//     // ✅ Password matched — reset failed attempts
//     user.failedLoginAttempts = 0;
//     user.blockUntil = null;
//     await user.save();

//     // 🧠 Generate token
//     const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

//     const cookieOptions = {
//       httpOnly: true,
//       secure: false, // set true in production (HTTPS)
//       sameSite: "lax",
//     };

//     res.cookie("token", token, {
//       ...cookieOptions,
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });

//     if (!user.isEmailVerified) {
//       res.cookie("uid", user._id.toString(), {
//         ...cookieOptions,
//         maxAge: 5 * 60 * 1000, // 5 minutes
//       });
//     }

//     res.status(200).json({
//       message: "Login Successful",
//       error: false,
//       token,
//       isEmailVerified: user.isEmailVerified,
//     });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ message: "Error in Login", error: true });
//   }
// };


//GET user
export const getUser = async (req, res) => {
  try {

    const _id = req.uid
    let user = await Student.findOne({ _id });

    if (!user) {
      user = await Teacher.findOne({ _id });
    }

    if (!user) {
      user = await Admin.findOne({ _id });
    }

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const isEmailVerified = user.isEmailVerified
    const roles = user.roles
    res.status(200).json({ user, isEmailVerified, roles })


  } catch (error) {

    console.log("User Geting Error", error);

  }
}

// Verify Email

export const verifyEmail = async (req, res) => {
  try {
    const { enteredOtp } = req.body;
    const userId = req.cookies.uid;

    if (!userId) return res.status(400).json({ success: false, message: "Missing User ID" });

    let user = await Student.findById(userId) || await Teacher.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: "Email already verified" });
    }

    let token = await verifyToken.findOne({ owner: user._id });
    if (!token) {
      return res.status(404).json({ success: false, message: "OTP expired or not found" });
    }

    const isMatch = await bcrypt.compare(enteredOtp, token.token);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    user.isEmailVerified = true;
    await user.save();
    await verifyToken.findByIdAndDelete(token._id);
    await sendVerificationEmailMsg(user);

    res.clearCookie("uid");
    return res.status(200).json({ success: true, message: "Email Verified Successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// RESEND OTP
export const resendOtp = async (req, res) => {
  try {
    const userId = req.cookies.uid;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    let user = await Student.findById(userId);
    if (!user) user = await Teacher.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: "Email is already verified" });
    }

    // ✅ Delete existing OTP token (if any)
    await verifyToken.deleteMany({ owner: user._id });

    // ✅ Generate new OTP
    const otp = generateOtp();

    // ✅ Save new hashed OTP
    const token = new verifyToken({
      owner: user._id,
      ownerModel: user.__t === "Teacher" ? "teacher" : "auth",
      token: otp,
    });

    await token.save();

    // ✅ Send Email
    await sendVerificationEmail(user, otp)

    return res.status(200).json({ success: true, message: "New OTP sent successfully." });
  } catch (error) {
    console.error("Error in resendOtp:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

//==== Forgot Password ====
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Please Provide a Valid Email" });

    let user = await Student.findOne({ email });
    let ownerModel = null;

    if (user) {
      ownerModel = "auth";
    } else {
      user = await Teacher.findOne({ email });
      if (user) ownerModel = "teacher";
    }

    if (!user) return res.status(404).json({ message: "User Not Found" });

    const tokenExists = await ResetToken.findOne({ owner: user._id, ownerModel });
    if (tokenExists) return res.status(400).json({ message: "Wait 1 hour before requesting another token" });

    const generateToken = await createRandomByte();
    const resetToken = new ResetToken({ owner: user._id, token: generateToken, ownerModel });
    await resetToken.save();

    //==== Send Forgot Password Email =====
    await sendForgotPasswordEmail(user, generateToken);

    res.status(201).json({ message: "Reset Link Sent to Email" });
  } catch (error) {
    res.status(500).json({ message: "Error in Forgot Password Request", error: true });
    console.log("Forgot Password Error:", error);
  }
};


//==== Reset Password =====
export const resetPassword = async (req, res) => {
  const { password, userId } = req.body;
  let id = userId

  let user = await Student.findById(id);
  let ownerModel = null;

  if (user) {
    ownerModel = "auth";
  } else {
    user = await Teacher.findById(id);
    if (user) ownerModel = "teacher";
  }

  if (!user) return res.status(404).json({ message: "User Not Found" });

  const matchPassword = await bcrypt.compare(password, user.password);
  if (matchPassword) return res.status(400).json({ message: "New Password Must Be Different and Strong" });

  if (password.length < 8 || password.length > 20)
    return res.status(400).json({ message: "Password Must Be 8-20 Characters" });

  user.password = await bcrypt.hash(password, 10);
  await user.save();
  await ResetToken.findOneAndDelete({ owner: user._id, ownerModel });

  await sendPasswordResetSuccessEmail(user)


  res.status(200).json({ message: "Password Reset Successful" });
};

// ========EditProfile========
export const editProfile = async (req, res) => {
  const { _id, userName, Semester, photoURL } = req.body.payload;
  console.log(req.body.payload);
  

  try {
    let updateFields = { userName, Semester,photoURL };

    

    let user = await Student.findByIdAndUpdate(_id, updateFields, { new: true });

    if (!user) {
      user = await Teacher.findByIdAndUpdate(_id, updateFields, { new: true });
    }
    if (!user) {
      user = await Admin.findByIdAndUpdate(_id, updateFields, { new: true });
    }

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    res.status(201).json({ message: "Profile is Updated", user });
  } catch (error) {
    console.error("Error while updating profile:", error);
    res.status(500).json({ message: "Something Went Wrong While Updating Profile" });
  }
};


export const getallStudent = async (req, res) => {
  try {
    const student = await Student.find();

    return res.status(200).json({
      success: true,
      count: student.length,
      student,
    });
  } catch (error) {
    console.error("Error fetching student:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching student",
    });
  }
};

//==== LOgout Router ====
export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true, 
    sameSite: "none",
  });
  res.json({ message: "Logged out Successfully" });
}



// DELETE /api/Student/delete/:id
export const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;

    let user = await Student.findById(id);
    if (user) {
      user.isMarkedForDeletion = true;
      // user.deletionTimestamp = new Date(Date.now() + 24 * 60 * 60 * 1000); 
       user.deletionTimestamp = new Date(Date.now() + 10 * 1000);
      await user.save();

      return res.json({
        success: true,
        message: "Account will be permanently deleted in 24 hours. Login before that to cancel deletion.",
      });
    }

    user = await Teacher.findById(id);
    if (user) {
      user.isMarkedForDeletion = true;
      // user.deletionTimestamp = new Date(Date.now() + 24 * 60 * 60 * 1000); 
      user.deletionTimestamp = new Date(Date.now() + 10 * 1000);

      await user.save();

      return res.json({
        success: true,
        message: "Account will be permanently deleted in 24 hours. Login before that to cancel deletion.",
      });
    }

    return res.status(404).json({ success: false, message: "User not found." });
  } catch (error) {
    console.error("Error in deleteAccount:", error);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// PUT /api/auth/update-password/:id
export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user =
      (await Student.findById(req.params.id)) ||
      (await Teacher.findById(req.params.id));

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Current password is incorrect." });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ success: true, message: "Password updated successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};
