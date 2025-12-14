// routes/admin.js
import express from 'express';
import User from '../models/user/userModel.js';
import { authenticateToken } from '../utils/security.js';

const router = express.Router();

// GET /api/admin/users
router.get('/users', authenticateToken, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// GET /api/admin/transactions
router.get('/transactions', authenticateToken, async (req, res) => {
  const users = await User.find();
  const allTx = [];
  users.forEach(user => {
    user.transactions.forEach(tx => {
      allTx.push({
        ...tx.toObject(),
        userId: user._id,
        userEmail: user.email,
      });
    });
  });
  // Sort newest first
  allTx.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json(allTx);
});

export default router;