import express from 'express'
import { createSubject, deleteSubject, getSubject } from '../controllers/subjectControllers.js';

const router = express.Router();

router.post("/create", createSubject)

router.get("/get", getSubject)

router.delete("/delete/:id",deleteSubject)
export default router;