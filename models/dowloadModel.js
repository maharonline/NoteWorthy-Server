import mongoose from "mongoose";

const downloadSchema = new mongoose.Schema({
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Note",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "auth",
    required: true
  },
  downloadedAt: {
    type: Date,
    default: Date.now
  }
},{ timestamps: true });

export const Download = mongoose.model("Download", downloadSchema);
