import express from 'express'
import { getDeletedUsers, restoreDeletedUser } from '../controllers/deletedUserController.js';


const router = express.Router();

router.post("/restoreUser/:id", restoreDeletedUser)
router.get("/getDeletedUser",getDeletedUsers)


export default router;