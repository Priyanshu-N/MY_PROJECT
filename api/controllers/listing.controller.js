import Listing from "../models/listing.model.js";
import { errorHandler } from '../utills/error.js';
import express from 'express'

// ✅ Already exists
export const createListing = async (req, res, next) => {
  try {
    console.log('Creating listing with:', req.body);
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

// ✅ Add this new function
export const getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    return res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id)

  if(!listing){
    return next(errorHandler(404, 'Listing not found! '))
  }
  if (req.user.id !== listing.userRef.toString()){
    return next(errorHandler(401, 'You can use only your own listing!'))

  }
  try{
    await Listing.findByIdAndDelete(req.params.id)
    res.status(200).json('listing has been deleted')

  }catch(error){
    next(error)

  }
}
