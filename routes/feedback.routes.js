import { Router } from 'express';
import { createFeedBack, deleteFeedback, getAllFeedbacks, getFeedBack, updateFeedback } from '../controllers/feedbackControllers.js';

const router=Router()

router.post("/createfeedback",createFeedBack)
router.get("/get/:userId",getFeedBack)
router.get("/allget",getAllFeedbacks)
router.put("/update/:id",updateFeedback)
router.delete("/delete/:id",deleteFeedback)

export default router