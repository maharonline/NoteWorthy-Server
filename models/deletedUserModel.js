import mongoose from "mongoose";

const deletedUserSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  email: { type: String, required: true },
  RollNo: { type: Number, },
  Semester: { type: Number, },
  department: { type: String,  },
  userName: { type: String },
  roles: { type: [String], default: [] },
  deletedAt: { type: Date, default: Date.now },
  reason: { type: String, default: "Not specified" },
  photoURL: { type: String, default: "" },
  employeeID:{type:String},
  source: { type: String, enum: ["user", "cron"], default: "user" }
});

export const DeletedUser = mongoose.model("DeletedUser", deletedUserSchema);
