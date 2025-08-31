import Paystack from 'paystack-api';
import pRetry from 'p-retry';
import axios from "axios"
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

// export const createVirtualAccount = async (customerCode, email, preferredBank = 'wema-bank') => {
//   try {
//     if (!customerCode || !email) {
//       throw new Error('Customer code and email are required');
//     }

//     const response = await pRetry(
//       () => paystack.dedicatedAccount?.create({
//         customer: customerCode,
//         preferred_bank: preferredBank,
//         email,
//       }),
//       { retries: 3, minTimeout: 1000 }
//     );
//     console.log('Virtual account created:', response.data);
//     return response.data;
//   } catch (error) {
//     const message = error.response?.data?.message || error.message;
//     console.error('Virtual account creation error:', error.response?.data || error);
//     throw new Error(`Virtual account creation failed: ${message}`);
//   }
// };

export const createVirtualAccount = async (customerCode, email, preferredBank = 'wema-bank') => {
  try {
    if (!customerCode || !email) {
      throw new Error('Customer code and email are required');
    }

    let response;
    try {
      response = await pRetry(
        () =>
          paystack.dedicatedAccount.create({
            customer: customerCode,
            preferred_bank: preferredBank,
            email,
          }),
        { retries: 3, minTimeout: 1000 }
      );
    } catch (sdkError) {
      console.warn('SDK method failed, falling back to HTTP request:', sdkError.message);

      // Fallback to direct HTTP request
      response = await pRetry(
        () =>
          axios.post(
            'https://api.paystack.co/dedicated_account',
            {
              customer: customerCode,
              preferred_bank: preferredBank,
              email,
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
              },
            }
          ),
        { retries: 3, minTimeout: 1000 }
      );
      response = response.data;
    }

    if (!response.status) {
      throw new Error(response.message || 'Virtual account creation failed');
    }

    console.log('Virtual account created:', response.data || response);
    return response.data || response;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    console.error('Virtual account creation error:', error.response?.data || error);
    if (error.response?.data?.code === 'feature_unavailable') {
      throw new Error(
        `Virtual account creation failed: ${message}. Please contact support@paystack.com to enable this feature.`
      );
    }
    throw new Error(`Virtual account creation failed: ${message}`);
  }
};


export const payBill = async (billType, provider, phone, amount) => {
  try {
    const response = await pRetry(
      () => paystack.bulkCharge.create({
        billType, // e.g., 'airtime', 'data', 'electricity'
        provider, // e.g., 'mtn', 'glo'
        phone,
        amount: amount * 100,
      }),
    { retries: 3, minTimeout: 1000 }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Bill payment failed: ${error.message}`);
  }
};





export const createPaylonyVirtualAccount = async (email, dob, address, gender, firstname, lastname, phone, paylonySecretKey) => {
  try {
    const payload = {
      email,
      dob,
      address,
      gender,
      firstname,
      lastname,
      phone,
    };

    const response = await pRetry(
      () =>
        axios.post(
          'https://api.paylony.com/api/v1/create_account', 
          payload,
          {
            headers: {
              Authorization: `Bearer ${paylonySecretKey}`,
              'Content-Type': 'application/json',
            },
          }
        ),
      { retries: 3, minTimeout: 1000 }
    );

    const data = response.data;
    if (data.status !== '00') {
      throw new Error(data.message || 'Failed to create Paylony virtual account');
    }

    return {
      account_number: data.receiving_account || 'N/A',
      account_name: data.sender_account_name || 'N/A',
      bank: data.gateway || 'N/A',
    };
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    console.error('Paylony virtual account creation error:', error.response?.data || error);
    throw new Error(`Paylony virtual account creation failed: ${message}`);
  }
};
