import User from '../models/user/userModel.js';
import dotenv from 'dotenv';
import { initializePayment, verifyPayment } from '../utils/paystack.js';

dotenv.config();



export const walletCallback = async (req, res) => {
  const { reference } = req.query;
  try {
    if (!reference) return res.status(400).json({ error: 'Reference is required' });
    const payment = await verifyPayment(reference);
    if (payment.status === 'success') {
      await User.updateOne(
        { 'wallet.transactions.reference': reference },
        {
          $set: { 'wallet.transactions.$.status': 'success' },
          $inc: { 'wallet.balance': payment.data.amount / 100 },
        }
      );
      res.redirect(`${process.env.CLIENT_URL}/dashboard?status=success`);
    } else {
      await User.updateOne(
        { 'wallet.transactions.reference': reference },
        { $set: { 'wallet.transactions.$.status': 'failed' } }
      );
      res.redirect(`${process.env.CLIENT_URL}/dashboard?status=failed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


export const payBill = async (req, res) => {
  try {
    const { billType, provider, phone, amount } = req.body;
    const user = await User.findOne({ email: req.user.email });
    if (!user || user.wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance or user not found' });
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
            provider: 'Bill Payment',
            reference: `BILL_${Date.now()}`,
            status: 'success',
            details: { billType, provider, phone },
          },
        },
      }
    );

    res.json({ message: 'Bill payment successful', amount });
  } catch (error) {
    res.status(500).json({ error: `Bill payment failed: ${error.message}` });
  }
};



export const handlePaystackWebhook = async (req, res) => {
  const event = req.body;
   const user = await User.findOne({ email: customer.email });
  if (event.event === 'charge.success') {
    const { customer, amount } = event.data;
    const user = await User.findOne({ email: customer.email });
    if (user) {
      user.wallet.balance = (user.wallet.balance || 0) + amount / 100;
      await user.save();
    }
  } else if (event.event === 'transfer.success' && user.virtualAccountDetails) {
    const { amount, destination } = event.data;
    const user = await User.findOne({ 'virtualAccountDetails.account_number': destination.account_number });
    if (user) {
      user.wallet.balance += amount / 100;
      await user.save();
    }
  }
  res.status(200).send('Webhook received');
};

export const fundWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Valid amount is required' });

    const { url, reference } = await initializePayment(
      user.email,
      amount,
      `${process.env.CLIENT_URL}/dashboard`,
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
            status: 'pending',
          },
        },
      }
    );
    res.json({ url, reference });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};



