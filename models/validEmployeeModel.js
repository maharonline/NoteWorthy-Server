import mongoose, { Schema } from "mongoose";

const validEmployeeSchema = new Schema({
  employeeID: { type: String, required: true, unique: true },
  name: { type: String, required: true }, // Optional: Store employee names
  department: { type: String },
});

export const ValidEmployees = mongoose.model("validEmployees", validEmployeeSchema);
