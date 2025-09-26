import User from '../models/user/userModel.js';
import axios from 'axios';
import crypto from "crypto"
import dotenv from "dotenv"

dotenv.config()

const PAYLONY_SECRET = process.env.PAYLONY_SECRET_KEY;
const PAYLONY_API_URL = 'https://api.paylony.com/api/v1';
const MCD_API_URL = 'https://resellertest.mcd.5starcompany.com.ng/api/v1';
const MCD_API_TOKEN = process.env.MCD_API_TOKEN;

export const fetchWalletBalance = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ balance: user.wallet.balance });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wallet balance' });
  }
};



export const buyAirtime = async (req, res) => {
  try {
    const { name, coded, amount, number, country, promo = '0' } = req.body;
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Validate input
    if (!name || !coded || !amount || !number || !country) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    if (user.wallet.balance < parseFloat(amount)) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    // Check for duplicate transaction
    const reference = `mcd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const existingTxn = await User.findOne({
      'wallet.transactions.reference': reference,
    });
    if (existingTxn) {
      return res.status(400).json({ error: 'Duplicate transaction reference' });
    }

    // Deduct amount from wallet
    user.wallet.balance -= parseFloat(amount);
    await user.save();

    // Call MCD Reseller API
    const response = await fetch(`${MCD_API_URL}/data`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MCD_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        coded,
        amount: parseFloat(amount).toString(),
        number,
        payment: 'wallet',
        promo,
        ref: reference,
        country,
      }),
    });

    if (!response.ok) {
      // Roll back wallet balance on failure
      user.wallet.balance += parseFloat(amount);
      await user.save();
      throw new Error(`MCD API error: ${response.status}`);
    }

    // Log transaction
    user.wallet.transactions.push({
      type: 'debit',
      amount: parseFloat(amount),
      provider: 'mcd',
      reference,
      status: 'success',
      details: { name, number, country },
      timestamp: new Date(),
    });
    await user.save();

    res.json({ success: true, message: 'Airtime purchase successful', reference });
  } catch (error) {
    console.error('Airtime purchase error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const buyDataPin = async (req, res) => {
  try {
    const { name, coded, amount, number, country, promo = '0' } = req.body;
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Validate input
    if (!name || !coded || !amount || !number || !country) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    if (user.wallet.balance < parseFloat(amount)) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    // Check for duplicate transaction
    const reference = `mcd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const existingTxn = await User.findOne({
      'wallet.transactions.reference': reference,
    });
    if (existingTxn) {
      return res.status(400).json({ error: 'Duplicate transaction reference' });
    }

    // Deduct amount from wallet
    user.wallet.balance -= parseFloat(amount);
    await user.save();

    // Call MCD Reseller API for data pin
    const response = await fetch(`${MCD_API_URL}/datapin`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MCD_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        coded,
        amount: parseFloat(amount).toString(),
        number,
        payment: 'wallet',
        promo,
        ref: reference,
        country,
      }),
    });

    if (!response.ok) {
      // Roll back wallet balance on failure
      user.wallet.balance += parseFloat(amount);
      await user.save();
      throw new Error(`MCD API error: ${response.status}`);
    }

    // Log transaction
    user.wallet.transactions.push({
      type: 'debit',
      amount: parseFloat(amount),
      provider: 'mcd',
      reference,
      status: 'success',
      details: { name, number, country, type: 'data_pin' },
      timestamp: new Date(),
    });
    await user.save();

    res.json({ success: true, message: 'Data pin purchase successful', reference });
  } catch (error) {
    console.error('Data pin purchase error:', error);
    res.status(500).json({ error: error.message });
  }
};