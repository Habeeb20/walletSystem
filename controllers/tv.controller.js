import User from '../models/user/userModel.js';
import Tv from '../models/others/tvModel.js';
import dotenv from "dotenv"

dotenv.config();





const MCD_API_URL =  'https://reseller.mcd.5starcompany.com.ng/api/v1';
const MCD_API_TOKEN = process.env.MCD_API_TOKEN;
const MCD_TOKEN = process.env.MCD_TOKEN



export const tvSubscription= async (req, res) => {
  try {
    const {  coded, number, price  } = req.body;
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    console.log(req.body)
    
    if (!coded || !number || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const parsedAmount = parseFloat(price);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'Invalid  price' });
    }
    if (user.wallet.balance < parsedAmount) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    const  provider= coded.split('_')[0]
    const country = "NG"

   

    // Generate unique reference
    const reference = `mcd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const existingData = await Tv.findOne({ ref: reference }); // Updated to Data
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
        service: 'tv-subscription',
        provider,
        number,
      }),
    });

    if (!validateResponse.ok) {
      console.log(validateResponse)
      throw new Error(`Validation failed: ${validateResponse.status}`);
    }
   
    // Create data transaction record (pending)
    const tvSub = new Tv({ // Updated to Data
      userId: user._id,
      coded,
      provider: coded.split('_')[0], // Store provider part of coded
      number,
      country: "NG",
      payment: 'wallet',
      promo: "0",
      ref: reference,
     price: parsedAmount,
      status: 'pending',
    });
    await tvSub.save();

    // Deduct amount from wallet
    user.wallet.balance -= parsedAmount;
    await user.save();

    // Call MCD Reseller API for data
    const response = await fetch(`${MCD_API_URL}/tv`, {
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
      tvSub.status = 'failed'; // Updated to data
      await Promise.all([user.save(), tvSub.save()]);
      throw new Error(`MCD API error: ${response.status}`);
    }

    const result = await response.json();

    // Update transaction status and log to user wallet
    tvSub.status = 'success'; // Updated to data
    tvSub.tvDetails = result.data || {}; // Store additional API response data
    await tvSub.save();

    user.wallet.transactions.push({
      type: 'debit',
      amount: parsedAmount,
      provider: 'mcd',
      reference,
      status: 'success',
      details: { coded, number, country, type: 'tv_subscription' },
      timestamp: new Date(),
    });
    await user.save();
console.log(result)
    res.json({ success: true, message: 'TV subscription done successful', reference });
  } catch (error) {
    console.error('Data purchase error:', error);
    res.status(500).json({ error: error.message || 'Failed to purchase data' });
  }
};