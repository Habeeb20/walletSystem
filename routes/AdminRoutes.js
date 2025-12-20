// routes/admin.js
import express from 'express';
import User from '../models/user/userModel.js';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { authenticateToken } from '../utils/security.js';

const router = express.Router();


const adminAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    console.log(err)
    res.status(401).json({ message: 'Token is not valid' });
  }
};


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Hardcoded admin (you can later add an isAdmin field in User model)
    const ADMIN_EMAIL = 'Abeeb@gmail.com';
    const ADMIN_PASSWORD_HASH = await bcrypt.hash('Waliyu@bib', 10); // pre-hashed for comparison

    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // In real app, fetch admin user and compare hashed password
    const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT (use a different secret or role claim for admin)
    const token = jwt.sign(
      { email: ADMIN_EMAIL, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Admin login successful',
      token,
      user: { email: ADMIN_EMAIL, role: 'admin' },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/users
router.get('/users', authenticateToken, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});



// GET /api/admin/users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find()
      .select('fullName email phone balance createdAt')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});



// routes/admin.js

// GET /api/admin/transactions - All transactions from all users
router.get('/transactions', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('fullName email wallet.transactions');

    const allTransactions = [];

    users.forEach(user => {
      if (user.wallet && Array.isArray(user.wallet.transactions)) {
        user.wallet.transactions.forEach(tx => {
          allTransactions.push({
            userName: user.fullName || 'Unknown',
            userEmail: user.email,
            type: tx.type,
            amount: tx.amount || 0,
            status: tx.status || 'pending',
            reference: tx.reference || 'N/A',
            provider: tx.provider || '',
            details: tx.details || {},
            timestamp: tx.timestamp || new Date(),
          });
        });
      }
    });

    // Sort newest first
    allTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json(allTransactions);
  } catch (err) {
    console.error('Admin transactions error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('wallet.balance wallet.transactions');

    const totalUsers = users.length;
    const totalBalance = users.reduce((sum, u) => sum + (u.wallet?.balance || 0), 0);

    let totalSpent = 0;
    users.forEach(user => {
      if (user.wallet && Array.isArray(user.wallet.transactions)) {
        user.wallet.transactions.forEach(tx => {
          if (tx.type === 'debit') {
            totalSpent += tx.amount || 0;
          }
        });
      }
    });

    res.json({
      totalUsers,
      totalBalance,
      totalSpent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;



































