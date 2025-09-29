import User from '../models/user/userModel.js';
import dotenv from 'dotenv';
import { initializePayment, verifyPayment } from '../utils/paystack.js';
import axios from 'axios';
import fetch from "node-fetch"
import crypto from "crypto"

import pkg from 'uuid';

import mongoose from 'mongoose';
dotenv.config();

const { v4: uuidv4 } = pkg;


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






async function fetchCustomerBalance(accountNumber, reference = null) {
  try {
    if (!process.env.PAYLONY_API_URL || !process.env.PAYLONY_SECRET_KEY) {
      throw new Error('Missing Paylony API configuration');
    }

    const baseUrl = process.env.PAYLONY_API_URL.replace(/[;\s/]+$/, '');
    console.log(`Sanitized PAYLONY_API_URL: ${baseUrl}`);

    // Attempt to fetch balance
    const balanceUrl = `${baseUrl}/accounts/${accountNumber}/balance`;
    console.log(`Attempting to fetch balance from: ${balanceUrl}`);

    try {
      new URL(balanceUrl);
    } catch (urlError) {
      throw new Error(`Invalid Paylony API URL: ${balanceUrl}`);
    }

    const balanceResponse = await fetch(balanceUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.PAYLONY_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (balanceResponse.status === 404) {
      throw new Error(`Account ${accountNumber} not found in Paylony`);
    }

    if (balanceResponse.ok) {
      const { success, data } = await balanceResponse.json();
      if (success && data && typeof data.balance === 'number') {
        console.log(`Fetched balance for account ${accountNumber}: ${data.balance}`);
        return data.balance;
      }
      throw new Error('Invalid response format from Paylony balance API');
    } else {
      const rawResponse = await balanceResponse.text();
      console.error(`Balance API returned ${balanceResponse.status} for account ${accountNumber}: ${rawResponse}`);
      throw new Error(`Paylony API error: ${balanceResponse.status}`);
    }

    // If balance fetch fails and reference is provided, try transaction details (fallback)
    if (reference) {
      const txUrl = `${baseUrl}/fetch_transfer_details/${reference}`;
      console.log(`Attempting to fetch transaction details from: ${txUrl}`);

      try {
        new URL(txUrl);
      } catch (urlError) {
        throw new Error(`Invalid Paylony transaction URL: ${txUrl}`);
      }

      const txResponse = await fetch(txUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.PAYLONY_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (!txResponse.ok) {
        const rawTxResponse = await txResponse.text();
        console.error(`Transaction API returned ${txResponse.status}: ${rawTxResponse}`);
        throw new Error(`Transaction API error: ${txResponse.status}`);
      }

      const { success, data } = await txResponse.json();
      if (!success || !data) {
        throw new Error('Failed to fetch transaction details or no data returned');
      }

      const credits = data?.filter((t) => t.type === 'credit' && t.status === 'success');
      const totalCredit = credits?.reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
      const fees = data?.filter((t) => t.type === 'fee').reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
      const calculatedBalance = totalCredit - fees;
      console.log(`Calculated balance from transactions for ${reference}: ${calculatedBalance}`);
      return calculatedBalance;
    }

    return null; // Fallback if no reference
  } catch (error) {
    console.error(`Error fetching balance for account ${accountNumber}:`, error.message);
    throw error; // Re-throw for caller to handle
  }
}

async function fetchPaystackBalance() {
  try {
    if (!process.env.PAYSTACK_SECRET_KEY) {
      throw new Error('Missing Paystack secret key');
    }

    const paystackUrl = 'https://api.paystack.co/balance';
    console.log(`Attempting to fetch Paystack balance from: ${paystackUrl}`);

    const response = await fetch(paystackUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (response.status === 404) {
      throw new Error('Paystack balance endpoint not found');
    }

    if (response.ok) {
      const { status, data } = await response.json();
      if (status && data && typeof data.balance === 'number') {
        console.log(`Fetched Paystack balance: ${data.balance} (available: ${data.available_balance})`);
        return data.balance; // Returns total balance in kobo; use data.available_balance if needed
      }
      throw new Error('Invalid response format from Paystack balance API');
    } else {
      const rawResponse = await response.text();
      console.error(`Paystack API returned ${response.status}: ${rawResponse}`);
      throw new Error(`Paystack API error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching Paystack balance:', error.message);
    throw error;
  }
}

async function updateWalletBalance(userId, balance, amount, type, reference, narration, timestamp, status = 'success') {
  const user = await User.findById(userId);
  if (!user) {
    console.error(`User not found for ID: ${userId}`);
    return;
  }

  user.wallet = user.wallet || { balance: 0, transactions: [] };
  user.wallet.balance = balance;
  if (reference) {
    user.wallet.transactions.push({
      type,
      amount,
      provider: 'paylony', // Update to dynamic provider if needed
      reference,
      status,
      details: { narration: narration || 'Balance update' },
      timestamp: new Date(timestamp),
    });
  }

  await user.save();
}

export const fetchAndUpdateWalletBalance = async (req, res) => {
  let reference = null;
  const session = await User.startSession();
  session.startTransaction();

  try {
    if (!req.user?.email) {
      throw new Error('User email not provided in request');
    }

    const user = await User.findOne({ email: req.user.email }).session(session);
    if (!user) {
      throw new Error('User not found');
    }

   
    const queryProvider = req.query.provider;
    let provider = queryProvider || (user.paylonyVirtualAccountDetails?.account_number ? 'paylony' : 'paystack');

    // Validate provider support
    if (!['paylony', 'paystack'].includes(provider)) {
      throw new Error('Unsupported provider. Use paylony or paystack.');
    }

    console.log(`Fetching balance for provider: ${provider}`);

    let balance;
    if (provider === 'paylony') {
      if (!user.paylonyVirtualAccountDetails?.account_number) {
        throw new Error('No Paylony account number found for user');
      }

      // Find pending transaction for reference
      const pendingTransaction = user.wallet?.transactions
        ?.filter((tx) => tx.provider === 'paylony' && tx.status === 'pending')
        ?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

      reference = pendingTransaction?.reference || `paylony_balance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      try {
        balance = await fetchCustomerBalance(user.paylonyVirtualAccountDetails.account_number, pendingTransaction?.reference || null);
      } catch (paylonyError) {
        console.warn(`Paylony API failed: ${paylonyError.message}. Using fallback balance.`);
        balance = user.wallet.balance || 0; // Fallback to stored balance
      }
    } else if (provider === 'paystack') {
      if (!user.paystackVirtualAccountDetails?.customer_code) { // Assume customer_code field; adjust if different
        throw new Error('No Paystack customer code found for user');
      }

      reference = `paystack_balance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      try {
        balance = await fetchPaystackBalance();
      } catch (paystackError) {
        console.warn(`Paystack API failed: ${paystackError.message}. Using fallback balance.`);
        balance = user.wallet.balance || 0; // Fallback to stored balance
      }
    }

    user.wallet = user.wallet || { balance: 0, transactions: [] };
    const previousBalance = user.wallet.balance;
    const amountChanged = balance - previousBalance;

    // Log balance check as a transaction
    await updateWalletBalance(
      user._id,
      balance,
      amountChanged,
      'balance_check',
      reference,
      `${provider.toUpperCase()} balance check`,
      Date.now(),
      'success'
    );

    // Update pending transaction status if applicable
    if (reference.startsWith('paylony_') || reference.startsWith('paystack_')) {
      const transaction = user.wallet.transactions.find((tx) => tx.reference === reference && tx.status === 'pending');
      if (transaction) {
        transaction.status = 'success';
        await user.save({ session });
      }
    }

    await session.commitTransaction();
    console.log(`Wallet balance updated for ${provider} (${reference}): from ${previousBalance} to ${balance}`);
    res.json({ 
      success: true, 
      balance, 
      provider,
      previousBalance,
      amountChanged 
    });
  } catch (error) {
    await session.abortTransaction();
    console.error(`Error fetching ${provider || 'unknown'} balance (${reference || 'no reference'}):`, error.message);

    // Specific status for common errors
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes('Unsupported provider')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch balance' });
    }
  } finally {
    session.endSession();
  }
};


// async function fetchCustomerBalance(accountNumber, reference = null) {
//   try {
//     if (!process.env.PAYLONY_API_URL || !process.env.PAYLONY_SECRET_KEY) {
//       throw new Error('Missing Paylony API configuration');
//     }

//     const baseUrl = process.env.PAYLONY_API_URL.replace(/[;\s/]+$/, '');
//     console.log(`Sanitized PAYLONY_API_URL: ${baseUrl}`);

//     const balanceUrl = `${baseUrl}/accounts/${accountNumber}/balance`;
//     console.log(`Attempting to fetch Paylony balance from: ${balanceUrl}`);

//     try {
//       new URL(balanceUrl);
//     } catch (urlError) {
//       throw new Error(`Invalid Paylony API URL: ${balanceUrl}`);
//     }

//     const balanceResponse = await fetch(balanceUrl, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${process.env.PAYLONY_SECRET_KEY}`,
//         'Content-Type': 'application/json',
//       },
//       signal: AbortSignal.timeout(5000),
//     });

//     if (balanceResponse.status === 404) {
//       console.warn(`Paylony account ${accountNumber} not found`);
//       return null;
//     }

//     if (balanceResponse.ok) {
//       const { success, data } = await balanceResponse.json();
//       console.log(`Paylony balance response:`, { success, data });
//       if (success && data && typeof data.balance === 'number') {
//         console.log(`Fetched Paylony balance for account ${accountNumber}: ${data.balance} kobo`);
//         return data.balance; // In kobo
//       }
//       throw new Error('Invalid response format from Paylony balance API');
//     } else {
//       const rawResponse = await balanceResponse.text();
//       console.error(`Paylony balance API returned ${balanceResponse.status} for account ${accountNumber}: ${rawResponse}`);
//       return null;
//     }
//   } catch (error) {
//     console.error(`Error fetching Paylony balance for account ${accountNumber}:`, error.message);
//     return null;
//   }
// }

// async function fetchPaystackBalance(customerCode = null) {
//   try {
//     if (!process.env.PAYSTACK_SECRET_KEY) {
//       throw new Error('Missing Paystack secret key');
//     }

//     const paystackUrl = customerCode
//       ? `https://api.paystack.co/customer/${customerCode}`
//       : 'https://api.paystack.co/balance';
//     console.log(`Attempting to fetch Paystack balance from: ${paystackUrl}`);

//     const response = await fetch(paystackUrl, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//         'Content-Type': 'application/json',
//       },
//       signal: AbortSignal.timeout(5000),
//     });

//     if (response.status === 404) {
//       console.warn(`Paystack balance endpoint not found for ${customerCode ? `customer ${customerCode}` : 'account'}`);
//       return null;
//     }

//     if (response.ok) {
//       const { status, data } = await response.json();
//       console.log(`Paystack balance response:`, { status, data });
//       const balance = customerCode ? data.balance : data[0]?.balance; // Adjust based on endpoint
//       if (typeof balance === 'number') {
//         console.log(`Fetched Paystack balance: ${balance} kobo`);
//         return balance; // In kobo
//       }
//       throw new Error('Invalid response format from Paystack balance API');
//     } else {
//       const rawResponse = await response.text();
//       console.error(`Paystack API returned ${response.status}: ${rawResponse}`);
//       return null;
//     }
//   } catch (error) {
//     console.error(`Error fetching Paystack balance:`, error.message);
//     return null;
//   }
// }

// async function updateWalletBalance(userId, balances, amount, type, reference, narration, timestamp, provider, status = 'success') {
//   const user = await User.findById(userId);
//   if (!user) {
//     console.error(`User not found for ID: ${userId}`);
//     return null;
//   }

//   user.wallet = user.wallet || { balance: 0, paylonyBalance: null, paystackBalance: null, transactions: [] };
//   if (!Array.isArray(user.wallet.transactions)) {
//     console.warn(`user.wallet.transactions is not an array for user ${userId}, resetting to []`);
//     user.wallet.transactions = [];
//   }

//   user.wallet.paylonyBalance = balances.paylony !== null ? balances.paylony : user.wallet.paylonyBalance || 0;
//   user.wallet.paystackBalance = balances.paystack !== null ? balances.paystack : user.wallet.paystackBalance || 0;
//   user.wallet.balance = (user.wallet.paylonyBalance || 0) + (user.wallet.paystackBalance || 0);

//   if (reference) {
//     user.wallet.transactions.push({
//       type,
//       amount,
//       provider,
//       reference,
//       status,
//       details: { narration: narration || `${provider.toUpperCase()} balance update` },
//       timestamp: new Date(timestamp),
//     });
//   }

//   await user.save();
//   console.log(`Updated wallet for user ${userId}:`, {
//     paylonyBalance: user.wallet.paylonyBalance,
//     paystackBalance: user.wallet.paystackBalance,
//     totalBalance: user.wallet.balance,
//     transactionCount: user.wallet.transactions.length,
//   });
//   return user;
// }

// export const fetchAndUpdateWalletBalance = async (req, res) => {
//   const reference = `balance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//   const session = await User.startSession();
//   session.startTransaction();

//   try {
//     if (!req.user?.email) {
//       throw new Error('User email not provided in request');
//     }

//     const user = await User.findOne({ email: req.user.email }).session(session);
//     if (!user) {
//       throw new Error('User not found');
//     }

//     const balances = { paylony: null, paystack: null };

//     // Fetch Paylony balance
//     if (user.paylonyVirtualAccountDetails?.account_number) {
//       console.log(`Fetching Paylony balance for account: ${user.paylonyVirtualAccountDetails.account_number}`);
//       const pendingTransaction = user.wallet?.transactions
//         ?.filter((tx) => tx.provider === 'paylony' && tx.status === 'pending')
//         ?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

//       balances.paylony = await fetchCustomerBalance(
//         user.paylonyVirtualAccountDetails.account_number,
//         pendingTransaction?.reference || null
//       );
//       console.log(`Paylony balance result: ${balances.paylony !== null ? balances.paylony + ' kobo' : 'null (failed)'}`);
//     } else {
//       console.warn('No Paylony account number found for user');
//     }

//     // Fetch Paystack balance
//     if (user.paystackVirtualAccountDetails?.customer_code) {
//       console.log(`Fetching Paystack balance for customer: ${user.paystackVirtualAccountDetails.customer_code}`);
//       balances.paystack = await fetchPaystackBalance(user.paystackVirtualAccountDetails.customer_code);
//       console.log(`Paystack balance result: ${balances.paystack !== null ? balances.paystack + ' kobo' : 'null (failed)'}`);
//     } else {
//       console.warn('No Paystack customer code found, attempting general balance fetch');
//       balances.paystack = await fetchPaystackBalance(null);
//     }

//     if (balances.paylony === null && balances.paystack === null) {
//       console.warn('Both Paylony and Paystack balance fetches failed. Using stored balances.');
//       balances.paylony = user.wallet?.paylonyBalance || 0;
//       balances.paystack = user.wallet?.paystackBalance || 0;
//     }

//     const totalBalance = (balances.paylony || 0) + (balances.paystack || 0);
//     const previousBalance = user.wallet?.balance || 0;
//     const amountChanged = totalBalance - previousBalance;

//     const updatedUser = await updateWalletBalance(
//       user._id,
//       balances,
//       amountChanged,
//       'balance_check',
//       reference,
//       'Paylony and Paystack balance check',
//       Date.now(),
//       'paylony_paystack',
//       'success'
//     );

//     if (!updatedUser) {
//       throw new Error('Failed to update wallet balance');
//     }

//     await session.commitTransaction();
//     console.log(`Wallet balance updated for user ${user._id}:`, {
//       paylonyBalance: balances.paylony,
//       paystackBalance: balances.paystack,
//       totalBalance,
//       previousBalance,
//       amountChanged,
//     });

//     res.json({
//       success: true,
//       data: {
//         user: {
//           ...updatedUser.toObject(),
//           wallet: {
//             ...updatedUser.wallet,
//             balance: totalBalance,
//             paylonyBalance: balances.paylony,
//             paystackBalance: balances.paystack,
//           },
//         },
//         balances: {
//           paylony: balances.paylony !== null ? balances.paylony / 100 : null,
//           paystack: balances.paystack !== null ? balances.paystack / 100 : null,
//           total: totalBalance / 100,
//         },
//       },
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     console.error(`Error fetching balances (${reference}):`, error.message);
//     res.status(error.message.includes('not found') ? 404 : 500).json({ error: error.message || 'Failed to fetch balances' });
//   } finally {
//     session.endSession();
//   }
// };




export const checkBalancePaystack = async (req, res) => {
  const provider = 'paystack';
 console.log({ provider }, 'Provider used');

  if (provider !== 'paystack') {
   console.log('Provider is not Paystack');
    return res.status(400).json({ error: 'Unsupported provider' });
  }

  if (!process.env.PAYSTACK_API_URL || !process.env.PAYSTACK_SECRET_KEY) {
    return res.status(500).json({ error: 'Missing Paystack API configuration' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  let reference = null;
  try {
    if (!req.user?.email) {
      throw new Error('Unauthorized: No user authenticated');
    }
    const user = await User.findOne({ email: req.user.email }).session(session);
    if (!user) throw new Error('User not found');
    if (!user.virtualAccountDetails?.account_number) {
      throw new Error('User virtual account details not found');
    }

    reference = `bal_check_${user._id}_${uuidv4()}`;
   console.log({ reference }, 'Generated reference for balance check');

    const balance = await fetchCustomerBalancePaystack(user.virtualAccountDetails.account_number, reference, user.paystackCustomerId);
    if (balance !== null) {
      user.wallet = user.wallet || { balance: 0, transactions: [] };
      const previousBalance = user.wallet.balance;
      const amountChanged = balance - previousBalance;
      if (amountChanged !== 0) {
        await updateWalletBalancePaystack(
          user._id,
          balance,
          Math.abs(amountChanged),
          amountChanged > 0 ? 'credit' : 'debit',
          reference,
          'Balance update from Paystack',
          Date.now()
        );
      } else {
        user.wallet.balance = balance;
        user.wallet.transactions.push({
          type: 'balance_check',
          amount: 0,
          provider: 'paystack',
          reference,
          status: 'success',
          details: 'Balance check from Paystack',
          timestamp: new Date(),
        });
        await user.save({ session });
      }
      await session.commitTransaction();
    console.log(`Wallet balance updated for ${provider} (${reference}): from ${previousBalance} to ${balance}`);
      res.json({
        status: true,
        message: 'Balance retrieved successfully',
        data: {
          user_id: user._id,
          dva_account_number: user.virtualAccountDetails.account_number,
          balance: balance / 100, // Convert to NGN
          transaction_count: user.wallet.transactions.length,
          last_updated: new Date().toISOString(),
        },
      });
    } else {
      throw new Error('Failed to fetch balance');
    }
  } catch (error) {
    await session.abortTransaction();
   console.log(`Error fetching ${provider} transaction details (${reference || 'no reference'}):`, error);
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};


async function fetchCustomerBalancePaystack(accountNumber, reference, customerId) {
  try {
    const paystackUrl = `${process.env.PAYSTACK_API_URL}/transaction`;
    let totalBalance = 0;
    let page = 1;
    let hasMorePages = false;

    do {
      const response = await axios.get(paystackUrl, {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          Accept: 'application/json',
        },
        params: {
          status: 'success',
          channel: 'dedicated_nuban',
          perPage: 200,
          page,
          customer: customerId,
        },
      });

      if (response.status !== 200) {
        console.log('[fetchCustomerBalance] Paystack API call failed', {
          status: response.status,
          body: response.data,
          page,
        });
        return null;
      }

      const transactions = response.data.data || [];
      hasMorePages = transactions.length === 200;

      for (const transaction of transactions) {
        const transAccountNumber =
          transaction.metadata?.receiver_account_number ||
          transaction.authorization?.account_number ||
          null;

        if (transAccountNumber === accountNumber) {
          const amount = transaction.amount || 0;
          totalBalance += amount;
        }
      }

      page++;
    } while (hasMorePages && page <= 250);

    return totalBalance;
  } catch (error) {
   console.log('[fetchCustomerBalance] Error fetching balance', {
      error: error.message,
      accountNumber,
      reference,
    });
    return null;
  }
}


async function updateWalletBalancePaystack(userId, newBalance, amount, type, reference, details, timestamp) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(userId).session(session);
    if (!user) throw new Error('User not found');

    user.wallet = user.wallet || { balance: 0, transactions: [] };
    user.wallet.balance = newBalance;
    user.wallet.transactions.push({
      type,
      amount,
      provider: 'paystack',
      reference,
      status: 'success',
      details,
      timestamp: new Date(timestamp),
    });

    await user.save({ session });
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}












// // Paylony Functions
// export const fetchAndUpdateWalletBalance = async (req, res) => {
//   // Source provider and reference from alternative locations
//   const provider = 'paylony'; // Hardcode to 'paylony' since the code is Paylony-specific
//   const reference = `paylony_sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`; // Dynamic reference
//   console.log({ provider, reference }, "Provider and reference used");

//   // Validate provider (optional, since we're hardcoded it)
//   if (provider !== 'paylony') {
//     console.log("Provider is not Paylony");
//     return res.status(400).json({ error: 'Unsupported provider' });
//   }

//   // Validate environment variables
//   if (!process.env.PAYLONY_API_URL || !process.env.PAYLONY_SECRET_KEY) {
//     return res.status(500).json({ error: 'Missing Paylony API configuration' });
//   }

//   const session = await User.startSession();
//   session.startTransaction();
//   try {
//     const user = await User.findOne({ email: req.user?.email }).session(session);
//     if (!user) throw new Error('User not found');

//     if (!user.paylonyVirtualAccountDetails?.account_number) {
//       throw new Error('Paylony virtual account details not found');
//     }

//     const balance = await fetchCustomerBalance(user.paylonyVirtualAccountDetails.account_number, reference);
//     if (balance !== null) {
//       user.wallet = user.wallet || { balance: 0, transactions: [] };
//       const previousBalance = user.wallet.balance || 0;
//       const amountChanged = balance - previousBalance;
//       if (amountChanged !== 0 && reference) { // Only log transaction if reference is provided and balance changed
//         await updateWalletBalance(
//           user._id,
//           balance,
//           Math.abs(amountChanged),
//           amountChanged > 0 ? 'credit' : 'debit',
//           reference,
//           'Balance update from Paylony',
//           Date.now()
//         );
//       } else {
//         user.wallet.balance = balance; // Update balance without logging transaction if no reference
//         await user.save({ session });
//       }
//       await session.commitTransaction();
//       console.log(`Wallet balance updated for ${provider} (${reference || 'no reference'}): from ${previousBalance} to ${balance}`);
//       res.json({ balance: balance / 100 }); // Convert to NGN and match frontend expectation
//     } else {
//       // Fallback to current wallet balance if API fails
//       res.json({ balance: (user.wallet?.balance || 0) / 100 });
//     }
//   } catch (error) {
//     await session.abortTransaction();
//     console.error(`Error fetching ${provider} transaction details (${reference || 'no reference'}):`, error);
//     res.status(500).json({ error: error.message });
//   } finally {
//     session.endSession();
//   }
// };

// async function fetchCustomerBalance(accountNumber, reference) {
//   try {
//     if (!process.env.PAYLONY_API_URL || !process.env.PAYLONY_SECRET_KEY) {
//       throw new Error('Missing Paylony API configuration');
//     }

//     // Sanitize PAYLONY_API_URL to remove trailing slashes, semicolons, or whitespace
//     const baseUrl = process.env.PAYLONY_API_URL.replace(/[;\s/]+$/, '');
//     console.log(`Sanitized PAYLONY_API_URL: ${baseUrl}`);

//     // First, fetch all accounts to get the account ID for the given account_number
//     const accountsUrl = `${baseUrl}/fetch_all_accounts`;
//     console.log(`Fetching accounts from: ${accountsUrl}`);

//     const accountsResponse = await fetch(accountsUrl, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${process.env.PAYLONY_SECRET_KEY}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!accountsResponse.ok) {
//       console.error(`Accounts API error: ${accountsResponse.status} - ${accountsResponse.statusText}`);
//       throw new Error(`Failed to fetch accounts: ${accountsResponse.status}`);
//     }

//     const accountsData = await accountsResponse.json();
//     console.log('Paylony Accounts Response:', JSON.stringify(accountsData, null, 2));

//     const { success, data } = accountsData;
//     if (!success || !data || !data.data) {
//       throw new Error('Failed to fetch accounts or no data returned');
//     }

//     // Find the account by account_number
//     const account = data.data.find(acc => acc.account_number === accountNumber);
//     if (!account) {
//       throw new Error(`Account ${accountNumber} not found`);
//     }

//     const accountId = account.id;
//     const accountReference = account.reference; // Use the actual account reference if needed
//     console.log(`Found account ID: ${accountId} for account_number: ${accountNumber}, reference: ${accountReference}`);

//     // Try balance endpoint with account ID
//     const balanceUrl = `${baseUrl}/api/v1/accounts/${accountId}/balance`;
//     console.log(`Attempting to fetch balance from: ${balanceUrl}`);

//     const response = await fetch(balanceUrl, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${process.env.PAYLONY_SECRET_KEY}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (response.ok) {
//       const responseData = await response.json();
//       console.log('Paylony Balance Response:', JSON.stringify(responseData, null, 2));
      
//       const { success: balSuccess, data: balData } = responseData;
//       if (balSuccess && balData && (balData.balance !== undefined || balData.available_balance !== undefined)) {
//         const balance = balData.balance || balData.available_balance;
//         console.log(`Fetched balance for account ${accountNumber}: ${balance}`);
//         return balance;
//       }
//       throw new Error('Invalid response format from Paylony balance API');
//     } else if (response.status === 404) {
//       console.error(`Balance API returned 404 for account ID ${accountId}`);
//       // Try alternative balance endpoint with params
//       const altBalanceUrl = `${baseUrl}/api/v1/accounts/balance?account_id=${accountId}`;
//       console.log(`Trying alternative balance URL: ${altBalanceUrl}`);
//       const altBalanceResponse = await fetch(altBalanceUrl, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${process.env.PAYLONY_SECRET_KEY}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       if (altBalanceResponse.ok) {
//         const altBalanceData = await altBalanceResponse.json();
//         console.log('Alternative Balance Response:', JSON.stringify(altBalanceData, null, 2));
//         // Parse balance from alternative response
//         const { success: altSuccess, data: altData } = altBalanceData;
//         if (altSuccess && altData && (altData.balance !== undefined || altData.available_balance !== undefined)) {
//           const balance = altData.balance || altData.available_balance;
//           console.log(`Fetched balance from alternative endpoint for account ${accountNumber}: ${balance}`);
//           return balance;
//         }
//       }
//     } else {
//       console.error(`Balance API error: ${response.status} - ${response.statusText}`);
//       throw new Error(`Balance API error: ${response.status}`);
//     }

//     // Fallback: Fetch all transactions and filter by account_number
//     const txUrl = `${baseUrl}/api/v1/fetch_all_transactions`; // Assumed endpoint for all transactions
//     console.log(`Attempting to fetch all transactions from: ${txUrl}`);

//     const txResponse = await fetch(txUrl, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${process.env.PAYLONY_SECRET_KEY}`,
//         'Content-Type': 'application/json',
//       },
//       // Add params if supported
//       // params: { account_id: accountId, account_number: accountNumber }
//     });

//     if (!txResponse.ok) {
//       // Try with params
//       const params = new URLSearchParams({
//         account_id: accountId,
//         account_number: accountNumber
//       });
//       const paramsTxUrl = `${txUrl}?${params}`;
//       console.log(`Trying transactions with params: ${paramsTxUrl}`);
//       const paramsTxResponse = await fetch(paramsTxUrl, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${process.env.PAYLONY_SECRET_KEY}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       if (!paramsTxResponse.ok) {
//         console.error(`Transactions API error: ${paramsTxResponse.status} - ${paramsTxResponse.statusText}`);
//         throw new Error(`Transactions API error: ${paramsTxResponse.status}`);
//       }
//       txResponse = paramsTxResponse;
//     }

//     const txData = await txResponse.json();
//     console.log('Paylony Transactions Response:', JSON.stringify(txData, null, 2));
    
//     const { success: txSuccess, data: txDataArray } = txData;
//     if (!txSuccess || !txDataArray) {
//       throw new Error('Failed to fetch transaction details or no data returned');
//     }

//     // Ensure data is an array before filtering
//     const transactions = Array.isArray(txDataArray) ? txDataArray : [];
//     const relevantTransactions = transactions.filter(t => t.account_number === accountNumber || t.account_id === accountId);
//     const credits = relevantTransactions.filter(t => (t.type === 'credit' || t.credit) && t.status === 'success');
//     const totalCredit = credits.reduce((sum, t) => sum + parseFloat(t.amount || t.credit_amount || 0), 0);
//     const debits = relevantTransactions.filter(t => (t.type === 'debit' || t.debit) && t.status === 'success');
//     const totalDebit = debits.reduce((sum, t) => sum + parseFloat(t.amount || t.debit_amount || 0), 0);
//     const fees = relevantTransactions.filter(t => t.type === 'fee' || t.fee).reduce((sum, t) => sum + parseFloat(t.amount || t.fee_amount || 0), 0);
//     const calculatedBalance = totalCredit - totalDebit - fees;
//     console.log(`Calculated balance from transactions for account ${accountNumber}: ${calculatedBalance}`);
//     return calculatedBalance;
//   } catch (error) {
//     console.log(error)
//     console.error(`Error fetching balance for account ${accountNumber}:`, {
//       message: error.message,
//       stack: error.stack
//     });
//     return null;
//   }
// }

// async function updateWalletBalance(userId, balance, amount, type, reference, narration, timestamp) {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const user = await User.findById(userId).session(session);
//     if (!user) {
//       console.error(`User not found for ID: ${userId}`);
//       throw new Error('User not found');
//     }

//     user.wallet = user.wallet || { balance: 0, transactions: [] };
//     user.wallet.balance = balance;
//     user.wallet.transactions.push({
//       type,
//       amount,
//       provider: 'paylony',
//       reference,
//       status: 'success',
//       details: { narration: narration || 'Inward transfer' },
//       timestamp: new Date(timestamp),
//     });

//     await user.save({ session });
//     await session.commitTransaction();
//   } catch (error) {
//     await session.abortTransaction();
//     console.error(`Error updating wallet balance for user ${userId}:`, error);
//     throw error;
//   } finally {
//     session.endSession();
//   }
// }


// // Paystack Functions
// export const checkBalancePaystack = async (req, res) => {
//   const provider = 'paystack';
//   console.log({ provider }, 'Provider used');

//   if (provider !== 'paystack') {
//     console.log('Provider is not Paystack');
//     return res.status(400).json({ error: 'Unsupported provider' });
//   }

//   if (!process.env.PAYSTACK_API_URL || !process.env.PAYSTACK_SECRET_KEY) {
//     return res.status(500).json({ error: 'Missing Paystack API configuration' });
//   }

//   const session = await mongoose.startSession();
//   session.startTransaction();
//   let reference = null;
//   try {
//     if (!req.user?.email) {
//       throw new Error('Unauthorized: No user authenticated');
//     }
//     const user = await User.findOne({ email: req.user.email }).session(session);
//     if (!user) throw new Error('User not found');
//     if (!user.virtualAccountDetails?.account_number) {
//       throw new Error('User virtual account details not found');
//     }
//     if (!user.paystackCustomerId) {
//       throw new Error('Paystack customer ID not found');
//     }

//     reference = `bal_check_${user._id}_${uuidv4()}`;
//     console.log({ reference }, 'Generated reference for balance check');

//     const balance = await fetchCustomerBalancePaystack(
//       user.virtualAccountDetails.account_number, 
//       reference, 
//       user.paystackCustomerId
//     );
    
//     if (balance !== null) {
//       user.wallet = user.wallet || { balance: 0, transactions: [] };
//       const previousBalance = user.wallet.balance || 0;
//       const amountChanged = balance - previousBalance;
//       if (amountChanged !== 0) {
//         await updateWalletBalancePaystack(
//           user._id,
//           balance,
//           Math.abs(amountChanged),
//           amountChanged > 0 ? 'credit' : 'debit',
//           reference,
//           'Balance update from Paystack',
//           Date.now()
//         );
//       } else {
//         user.wallet.balance = balance;
//         user.wallet.transactions.push({
//           type: 'balance_check',
//           amount: 0,
//           provider: 'paystack',
//           reference,
//           status: 'success',
//           details: 'Balance check from Paystack',
//           timestamp: new Date(),
//         });
//         await user.save({ session });
//       }
//       await session.commitTransaction();
//       console.log(`Wallet balance updated for ${provider} (${reference}): from ${previousBalance} to ${balance}`);
//       res.json({
//         status: true,
//         message: 'Balance retrieved successfully',
//         data: {
//           user_id: user._id,
//           dva_account_number: user.virtualAccountDetails.account_number,
//           balance: balance / 100, // Convert to NGN
//           transaction_count: user.wallet.transactions.length,
//           last_updated: new Date().toISOString(),
//         },
//       });
//     } else {
//       throw new Error('Failed to fetch balance from Paystack');
//     }
//   } catch (error) {
//     await session.abortTransaction();
//     console.log(`Error fetching ${provider} transaction details (${reference || 'no reference'}):`, {
//       error: error.message,
//       stack: error.stack
//     });
//     res.status(500).json({ error: error.message });
//   } finally {
//     session.endSession();
//   }
// };

// async function fetchCustomerBalancePaystack(accountNumber, reference, customerId) {
//   try {
//     const paystackUrl = `${process.env.PAYSTACK_API_URL}/transaction`;
//     let totalBalance = 0;
//     let page = 1;
//     let hasMorePages = false;
//     let processedTransactions = 0;

//     do {
//       const response = await axios.get(paystackUrl, {
//         headers: {
//           Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//           Accept: 'application/json',
//         },
//         params: {
//           status: 'success',
//           channel: 'dedicated_nuban',
//           perPage: 200,
//           page,
//           customer: customerId,
//         },
//       });

//       console.log(`Paystack API Response for page ${page}:`, {
//         status: response.status,
//         hasData: !!response.data?.data,
//         dataType: typeof response.data?.data,
//         dataLength: Array.isArray(response.data?.data) ? response.data.data.length : 'N/A'
//       });

//       if (response.status !== 200 || !response.data?.status) {
//         console.log('[fetchCustomerBalancePaystack] Paystack API call failed', {
//           status: response.status,
//           body: response.data,
//           page,
//           customerId,
//         });
//         return null;
//       }

//       // Ensure transactions is always an array
//       const transactions = Array.isArray(response.data.data) ? response.data.data : [];
//       hasMorePages = transactions.length === 200;
//       processedTransactions += transactions.length;

//       console.log(`[fetchCustomerBalancePaystack] Processing page ${page}`, {
//         transactionCount: transactions.length,
//         totalProcessed: processedTransactions,
//         accountNumber,
//         customerId,
//       });

//       for (const transaction of transactions) {
//         if (!transaction || typeof transaction !== 'object') {
//           console.log('Skipping invalid transaction:', transaction);
//           continue;
//         }
        
//         const transAccountNumber =
//           transaction.metadata?.receiver_account_number ||
//           transaction.authorization?.account_number ||
//           null;

//         if (transAccountNumber === accountNumber) {
//           const amount = transaction.amount || 0;
//           totalBalance += amount;
//           console.log('[fetchCustomerBalancePaystack] Transaction matched', {
//             reference: transaction.reference || 'N/A',
//             amount_kobo: amount,
//             amount_ngn: amount / 100,
//             running_total_kobo: totalBalance,
//           });
//         }
//       }

//       page++;
//     } while (hasMorePages && page <= 250);

//     console.log(`[fetchCustomerBalancePaystack] Completed - Total balance: ${totalBalance} kobo`);
//     return totalBalance;
//   } catch (error) {
//     console.log('[fetchCustomerBalancePaystack] Error fetching balance', {
//       error: error.message,
//       stack: error.stack,
//       accountNumber,
//       reference,
//       customerId,
//     });
//     return null;
//   }
// }

// async function updateWalletBalancePaystack(userId, newBalance, amount, type, reference, details, timestamp) {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const user = await User.findById(userId).session(session);
//     if (!user) throw new Error('User not found');

//     user.wallet = user.wallet || { balance: 0, transactions: [] };
//     user.wallet.balance = newBalance;
//     user.wallet.transactions.push({
//       type,
//       amount,
//       provider: 'paystack',
//       reference,
//       status: 'success',
//       details,
//       timestamp: new Date(timestamp),
//     });

//     await user.save({ session });
//     await session.commitTransaction();
//   } catch (error) {
//     await session.abortTransaction();
//     console.error(`Error in updateWalletBalancePaystack:`, error);
//     throw error;
//   } finally {
//     session.endSession();
//   }
// }






