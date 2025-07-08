import express from 'express'
import { createSemester, getSemester } from '../controllers/semesterControllers.js';

const router = express.Router();


router.post("/create",createSemester)
router.get("/get",getSemester)

export default router;