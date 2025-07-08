import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true,unique:true },
    notes:[{type:mongoose.Schema.Types.ObjectId,ref:"Note",unique:true}]
  },
  { timestamps: true }
);

export const Subject = mongoose.model("Subject", subjectSchema);
