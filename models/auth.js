import mongoose, { Schema } from "mongoose";



const schema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        RollNo: { type: Number, required: true, },
        Semester: { type: Number, required: true, },
        department: { type: String, required: true },
        password: { type: String, required: true },
        userName: { type: String, default: "" },
        photoURL: { type: String, default: "" },
        isEmailVerified: { type: Boolean, default: false }, // نیا فیلڈ
        verificationToken: { type: String, default: null }, // ویریفکیشن ٹوکن
        status: { type: String, default: "active" },
        roles: { type: [String], default: ["Student"] },
         failedLoginAttempts: { type: Number, default: 0 },
    blockUntil: { type: Date, default: null }
    },
    { timestamps: true }
)

export const Student = mongoose.model("Student", schema)
