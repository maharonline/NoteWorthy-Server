import { Router } from 'express';
import {  createNoteonsubjecttilte, deleteNotes, getNotes, getNotesByUserId, getNotesUploadedByTeacher } from '../controllers/notesControllers.js';
import authenticateUser from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';

const router = Router()



router.post("/create",upload.single("file"),createNoteonsubjecttilte) //iss mai mai ne subjecttitle baja uss basis pr mai ne subject id talash ki phir uss mai notes add kiye
router.get("/get",getNotes)
router.get("/user/:userId", getNotesByUserId);
router.delete("/delete/:id",deleteNotes)
router.get("/getNotesUploadedByTeacher",getNotesUploadedByTeacher)

export default router;