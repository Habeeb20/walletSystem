import User from '../models/user/userModel.js';
import axios from 'axios';

export const buyData = async (req, res) => {
  try {
    const { phone, amount, network, plan } = req.body; // plan e.g., 1GB
    const user = await User.findOne({ email: req.user.email });
    if (!user || user.wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance or user not found' });
    }

    const response = await axios.post(
      'https://api.provider.com/vtu/data', // Replace with actual VTU API endpoint
      { phone, amount, network, plan },
      { headers: { Authorization: `Bearer ${process.env.VTU_API_KEY}` } }
    );

    user.wallet.balance -= amount;
    await user.save();

    await User.updateOne(
      { email: user.email },
      {
        $push: {
          'wallet.transactions': {
            type: 'debit',
            amount,
            provider: 'Data',
            reference: `DATA_${Date.now()}`,
            status: 'success',
            details: { phone, network, plan },
          },
        },
      }
    );

    res.json({ message: 'Data purchased successfully', details: response.data });
  } catch (error) {
    res.status(500).json({ error: `Data purchase failed: ${error.message}` });
  }
};