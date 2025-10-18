import User from '../models/user/userModel.js';
import Transfer from "../models/others/transferModel.js"


const paylonytransferUrl= 'https://api.paylony.com/api/v1/bank_transfer'
const paylonyToken = process.env.PAYLONY_SECRET_KEY;

export const transferFunds = async (req, res) => {
  try {
    const { account_number, amount, narration } = req.body;
    const user = await User.findOne({ email: req.user.email });
   const sender_name = user.first_name
   const bank_code = "999999"
   const reference = `mcd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
   if(!sender_name){
    return res.status(400).json({message:"sender name not found"})
   }
     const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
        if (user.wallet.balance < parsedAmount) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }
     const  transfer = new Transfer({
         userId: user._id,
         amount: parsedAmount,
         account_number,
         bank_code,
         ref:reference

     })

     await transfer.save();



    user.wallet.balance -= parsedAmount;
  await user.save();
  const response = await fetch(`${ paylonytransferUrl}`, {
       method: 'POST',
      headers: {
        'Authorization': `Bearer ${paylonyToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user._id,
         amount: parsedAmount,
         account_number,
         bank_code,
         ref:reference,
         sender_name:user.first_name
      }),
  })

    if (!response.ok) {
      // Roll back wallet balance and update transaction status
      user.wallet.balance += parsedAmount;
      airtime.status = 'failed';
      await Promise.all([user.save(), airtime.save()]);
      throw new Error(`MCD API error: ${response.status}`);
    }

      const result = await response.json();
console.log(result)
      transfer.status = 'success';
      await transfer.save();
         user.wallet.transactions.push({
      type: 'debit',
      amount: parsedAmount,
      provider: 'paylony',
      reference,
      status: 'success',
      details: {  account_number,
         bank_code, type: 'transfer' },
      timestamp: new Date(),
    });
    await user.save();

    res.json({ message: 'Transfer successful', amount });
  } catch (error) {
    res.status(500).json({ error: `Transfer failed: ${error.message}` });
  }
};


