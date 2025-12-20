import User from '../models/user/userModel.js';
import Transfer from "../models/others/transferModel.js"
import { NIGERIAN_BANKS } from '../utils/banks.js';
import fetch from 'node-fetch';



const paylonytransferUrl= 'https://api.paylony.com/api/v1/bank_transfer'
const paylonyToken = process.env.PAYLONY_SECRET_KEY;



const PAYLONY_VERIFY_URL = 'https://api.paylony.com/api/v1/account_name';
const PAYLONY_TOKEN = process.env.PAYLONY_SECRET_KEY;

export const transferFunds = async (req, res) => {
  try {
    const { account_number, amount, narration, bank_code } = req.body;

    const user = await User.findOne({ email: req.user.email });
   const sender_name = user.first_name
 
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




export const verifyAccount = async (req, res) => {
  try {
    const { bank_code, account_number } = req.body;

    if (!bank_code || !account_number) {
      return res.status(400).json({ error: 'Bank code and account number required' });
    }

    const bank = NIGERIAN_BANKS.find(b => b.code === bank_code);
    if (!bank) {
      return res.status(400).json({ error: 'Invalid bank selected' });
    }

    const PAYLONY_WHITELIST = [
      "011", "033", "035", "044", "050", "057", "058",
      "070", "076", "082", "214", "221", "232"
    ];

    if (!PAYLONY_WHITELIST.includes(bank_code)) {
      return res.status(400).json({
        error: "This bank is not yet supported for transfers. Please use GTBank, Access, Zenith, UBA, First Bank, etc."
      });
    }

    const response = await fetch(PAYLONY_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYLONY_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bank_code: bank_code,
        account_number: account_number,
      }),
    });

    const data = await response.json();
    console.log('Paylony response:', data);

    if (!response.ok || data.success === false) {
      return res.status(400).json({
        error: data.message || 'Invalid account number or bank not supported',
      });
    }

    res.json({
      account_name: data.account_name,
      account_number: data.account_number || account_number,
      bank_name: bank.name,
      bank_code: bank_code,
    });

  } catch (err) {
    console.error('account verification error oocurred ', err);
    res.status(500).json({ error: 'Service temporarily unavailable' });
  }
};
