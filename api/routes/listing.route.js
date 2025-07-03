import express from 'express'
import { createListing, getListingById} from '../controllers/listing.controller.js'
import { verifyToken } from '../utills/varifyUser.js'

const router = express.Router()

router.post('/create',verifyToken, createListing)
router.get('/:id', getListingById);

export default router;