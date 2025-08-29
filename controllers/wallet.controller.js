




import User from '../models/user/userModel.js';
import dotenv from 'dotenv';
import { initializePayment, verifyPayment } from '../utils/paystack.js';


dotenv.config()
export const fundWallet = async(req, res) => {
    try {
        const {amount} = req.body;
        const user = await User.findOne({email: req.user.email})
        if (!user) return res.status(404).json({ error: 'User not found' });
        const { url, reference } = await initializePayment(
        user.email,
        amount,
        `${process.env.CLIENT_URL}/wallet/callback`,
        user.paystackCustomerId
    );

      await User.updateOne(
      { email: user.email },
      {
        $push: {
          'wallet.transactions': {
            type: 'credit',
            amount,
            provider: 'Paystack',
            reference,
            status: 'pending'
          }
        }
      }
    );
     res.json({ url, reference });
    } catch (error) {
         console.error(error);
         res.status(500).json({ error: error.message });
    }
}


export const walletCallback = async(req, res) => {
    const { reference } = req.query;
  try {
    const payment = await verifyPayment(reference);
    if (payment.status === 'success') {
      await User.updateOne(
        { 'wallet.transactions.reference': reference },
        {
          $set: { 'wallet.transactions.$.status': 'success' },
          $inc: { 'wallet.balance': payment.data.amount / 100 } 
        }
      );
      res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    } else {
      await User.updateOne(
        { 'wallet.transactions.reference': reference },
        { $set: { 'wallet.transactions.$.status': 'failed' } }
      );
      res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}


export const handlePaystackWebhook = async (req, res) => {
  const event = req.body;
  if (event.event === 'transfer.success') {
    const { recipient_code, amount } = event.data;
    const user = await User.findOne({ virtualAccountDetails: { account_number: event.data.destination.account_number } });
    if (user) {
      user.wallet.balance += amount / 100; // Convert to NGN
      await user.save();
      // Notify user via email or push
    }
  }
  res.status(200).send('Webhook received');
};





export const payBill = async (req, res) => {
  try {
    const { billType, provider, phone, amount } = req.body;
    const user = await User.findOne({ email: req.user.email });
    if (user.wallet.balance < amount) return res.status(400).json({ error: 'Insufficient balance' });

    const payment = await payBill(billType, provider, phone, amount);
    user.wallet.balance -= amount;
    await user.save();

    res.json({ message: 'Bill payment successful', payment });
  } catch (error) {
    res.status(500).json({ error: `Bill payment failed: ${error.message}` });
  }
};