import express from 'express';
import { signin, signup, google, signOut } from '../controllers/auth.controller.js';


const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google); // Assuming Google sign-in uses the same endpoint
router.get('/signout', signOut)

export default router;