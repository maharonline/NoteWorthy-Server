import express,{Router} from 'express';
import { dowloadDetail, getDownloadSummary, recentDownloadSubject } from '../controllers/dowloadController.js';
const router=Router();

router.post('/downloadDetail',dowloadDetail)

router.get("/summary",getDownloadSummary)

router.get("/recentDownload",recentDownloadSubject)

export default router