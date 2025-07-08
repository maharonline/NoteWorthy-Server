import express,{Router} from 'express';
import { approvedTeacher, getAllTeacher, registerTeacher, rejectTeacher, teacherVerifyEmail } from '../controllers/teacherControllers.js';


const router=express.Router()

router.post("/registerTeacher",registerTeacher)
router.post("/verifyEmail",teacherVerifyEmail)
router.get("/getallteachers",getAllTeacher)
router.post("/rejectedTeacher",rejectTeacher)
router.post("/approvedTeacher",approvedTeacher)



export default router