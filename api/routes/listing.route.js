import express from 'express'
import { createListing, getListing, deleteListing, updateListing, getListingById, getListings } from '../controllers/listing.controller.js'
import { verifyToken } from '../utills/varifyUser.js'

const router = express.Router()

router.post('/create',verifyToken, createListing)
router.get('/get/:id', getListing)
router.get('/get', getListings)
router.get('/:id', getListingById);
router.delete('/delete/:id', verifyToken, deleteListing)
router.post('/update/:id', verifyToken, updateListing)



export default router;