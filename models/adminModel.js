import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema({
    email: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    photoURL: { type: String, default: "null" },
    password: { type: String, required: true },
    department: { type: String, required: true },
    status: { type: String, default: "active" },
    isEmailVerified: { type: Boolean, default: true },
    roles: { type: [String], default: ["Admin"] },
    failedLoginAttempts: { type: Number, default: 0 },
    blockUntil: { type: Date, default: null },
}, { timestamps: true });

export const Admin = mongoose.model("Admin", adminSchema);
