import {Student} from '../models/auth.js';
import {Teacher} from '../models/teacherModel.js';
import {DeletedUser} from '../models/deletedUserModel.js';
import { sendDeletedAccountEmail } from './emailTemplate.js';

export const startDeletionCron = () => {
  setInterval(async () => {
    const now = new Date();

    // ===== Delete expired Students =====
    const expiredStudents = await Student.find({
      isMarkedForDeletion: true,
      deletionTimestamp: { $lte: now },
    });

    for (const user of expiredStudents) {
      await DeletedUser.create({
        userId: user._id,
        roles: user.roles,
        userName: user.userName,
        email: user.email,
        reason: "Auto deleted after 24h",
        RollNo: user.RollNo,
        department: user.department,
        photoURL: user.photoURL,
        Semester: user.Semester,
      });

      await Student.deleteOne({ _id: user._id });

      await sendDeletedAccountEmail(user);
    }

    // ===== Delete expired Teachers =====
    const expiredTeachers = await Teacher.find({
      isMarkedForDeletion: true,
      deletionTimestamp: { $lte: now },
    });

    for (const user of expiredTeachers) {
      await DeletedUser.create({
        userId: user._id,
        roles: user.roles,
        userName: user.userName,
        email: user.email,
        reason: "Auto deleted after 24h",
        department: user.department,
        photoURL: user.photoURL,
        employeeID: user.employeeID,
      });

      await Teacher.deleteOne({ _id: user._id });

      await sendDeletedAccountEmail(user);
    }

    // console.log(`[CRON] Auto-deleted expired users at ${new Date().toISOString()}`);
    
  }, 60 * 1000); // Runs every 1 minute
};
