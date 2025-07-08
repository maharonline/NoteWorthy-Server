import express, { Router } from 'express'
import authenticateUser from '../middleware/auth.middleware.js'
import { addFavourite, deleteFavourite, getFavourite } from '../controllers/favouriteController.js'

const router=Router()

router.post("/add",addFavourite)

router.get('/:userId',getFavourite)

router.delete('/delete/:id',deleteFavourite)
export default router;