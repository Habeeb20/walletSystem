



































import User from '../models/user/userModel.js';
import Airtime from '../models/others/airtimeModel.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const MCD_API_URL = 'https://reseller.mcd.5starcompany.com.ng/api/v1';
const MCD_API_TOKEN = process.env.MCD_API_TOKEN;
const MCD_TOKEN = process.env.MCD_TOKEN
export const fetchWalletBalance = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ balance: user.wallet.balance });
  } catch (error) {
    console.error('Fetch wallet balance error:', error);
    res.status(500).json({ error: 'Failed to fetch wallet balance' });
  }
};

export const buyAirtime = async (req, res) => {
  try {
    const { network, amount, phone, country, promo = '0' } = req.body;
    const provider = network
    const number = phone
    console.log(req.body)
    console.log(provider, "your provider")
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Validate input
    if (!provider || !amount || !number ) {
      console.log("missing fields here")
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    if (user.wallet.balance < parsedAmount) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    // Generate unique reference
    const reference = `mcd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const existingAirtime = await Airtime.findOne({ ref: reference });
    if (existingAirtime) {
      return res.status(400).json({ error: 'Duplicate transaction reference' });
    }

    console.log(MCD_TOKEN, "your token")

    // Validate phone number/service (using /validate endpoint)
    const validateResponse = await fetch(`${MCD_API_URL}/validate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MCD_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service: 'airtime',
        provider,
        number,
      }),
    });

    if (!validateResponse.ok) {
      console.log(validateResponse)
      throw new Error(`Validation failed: ${validateResponse.status}`);
    }

    // const validateResult = await validateResponse.json();
    // if (!validateResult.success) {
    //   console.log(validateResult)
    //   return res.status(400).json({ error: validateResult.message  });
    // }

    // Create airtime transaction record (pending)
    const airtime = new Airtime({
      userId: user._id,
      provider,
      amount: parsedAmount,
      number,
      country: 'NGN',
      payment: 'wallet',
      promo,
      ref: reference,
      operatorID: 0,
      type: 'airtime',
      status: 'pending',
    });
    await airtime.save();

    // Deduct amount from wallet
    user.wallet.balance -= parsedAmount;
    await user.save();

    // Call MCD Reseller API for airtime
    const response = await fetch(`${MCD_API_URL}/airtime`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MCD_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider,
        amount: parsedAmount.toString(),
        number,
        country,
        payment: 'wallet',
        promo,
        ref: reference,
        operatorID: 0,
      }),
    });

    if (!response.ok) {
      // Roll back wallet balance and update transaction status
      user.wallet.balance += parsedAmount;
      airtime.status = 'failed';
      await Promise.all([user.save(), airtime.save()]);
      throw new Error(`MCD API error: ${response.status}`);
    }

    const result = await response.json();

    // Update transaction status and log to user wallet
    airtime.status = 'success';
    await airtime.save();

    user.wallet.transactions.push({
      type: 'debit',
      amount: parsedAmount,
      provider: 'mcd',
      reference,
      status: 'success',
      details: { provider, number, country, type: 'airtime' },
      timestamp: new Date(),
    });
    await user.save();

    res.json({ success: true, message: 'Airtime purchase successful', reference });
  } catch (error) {
    console.error('Airtime purchase error:', error);
    res.status(500).json({ error: error.message || 'Failed to purchase airtime' });
  }
};

export const buyDataPin = async (req, res) => {
  try {
    const { provider, amount, number, country, promo = '0' } = req.body;
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Validate input
    if (!provider || !amount || !number || !country) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    if (user.wallet.balance < parsedAmount) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    // Generate unique reference
    const reference = `mcd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const existingAirtime = await Airtime.findOne({ ref: reference });
    if (existingAirtime) {
      return res.status(400).json({ error: 'Duplicate transaction reference' });
    }

    // Validate phone number/service (using /validate endpoint)
    const validateResponse = await fetch(`${MCD_API_URL}/validate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MCD_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service: 'data',
        provider,
        number,
      }),
    });

    if (!validateResponse.ok) {
      throw new Error(`Validation failed: ${validateResponse.status}`);
    }

    const validateResult = await validateResponse.json();
    if (!validateResult.success) {
      return res.status(400).json({ error: validateResult.message || 'Invalid phone number or provider' });
    }

    // Create airtime transaction record (pending)
    const airtime = new Airtime({
      userId: user._id,
      provider,
      amount: parsedAmount,
      number,
      country,
      payment: 'wallet',
      promo,
      ref: reference,
      operatorID: 0,
      type: 'data_pin',
      status: 'pending',
    });
    await airtime.save();

    // Deduct amount from wallet
    user.wallet.balance -= parsedAmount;
    await user.save();

    // Call MCD Reseller API for data (assuming /data endpoint)
    const response = await fetch(`${MCD_API_URL}/data`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MCD_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider,
        amount: parsedAmount.toString(),
        number,
        country,
        payment: 'wallet',
        promo,
        ref: reference,
        operatorID: 0,
      }),
    });

    if (!response.ok) {
      // Roll back wallet balance and update transaction status
      user.wallet.balance += parsedAmount;
      airtime.status = 'failed';
      await Promise.all([user.save(), airtime.save()]);
      throw new Error(`MCD API error: ${response.status}`);
    }

    const result = await response.json();

    // Update transaction status and log to user wallet
    airtime.status = 'success';
    await airtime.save();

    user.wallet.transactions.push({
      type: 'debit',
      amount: parsedAmount,
      provider: 'mcd',
      reference,
      status: 'success',
      details: { provider, number, country, type: 'data_pin' },
      timestamp: new Date(),
    });
    await user.save();

    res.json({ success: true, message: 'Data pin purchase successful', reference });
  } catch (error) {
    console.error('Data pin purchase error:', error);
    res.status(500).json({ error: error.message || 'Failed to purchase data pin' });
  }
};



































