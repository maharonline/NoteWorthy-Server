import mongoose, { Schema } from "mongoose";

const teacherSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        userName: { type: String, required: true },
        employeeID: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function (value) {
                    return value.length === 7; // Employee ID لازمی 6 حروف کا ہو
                },
                message: "Employee ID must be exactly 6 characters long"
            }
        },
        department: { type: String, required: true },
        password: { type: String, required: true },
        photoURL: { type: String, default: "" },
        isEmailVerified: { type: Boolean, default: false },
        status: { type: String, enum: ["pending", "Approved", "rejected"], default: "pending" },
        roles: { type: [String], default: ["Teacher"] },
        failedLoginAttempts: { type: Number, default: 0 },
        blockUntil: { type: Date, default: null },
        createdAt: { type: Date, default: Date.now, expires: 15778800 },
        //createdAt: { type: Date, default: Date.now, expires: 300 }, 

    },
    { timestamps: true }
);

export const Teacher = mongoose.model("Teacher", teacherSchema);
