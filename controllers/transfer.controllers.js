import User from '../models/user/userModel.js';







export const transferFunds = async (req, res) => {
  try {
    const { recipientEmail, amount } = req.body;
    const sender = await User.findOne({ email: req.user.email });
    const recipient = await User.findOne({ email: recipientEmail });

    if (!sender || !recipient || sender.wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance or invalid recipient' });
    }

    sender.wallet.balance -= amount;
    recipient.wallet.balance = (recipient.wallet.balance || 0) + amount;
    await Promise.all([sender.save(), recipient.save()]);

    await User.updateOne(
      { email: sender.email },
      {
        $push: {
          'wallet.transactions': {
            type: 'debit',
            amount,
            provider: 'Transfer',
            reference: `TRANSFER_${Date.now()}`,
            status: 'success',
            details: { recipientEmail },
          },
        },
      }
    );

    await User.updateOne(
      { email: recipient.email },
      {
        $push: {
          'wallet.transactions': {
            type: 'credit',
            amount,
            provider: 'Transfer',
            reference: `TRANSFER_${Date.now()}`,
            status: 'success',
            details: { senderEmail: sender.email },
          },
        },
      }
    );

    res.json({ message: 'Transfer successful', amount });
  } catch (error) {
    res.status(500).json({ error: `Transfer failed: ${error.message}` });
  }
};