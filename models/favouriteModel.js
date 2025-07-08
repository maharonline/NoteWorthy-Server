import mongoose from "mongoose";

const favouriteSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
   userId: {
          type: "String",
          
          required: true},
      
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note',
    required: true
  },
  fileUrl: { type: String, required: true }, 

  addedAt: {
    type: Date,
    default: Date.now
  }
});

export const Favourite = mongoose.model('Favourite', favouriteSchema);
