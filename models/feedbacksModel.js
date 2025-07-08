import mongoose,{Schema} from "mongoose";

const feedbackSchema = new Schema({
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Note",
    required: true,
  },
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Users",
  //   required: true,
  // },

  userId: {
  type: mongoose.Schema.Types.ObjectId,
  required: true,
  refPath: "userModel", // 👈 dynamic based on this field
},
userModel: {
  type: String,
  required: true,
  enum: ["Student", "Teacher", "Admin"], // 👈 must match model names
},


  
  feedback: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true // Adds createdAt and updatedAt
});

export const Feedbacks = mongoose.model("Feedbacks", feedbackSchema);
