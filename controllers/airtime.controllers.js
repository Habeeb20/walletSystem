import User from '../models/user/userModel.js';
import axios from 'axios';
import { buyAirtime } from '../utils/flutterwave.js';

export const buyAirtime = async (req, res) => {
  try {
    const { phone, amount, network } = req.body;
    const user = await User.findOne({ email: req.user.email });
    if (!user || user.wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance or user not found' });
    }

    const response = await buyAirtime(phone, amount, network, process.env.FLUTTERWAVE_SECRET_KEY);

    if (response.status !== 'success') {
      throw new Error(response.message || 'Airtime purchase failed');
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
            provider: 'Flutterwave',
            reference: response.data.transaction_id || `AIRTIME_${Date.now()}`,
            status: 'success',
            details: { phone, network },
          },
        },
      }
    );

    res.json({ message: 'Airtime purchased successfully', details: response.data });
  } catch (error) {
    res.status(500).json({ error: `Airtime purchase failed: ${error.message}` });
  }
};

// export const buyAirtime = async (req, res) => {

  
//   try {
//     const { phone, amount, network } = req.body;
//     const user = await User.findOne({ email: req.user.email });
//     if (!user || user.wallet.balance < amount) {
//       return res.status(400).json({ error: 'Insufficient balance or user not found' });
//     }

//     const response = await axios.post(
//       'https://api.provider.com/vtu/airtime', // Replace with actual VTU API endpoint
//       { phone, amount, network },
//       { headers: { Authorization: `Bearer ${process.env.VTU_API_KEY}` } }
//     );

//     user.wallet.balance -= amount;
//     await user.save();

//     await User.updateOne(
//       { email: user.email },
//       {
//         $push: {
//           'wallet.transactions': {
//             type: 'debit',
//             amount,
//             provider: 'Airtime',
//             reference: `AIRTIME_${Date.now()}`,
//             status: 'success',
//             details: { phone, network },
//           },
//         },
//       }
//     );

//     res.json({ message: 'Airtime purchased successfully', details: response.data });
//   } catch (error) {
//     res.status(500).json({ error: `Airtime purchase failed: ${error.message}` });
//   }
// };