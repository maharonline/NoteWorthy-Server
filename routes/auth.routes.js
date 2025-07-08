import express, { Router } from "express";
import { deleteAccount, editProfile, forgotPassword, getallStudent, getUser, loginUser, logoutUser, registerUser, resendOtp, resetPassword, updatePassword, verifyEmail } from "../controllers/authControllers.js";
import authenticateUser from "../middleware/auth.middleware.js";
import { isResetEmail } from "../middleware/user.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();


router.post("/register", registerUser)

router.post("/login", loginUser)

router.get("/user", authenticateUser,getUser )

router.get("/getallStudent",getallStudent)

router.post("/verifyemail", verifyEmail)

router.post("/resendotp", resendOtp)

router.post("/forgotPassword", forgotPassword)

router.post("/resetpassword",isResetEmail, resetPassword)

router.post("/editprofile",editProfile)

router.post("/logout",logoutUser)

router.delete('/delete/:id',deleteAccount)

router.put("/updatePassword/:id",updatePassword)

export default router
