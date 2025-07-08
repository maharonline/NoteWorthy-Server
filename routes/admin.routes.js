import express,{Router} from 'express';
import { approveTeacher, registerAdmin } from '../controllers/adminControllers.js';
const router=Router();

router.post("/registerAdmin",registerAdmin)
router.post("/approvedTeacher",approveTeacher)

export default router