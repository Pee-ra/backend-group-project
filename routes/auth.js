import express from 'express';
import {
  register,
  login,
  adminLogin,
  logout,
  getMe,
  updatePassword,
  checkAuth
} from '../controllers/authController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import {
  validateUserRegistration,
  validateUserLogin
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);
router.post('/admin/login', validateUserLogin, adminLogin);
router.post('/logout', logout);

// Check auth status (with optional auth)
router.get('/check-auth', optionalAuth, checkAuth);

// Protected routes
router.use(protect); // All routes after this middleware are protected

router.get('/me', getMe);
router.patch('/update-password', updatePassword);

export default router;