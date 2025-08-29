import Paystack from 'paystack-api';
import pRetry from 'p-retry';

import dotenv from "dotenv"

dotenv.config()
const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

export const createCustomer = async (email, first_name, last_name, phone) => {
 try {
    // Log key for debugging (mask most of it for security)
    console.log('Using Paystack key:', process.env.PAYSTACK_SECRET_KEY.slice(0, 8) + '...');
    
    // Validate inputs
    if (!email || !first_name || !phone) {
      throw new Error('Email, first name, and phone are required');
    }

    const response = await pRetry(
      () =>
        paystack.customer.create({
          email,
          first_name,
          last_name: last_name || '',
          phone
        }),
      { retries: 3, minTimeout: 1000 }
    );
    console.log('Paystack customer created:', response.data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    console.error('Paystack error details:', error.response?.data || error);
    throw new Error(`Paystack customer creation failed: ${message}`);
  }
};





export const initializePayment = async (
  email,
  amount,
  callbackUrl,
  customer_code,
  currency = 'NGN'
) => {
  try {
    if (!email || !amount || !callbackUrl) {
      throw new Error('Email, amount, and callback URL are required');
    }
    if (!callbackUrl.startsWith('https://')) {
      throw new Error('A valid HTTPS callback URL is required');
    }
    const conversionFactor = currency === 'NGN' ? 100 : 1;
    const payload = {
      email,
      amount: amount * conversionFactor,
      callback_url: callbackUrl,
      currency,
    };
    if (customer_code) {
      payload.customer = customer_code;
    }
    const response = await pRetry(() => paystack.transaction.initialize(payload), {
      retries: 3,
      minTimeout: 1000,
    });
    return { url: response.data.authorization_url, reference: response.data.reference };
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(`Paystack initialization failed: ${message}`);
  }
};

export const verifyPayment = async (reference) => {
  try {
    if (!reference) {
      throw new Error('Reference is required');
    }
    const response = await pRetry(() => paystack.transaction.verify({ reference }), {
      retries: 3,
      minTimeout: 1000,
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(`Paystack verification failed: ${message}`);
  }
};




export const getCustomer = async (customer_code) => {
  try {
    if (!customer_code) {
      throw new Error('Customer code is required');
    }

    const response = await pRetry(
      () => paystack.customer.get({ id: customer_code }),
      { retries: 3, minTimeout: 1000 }
    );
    console.log('Paystack customer fetched:', response.data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    console.error('Paystack fetch customer error:', error.response?.data || error);
    throw new Error(`Failed to fetch Paystack customer: ${message}`);
  }
};