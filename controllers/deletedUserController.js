import { DeletedUser } from "../models/deletedUserModel.js";
import { Student } from "../models/auth.js";
import { Teacher } from "../models/teacherModel.js";
import { sendRestoredAccountEmail } from "../utils/emailTemplate.js";

export const restoreDeletedUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    
    const deleted = await DeletedUser.findById(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Deleted user not found" });
    }

    const baseData = {
      _id: deleted.userId,
      email: deleted.email,
      userName: deleted.userName,
      roles: deleted.roles,
      isMarkedForDeletion: false,
      deletionTimestamp: null,
      password: "123456789", 
      photoURL:deleted.photoURL
      
    };

    if (deleted.roles.includes("Student")) {
      await Student.create({ ...baseData, RollNo: deleted.RollNo, Semester: deleted.Semester, department: deleted.department,isEmailVerified:true });
    } else if (deleted.roles.includes("Teacher")) {
      await Teacher.create({ ...baseData, department: deleted.department, employeeID: deleted.employeeID,isEmailVerified:true,status:"Approved" });
    }

    await sendRestoredAccountEmail(deleted)

    await DeletedUser.deleteOne({ _id: deleted._id });

    return res.json({ success: true, message: "User restored successfully" });
  } catch (err) {
    console.error("Restore error:", err);
    res.status(500).json({ success: false, message: "Error restoring user" });
  }
};


export const getDeletedUsers = async (req, res) => {
  try {
    const users = await DeletedUser.find().sort({ deletedAt: -1 });
    res.json({ deletedUsers: users });
  } catch (error) {
    console.log("Deleted User Error",error);
    
    res.status(500).json({ message: "Failed to fetch deleted users" });
  }
};