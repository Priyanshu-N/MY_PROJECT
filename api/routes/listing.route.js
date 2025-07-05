import express from 'express'
import { createListing, getListingById, deleteListing} from '../controllers/listing.controller.js'
import { verifyToken } from '../utills/varifyUser.js'

const router = express.Router()

router.post('/create',verifyToken, createListing)
router.get('/:id', getListingById);
router.delete('/delete/:id', verifyToken, deleteListing)

export default router;