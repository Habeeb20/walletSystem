import User from '../models/user/userModel.js';
import axios from 'axios';


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
    const { network, amount, phone } = req.body;
    const user = await User.findOne({ email: req.user.email });
    if(!user){
      return res.status(400).json({ error: ' user not found'})
    }
    if ( user.wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance, please fund your wallet ' });
    }

    // Simulate VTU API call (replace with actual API)
    const vtuResponse = await axios.post(
      'https://api.vtu-provider.com/airtime-recharge', // Replace with real VTU API
      { network, amount, phone },
      { headers: { Authorization: `Bearer ${process.env.VTU_API_KEY}` } }
    );

    if (vtuResponse.data.status !== 'success') {
      return res.status(500).json({ error: 'Airtime recharge failed' });
    }

    user.wallet.balance -= amount;
    await user.save();

    await User.updateOne(
      { email: user.email },
      {
        $push: {
          'wallet.transactions': {
            type: 'debit',
            amount,
            provider: 'VTU',
            reference: vtuResponse.data.transaction_id || `AIRTIME_${Date.now()}`,
            status: 'success',
            details: { network, phone },
            timestamp: new Date(),
          },
        },
      }
    );

    res.json({ message: 'Airtime recharge successful', balance: user.wallet.balance });
  } catch (error) {
    res.status(500).json({ error: `Airtime recharge failed: ${error.message}` });
  }
};