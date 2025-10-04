
import User from '../models/user/userModel.js';
import Airtime from '../models/others/airtimeModel.js';
import Data from '../models/others/dataModel.js';

import dotenv from 'dotenv';

dotenv.config();

const MCD_API_URL =  'https://reseller.mcd.5starcompany.com.ng/api/v1';
const MCD_API_TOKEN = process.env.MCD_API_TOKEN;
const MCD_TOKEN = process.env.MCD_TOKEN
export const buyData = async (req, res) => {
  try {
    const {  coded, number,   reseller_price } = req.body;
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    console.log(req.body)
    
    if (!coded || !number || !reseller_price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const parsedAmount = parseFloat(reseller_price);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'Invalid reseller price' });
    }
    if (user.wallet.balance < parsedAmount) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    const  provider= coded.split('_')[0]
    const country = "NG"

   

    // Generate unique reference
    const reference = `mcd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const existingData = await Data.findOne({ ref: reference }); // Updated to Data
    if (existingData) {
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
   
    // Create data transaction record (pending)
    const data = new Data({ // Updated to Data
      userId: user._id,
      coded,
      provider: coded.split('_')[0], // Store provider part of coded
      number,
      country: "NG",
      payment: 'wallet',
      promo: "0",
      ref: reference,
      reseller_price: parsedAmount,
      status: 'pending',
    });
    await data.save();

    // Deduct amount from wallet
    user.wallet.balance -= parsedAmount;
    await user.save();

    // Call MCD Reseller API for data
    const response = await fetch(`${MCD_API_URL}/data`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MCD_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coded,
        number,
        payment: 'wallet',
        promo:"0",
        ref: reference,
        country: "NG",
        reseller_price: parsedAmount.toString(),
      }),
    });

    if (!response.ok) {
      // Roll back wallet balance and update transaction status
      user.wallet.balance += parsedAmount;
      data.status = 'failed'; // Updated to data
      await Promise.all([user.save(), data.save()]);
      throw new Error(`MCD API error: ${response.status}`);
    }

    const result = await response.json();

    // Update transaction status and log to user wallet
    data.status = 'success'; // Updated to data
    data.dataPlanDetails = result.data || {}; // Store additional API response data
    await data.save();

    user.wallet.transactions.push({
      type: 'debit',
      amount: parsedAmount,
      provider: 'mcd',
      reference,
      status: 'success',
      details: { coded, number, country, type: 'data' },
      timestamp: new Date(),
    });
    await user.save();
console.log(result)
    res.json({ success: true, message: 'Data purchase successful', reference });
  } catch (error) {
    console.error('Data purchase error:', error);
    res.status(500).json({ error: error.message || 'Failed to purchase data' });
  }
};