import User from '../models/user/userModel.js';
import dotenv from 'dotenv';
import { initializePayment, verifyPayment } from '../utils/paystack.js';
import axios from 'axios';
import fetch from "node-fetch"
import crypto from "crypto"
dotenv.config();




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








export const fetchPaylonyAccounts = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user?.paylonyVirtualAccountDetails?.account_number) {
      return res.status(400).json({ error: 'No Paylony account linked' });
    }

    console.log('Stored Account Number:', user.paylonyVirtualAccountDetails.account_number);
    const response = await axios.get(
      `https://api.paylony.com/api/v1/fetch_all_accounts`,
      { headers: { Authorization: `Bearer ${process.env.PAYLONY_SECRET_KEY}` } }
    );
    console.log('Paylony API Response:', response.data);

    const { data: { data: accounts = [] } = {} } = response.data;
    const userAccount = accounts.find(acc => acc.account_number === user.paylonyVirtualAccountDetails.account_number);
    if (!userAccount) {
      console.warn('User account not found in response');
      return res.json({ success: true, wallet: user.wallet || { balance: 0, transactions: [] } });
    }

    console.log('User Account:', userAccount);
    user.wallet = user.wallet || {};
    user.wallet.balance = user.wallet.balance || 0; // No update from API
    await user.save();
    res.json({ success: true, wallet: user.wallet });
  } catch (error) {
    console.error('Error fetching Paylony accounts:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data?.message || 'Failed to fetch Paylony accounts' });
  }
};

export const handlePaylonyWebhook = async (req, res) => {
  try {
    console.log('Webhook received:', req.body);
    const { status, event, amount, fee, receiving_account, reference, timestamp, sender_narration } = req.body;
    if (status === '00' && event === 'collection') {
      const user = await User.findOne({ 'paylonyVirtualAccountDetails.account_number': receiving_account });
      if (user) {
        const netAmount = parseFloat(amount) - parseFloat(fee || 0);
        user.wallet = user.wallet || {};
        user.wallet.balance = (user.wallet.balance || 0) + netAmount;
        user.wallet.transactions = user.wallet.transactions || [];
        user.wallet.transactions.push({
          type: 'credit',
          amount: netAmount,
          provider: 'paylony',
          reference,
          status: 'success',
          details: { narration: sender_narration || 'Inward transfer' },
          timestamp: new Date(timestamp),
        });
        await user.save();
        console.log('Webhook updated wallet:', user.wallet);
      }
    }
    res.status(200).send('success');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('error');
  }
};

export const manualUpdateWallet = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { reference, amount, fee } = req.body;
    if (reference === 'C2509060510') { // Specific to this transaction
      const netAmount = parseFloat(amount) - parseFloat(fee || 0);
      user.wallet = user.wallet || {};
      user.wallet.balance = (user.wallet.balance || 0) + netAmount;
      user.wallet.transactions = user.wallet.transactions || [];
      user.wallet.transactions.push({
        type: 'credit',
        amount: netAmount,
        provider: 'paylony',
        reference,
        status: 'success',
        details: { narration: 'Transfer from HABEEB ADEMOLA WALIYU' },
        timestamp: new Date('2025-09-06T17:22:00Z'),
      });
      await user.save();
      console.log('Manual wallet update:', user.wallet);
    } else {
      return res.status(400).json({ error: 'Invalid reference for manual update' });
    }
    res.json({ success: true, wallet: user.wallet });
  } catch (error) {
    console.error('Manual update error:', error);
    res.status(500).json({ error: 'Failed to update wallet' });
  }
};



