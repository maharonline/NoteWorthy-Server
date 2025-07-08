// import mongoose,{Schema} from "mongoose";
// import bcrypt from "bcrypt"


// const verificationToken=new Schema({
//     owner: {
//         type: mongoose.Schema.Types.ObjectId,
//         refPath: "ownerModel", // Dynamic reference
//         required: true
//     },
//     ownerModel: {
//         type: String,
//         enum: ["auth", "teacher"], // Define allowed models
//         required: true
//     },
//     token:{
//         type:String,
//         required:true,
//     },
//     createdAt:{
//         type:Date,
//         expires:3600,
//         default:Date.now

//     }
// })


// //@Jab bhi naya token save hoga ya update hoga, yeh hash ho jaye ga.
// verificationToken.pre("save", async function (next) {
//     if (this.isModified("token")) {
//         this.token = await bcrypt.hash(this.token, 10);
//     }
//     next();
// });

// // Method for comparing hashed tokens
// verificationToken.methods.comparePassword = async function (token) {
//     return await bcrypt.compare(token, this.token);
// };
// export const verifyToken = mongoose.model("VerificationToken", verificationToken)


import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const verificationTokenSchema = new Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "ownerModel",
    required: true,
  },
  ownerModel: {
    type: String,
    enum: ["auth", "teacher"],
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // ✅ expires in 10 minutes
  },
});

// ✅ Hash the token before saving
verificationTokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    this.token = await bcrypt.hash(this.token, 10);
  }
  next();
});

// ✅ Method to compare OTP
verificationTokenSchema.methods.comparePassword = async function (enteredOtp) {
  return await bcrypt.compare(enteredOtp, this.token);
};

export const verifyToken = mongoose.model("VerificationToken", verificationTokenSchema);
