import express,{Router} from 'express';
import { frontendCOntact } from '../controllers/contactFrontendController.js';

const router=Router();

router.post("/contact",frontendCOntact)


export default router