const PAYLONY_SECRET = process.env.PAYLONY_SECRET_KEY;
const PAYLONY_API_URL = 'https://api.paylony.com/api/v1';
export const PaylonyWebhook = async (req, res) => {
  try {
   


    const { event, status, amount, fee, receiving_account, reference, timestamp, sender_narration } = req.body;

    if (event === 'collection' && status === '00') {
   
      const existingTxn = await User.findOne({
        'wallet.transactions.reference': reference,
      });
      if (existingTxn) {
        console.log('Duplicate webhook ignored:', reference);
        return res.status(200).json({ status: 'success' });
      }

  
      const user = await User.findOne({
        'paylonyVirtualAccountDetails.account_number': receiving_account,
      });
      if (!user) {
        console.error('User not found for account:', receiving_account);
        return res.status(200).json({ status: 'success' });
      }

      const netAmount = parseFloat(amount) - parseFloat(fee || 0);
      const balance = await fetchCustomerBalance(receiving_account, reference);
      if (balance !== null) {
        await updateWalletBalance(
          user._id,
          balance,
          netAmount,
          'credit',
          reference,
          sender_narration,
          timestamp
        );
        console.log(`Balance updated for user ${user._id}: ${balance} NGN`);
      } else {
     
        await updateWalletBalance(
          user._id,
          (user.wallet?.balance || 0) + netAmount,
          netAmount,
          'credit',
          reference,
          sender_narration,
          timestamp
        );
        console.log(`Balance updated (fallback) for user ${user._id}: ${user.wallet?.balance + netAmount} NGN`);
      }
    }

    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// async function fetchCustomerBalance(accountNumber, reference) {
//   try {
 
//     const response = await fetch(`${PAYLONY_API_URL}/accounts/${accountNumber}/balance`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${process.env.PAYLONY_SECRET_KEY}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (response.ok) {
//       const { success, data } = await response.json();
//       if (success) return data.balance;
//     }

//     const txResponse = await fetch(`${PAYLONY_API_URL}/fetch_transfer_details/${reference}`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${process.env.PAYLONY_SECRET_KEY}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!txResponse.ok) {
//       throw new Error(`API error: ${txResponse.status}`);
//     }

//     const { success, data } = await txResponse.json();
//     if (!success) {
//       throw new Error('Failed to fetch transaction details');
//     }

//     const credits = data?.filter(t => t.type === 'credit' && t.status === 'success');
//     const totalCredit = credits?.reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
//     const fees = data?.filter(t => t.type === 'fee').reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
//     return totalCredit - fees; 
//   } catch (error) {
//     console.error(`Error fetching balance for account ${accountNumber}:`, error);
//     return null;
//   }
// }

// async function updateWalletBalance(userId, balance, amount, type, reference, narration, timestamp) {
//   const user = await User.findById(userId);
//   if (!user) {
//     console.error(`User not found for ID: ${userId}`);
//     return;
//   }

//   user.wallet = user.wallet || { balance: 0, transactions: [] };
//   user.wallet.balance = balance;
//   user.wallet.transactions.push({
//     type,
//     amount,
//     provider: 'paylony',
//     reference,
//     status: 'success',
//     details: { narration: narration || 'Inward transfer' },
//     timestamp: new Date(timestamp),
//   });

//   await user.save();
// }




export const createDirectDebitMandate = async (req, res) => {
  try {
    const {
      reference,
      payerBank,
      payerAccountNumber,
      payerBvn,
      payerPhone,
      amount,
      startDate,
      endDate,
      frequency,
      payerSignature,
      witnessSignature,
    } = req.body;

    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const response = await fetch(`${PAYLONY_API_URL}/directdebit/create_mandate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYLONY_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reference: reference || `MANDATE_${Date.now()}`,
        payerBank,
        payerAccountNumber,
        payerBvn,
        payerPhone,
        amount,
        startDate,
        endDate,
        frequency,
        payerSignature,
        witnessSignature,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create mandate: ${response.status}`);
    }

    const { success, data } = await response.json();
    if (!success) {
      throw new Error('Mandate creation failed');
    }
    user.paylonyVirtualAccountDetails = user.paylonyVirtualAccountDetails || {};
    user.paylonyVirtualAccountDetails.mandate = {
      reference: data.reference,
      status: 'created',
      createdAt: new Date(),
    };
    await user.save();

    res.json({ success: true, mandate: data });
  } catch (error) {
    console.error('Create mandate error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const debitMandate = async (req, res) => {
  try {
    const { reference, amount } = req.body;
    const user = await User.findOne({ email: req.user.email });
    if (!user || !user.paylonyVirtualAccountDetails?.mandate?.reference) {
      return res.status(400).json({ error: 'No mandate found for user' });
    }

    const response = await fetch(`${PAYLONY_API_URL}/directdebit/debit_mandate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYLONY_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reference,
        amount,
        payerAccountNumber: user.paylonyVirtualAccountDetails.account_number,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to debit mandate: ${response.status}`);
    }

    const { success, data } = await response.json();
    if (!success) {
      throw new Error('Debit mandate failed');
    }

  
    const netAmount = -parseFloat(amount);
    user.wallet = user.wallet || { balance: 0, transactions: [] };
    user.wallet.balance += netAmount;
    user.wallet.transactions.push({
      type: 'debit',
      amount: parseFloat(amount),
      provider: 'paylony',
      reference,
      status: 'success',
      details: { narration: 'Direct Debit' },
      timestamp: new Date(),
    });
    await user.save();

    res.json({ success: true, transaction: data });
  } catch (error) {
    console.error('Debit mandate error:', error);
    res.status(500).json({ error: error.message });
  }
};


export const fetchAndUpdateWalletBalance = async (req, res) => {
  // Source provider and reference from alternative locations
  const provider = 'paylony'; // Hardcode to 'paylony' since the code is Paylony-specific
  const reference ='sydegllwnq8bqiqk1np1'
  console.log({ provider, reference }, "Provider and reference used");

  // Validate provider (optional, since we're hardcoding it)
  if (provider !== 'paylony') {
    console.log("Provider is not Paylony");
    return res.status(400).json({ error: 'Unsupported provider' });
  }

  // Validate environment variables
  if (!process.env.PAYLONY_API_URL || !process.env.PAYLONY_SECRET_KEY) {
    return res.status(500).json({ error: 'Missing Paylony API configuration' });
  }

  const session = await User.startSession();
  session.startTransaction();
  try {
    const user = await User.findOne({ email: req.user?.email }).session(session);
    if (!user) throw new Error('User not found');

    const balance = await fetchCustomerBalance(user.paylonyVirtualAccountDetails.account_number, reference);
    if (balance !== null) {
      user.wallet = user.wallet || { balance: 0, transactions: [] };
      const previousBalance = user.wallet.balance;
      const amountChanged = balance - previousBalance;
      if (amountChanged !== 0 && reference) { // Only log transaction if reference is provided and balance changed
        await updateWalletBalance(
          user._id,
          balance,
          Math.abs(amountChanged),
          amountChanged > 0 ? 'credit' : 'debit',
          reference,
          'Balance update from Paylony',
          Date.now()
        );
      } else {
        user.wallet.balance = balance; // Update balance without logging transaction if no reference
        await user.save({ session });
      }
      await session.commitTransaction();
      console.log(`Wallet balance updated for ${provider} (${reference || 'no reference'}): from ${previousBalance} to ${balance}`);
      res.json({ balance }); // Match frontend expectation
    } else {
      throw new Error('Failed to fetch balance');
    }
  } catch (error) {
    await session.abortTransaction();
    console.error(`Error fetching ${provider} transaction details (${reference || 'no reference'}):`, error);
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

async function fetchCustomerBalance(accountNumber, reference) {
  try {
    if (!process.env.PAYLONY_API_URL || !process.env.PAYLONY_SECRET_KEY) {
      throw new Error('Missing Paylony API configuration');
    }

    // Sanitize PAYLONY_API_URL to remove trailing slashes, semicolons, or whitespace
    const baseUrl = process.env.PAYLONY_API_URL.replace(/[;\s/]+$/, '');
    console.log(`Sanitized PAYLONY_API_URL: ${baseUrl}`); // Log for debugging

    // Use the correct Paylony API endpoint for balance (adjust based on documentation)
    const balanceUrl = `${baseUrl}/accounts/${accountNumber}/balance`; // Verify this endpoint
    console.log(`Attempting to fetch balance from: ${balanceUrl}`);

    try {
      new URL(balanceUrl); // Validate URL format
    } catch (urlError) {
      throw new Error(`Invalid Paylony API URL: ${balanceUrl}`);
    }

    const response = await fetch(balanceUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.PAYLONY_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const { success, data } = await response.json();
      if (success && data && typeof data.balance === 'number') {
        console.log(`Fetched balance for account ${accountNumber}: ${data.balance}`);
        return data.balance;
      }
      throw new Error('Invalid response format from Paylony balance API');
    } else if (response.status === 404) {
      console.error(`Balance API returned 404 for account ${accountNumber}`);
      // Proceed to transaction details if reference is provided
    } else {
      throw new Error(`Balance API error: ${response.status}`);
    }

    if (!reference) {
      throw new Error('No reference provided and balance API failed');
    }

    // Use the correct Paylony API endpoint for transaction details (adjust based on documentation)
    const txUrl = `${baseUrl}/fetch_transfer_details/${reference}`; // Verify this endpoint
    console.log(`Attempting to fetch transaction details from: ${txUrl}`);

    try {
      new URL(txUrl); // Validate URL format
    } catch (urlError) {
      throw new Error(`Invalid Paylony transaction URL: ${txUrl}`);
    }

    const txResponse = await fetch(txUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.PAYLONY_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!txResponse.ok) {
      throw new Error(`Transaction API error: ${txResponse.status}`);
    }

    const { success, data } = await txResponse.json();
    if (!success || !data) {
      throw new Error('Failed to fetch transaction details or no data returned');
    }

    const credits = data?.filter(t => t.type === 'credit' && t.status === 'success');
    const totalCredit = credits?.reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
    const fees = data?.filter(t => t.type === 'fee').reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
    const calculatedBalance = totalCredit - fees;
    console.log(`Calculated balance from transactions for ${reference}: ${calculatedBalance}`);
    return calculatedBalance;
  } catch (error) {
    console.error(`Error fetching balance for account ${accountNumber}:`, error);
    return null;
  }
}

async function updateWalletBalance(userId, balance, amount, type, reference, narration, timestamp) {
  const user = await User.findById(userId);
  if (!user) {
    console.error(`User not found for ID: ${userId}`);
    return;
  }

  user.wallet = user.wallet || { balance: 0, transactions: [] };
  user.wallet.balance = balance;
  user.wallet.transactions.push({
    type,
    amount,
    provider: 'paylony',
    reference,
    status: 'success',
    details: { narration: narration || 'Inward transfer' },
    timestamp: new Date(timestamp),
  });

  await user.save();
}



export const walletCallback = async (req, res) => {
  try {
    const { reference } = req.query;
    const user = await User.findOne({
      $or: [
        { 'paylonyVirtualAccountDetails.reference': reference },
        { 'wallet.transactions.reference': reference },
      ],
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const balance = await fetchCustomerBalance(user.paylonyVirtualAccountDetails.account_number, reference);
    if (balance !== null) {
      user.wallet = user.wallet || { balance: 0, transactions: [] };
      user.wallet.balance = balance;
      user.wallet.transactions.push({
        type: 'credit',
        amount: balance, 
        provider: 'paylony',
        reference,
        status: 'success',
        details: { narration: 'Callback transaction' },
        timestamp: new Date(),
      });
      await user.save();
      console.log('Callback updated wallet:', user.wallet);
      res.json({ success: true, wallet: user.wallet });
    } else {
      res.status(500).json({ error: 'Failed to fetch balance' });
    }
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).json({ error: 'Failed to process callback' });
  }
};





















































































