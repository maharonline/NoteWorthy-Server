import express from 'express'
import { createCourse, deleteCourse, getCourse } from '../controllers/courseControllers.js';

const router = express.Router();

router.post("/create", createCourse)
router.get("/get",getCourse)
router.delete("/delete",deleteCourse)

export default router;