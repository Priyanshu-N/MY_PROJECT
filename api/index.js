import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import fs from 'fs';

// Routes
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import listingUploadRoute from './routes/listingUpload.route.js';
import User from './models/user.model.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Create folders if they don't exist
const avatarDir = path.join(__dirname, 'uploads/avatars');
const listingDir = path.join(__dirname, 'uploads/listings');
if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir, { recursive: true });
if (!fs.existsSync(listingDir)) fs.mkdirSync(listingDir, { recursive: true });

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err); 
});

const app = express();

// ✅ Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// ✅ Serve static image files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Multer config for avatars
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const avatarUpload = multer({ storage: avatarStorage });

// ✅ Avatar upload endpoint
app.post('/api/user/upload-avatar', avatarUpload.single('avatar'), async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarPath },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error('❌ Avatar Upload Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Avatar upload failed',
    });
  }
});

// ✅ Main API Routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/listing-upload', listingUploadRoute);

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ✅ Start Server
app.listen(3000, () => {
  console.log('🚀 Server is running on http://localhost:3000');
});
