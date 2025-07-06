import express from 'express'
import { createListing, getListing, deleteListing, updateListing, getListingById } from '../controllers/listing.controller.js'
import { verifyToken } from '../utills/varifyUser.js'

const router = express.Router()

router.post('/create',verifyToken, createListing)
router.get('/:id', getListingById);
router.delete('/delete/:id', verifyToken, deleteListing)
router.post('/update/:id', verifyToken, updateListing)
router.get('/get/:id', getListing)

export default router;