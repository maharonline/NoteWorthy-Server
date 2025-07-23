import mongoose from "mongoose";


const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, enum: ["Lecture Notes", "MCQs", "Past Papers"], required: true },
    fileUrl: { type: String, required: true }, 
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId}]
  },
  { timestamps: true }
);

export const Note = mongoose.model("Note", noteSchema);



