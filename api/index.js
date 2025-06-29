import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import userRouter from './routes/user.route.js'; 
import authRouter from './routes/auth.route.js';
import User from './models/user.model.js'; // 👈 Add this to update avatar
import cookieParser from 'cookie-parser'
import listingRouter from './routes/listing.route.js'
import listingUploadRoute from './routes/listingUpload.route.js'


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
mongoose.connect(process.env.MONGO).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err); 
});

const app = express();
app.use(cookieParser())

app.use(cors()); // ✅ Allow frontend requests
app.use(express.json()); // ✅ Parse JSON
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // ✅ Serve image files

// ✅ Multer setup to handle image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ✅ Image upload route
app.post('/api/user/upload-avatar', upload.single('avatar'), async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const avatarPath = `/uploads/${req.file.filename}`;

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
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: error.message || 'Image upload failed',
    });
  }
});

// ✅ Your main routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/listing', listingUploadRoute)

// ✅ Global error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ✅ Start the server
app.listen(3000, () => {
  console.log('🚀 Server is running on port 3000');
});
