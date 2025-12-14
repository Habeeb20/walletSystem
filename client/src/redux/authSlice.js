




/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Registration failed');
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const loginUser = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Login failed');
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const verifyEmail = createAsyncThunk('auth/verifyemail', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/verifyemail`, userData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Verification failed');
  }
});

export const fetchDashboard = createAsyncThunk('auth/fetchDashboard', async (token, { rejectWithValue, dispatch }) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data.data;

    if (data?.user?.wallet?.transactions) {
      for (const transaction of data.user.wallet.transactions) {
        if (transaction.status === 'pending' && transaction.provider === 'paystack') {
          try {
            const paymentResponse = await axios.get(
              `https://api.paystack.co/transaction/verify/${transaction.reference}`,
              { headers: { Authorization: `Bearer ${import.meta.env.VITE_PAYSTACK_SECRET_KEY}` } }
            );
            if (paymentResponse.data.status === 'success') {
              await axios.post(`${import.meta.env.VITE_BACKEND_URL}/wallet/callback?reference=${transaction.reference}`);
              const refreshedResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/dashboard`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              return refreshedResponse.data.data;
            }
          } catch (verifyError) {
            console.error(`Paystack verification failed for reference ${transaction.reference}:`, verifyError);
          }
        } else if (transaction.status === 'pending' && transaction.provider === 'paylony') {
          await axios.get(`${import.meta.env.VITE_BACKEND_URL}/wallet/fetch-and-update-balance/${transaction.reference}/paylony`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const refreshedResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/dashboard`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return refreshedResponse.data.data;
        }
      }
    }

    const paylonyResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/wallet/fetch-paylony-accounts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (paylonyResponse.data.success && paylonyResponse.data.wallet) {
      data.user.wallet = paylonyResponse.data.wallet;
    }

    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard data');
  }
});

export const fetchCustomerDetails = createAsyncThunk('auth/fetchCustomerDetails', async (_, { getState, rejectWithValue }) => {
  const { auth } = getState();
  const token = auth.token || localStorage.getItem('token');
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/customer`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer details');
  }
});

export const createVirtualAccount = createAsyncThunk('auth/createVirtualAccount', async ({ token, customerId }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/create-virtual-account`, { customerId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create virtual account');
  }
});

export const createPaylonyVirtualAccount = createAsyncThunk(
  'auth/createPaylonyVirtualAccount',
  async ({ token, customerId, firstname, lastname, address, gender, email, phone, dob }, { rejectWithValue }) => {
    try {
      // console.log('Calling Backend to Create Paylony Account with Token:', token);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/create-paylony-virtual-account`,
        { customerId, firstname, lastname, address, gender, email, phone, dob },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      console.log('Backend Response for Paylony Creation:', response.data);
      return response.data.virtual_account;
    } catch (error) {
      console.error('Paylony Creation Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || 'Failed to create Paylony virtual account');
    }
  }
);

export const fetchPaylonyAccounts = createAsyncThunk('auth/fetchPaylonyAccounts', async (token, { rejectWithValue }) => {
  try {
    // console.log('Fetching Paylony Accounts with Token:', token);
    const response = await axios.get('https://api.paylony.com/api/v1/fetch_all_accounts', {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_PAYLONY_SECRET_KEY}`, 'Content-Type': 'application/json' },
    });
    console.log('Paylony Accounts Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Paylony Accounts Fetch Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch Paylony accounts');
  }
});

export const checkVirtualAccount = createAsyncThunk('auth/checkVirtualAccount', async (token, { getState, rejectWithValue }) => {
  const { auth } = getState();
  const effectiveToken = token || auth.token || localStorage.getItem('token');
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/check-virtual-account`, {
      headers: { Authorization: `Bearer ${effectiveToken}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to check virtual account');
  }
});

export const fundWallet = createAsyncThunk('auth/fundWallet', async ({ token, amount }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/wallet/fund-wallet`, { amount }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fund wallet');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loading: false,
    token: null,
    error: null,
    dashboardData: null,
    customerDetails: null,
    virtualAccountCompleted: false,
    paylonyAccounts: [],
    walletBalance: 0, // Added to track balance explicitly
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.dashboardData = null;
      state.error = null;
      state.customerDetails = null;
      state.virtualAccountCompleted = false;
      state.walletBalance = 0;
      localStorage.removeItem('token');
    },
    updateWalletBalance: (state, action) => {
      state.walletBalance += action.payload.amount || 0;
      if (state.dashboardData?.user?.wallet) {
        state.dashboardData.user.wallet.balance = state.walletBalance;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;

      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;

      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
        if (action.payload?.user?.wallet?.balance) {
          state.walletBalance = action.payload.user.wallet.balance;
        }
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCustomerDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.customerDetails = action.payload.data || {};
      })
      .addCase(fetchCustomerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createVirtualAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVirtualAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.customerDetails = { ...state.customerDetails, ...action.payload };
      })
      .addCase(createVirtualAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPaylonyVirtualAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaylonyVirtualAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.customerDetails = {
          ...state.customerDetails,
          paylonyVirtualAccountDetails: action.payload.data || action.payload,
        };
        state.virtualAccountCompleted = true;
      })
      .addCase(createPaylonyVirtualAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPaylonyAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaylonyAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.paylonyAccounts = action.payload.data || [];
      })
      .addCase(fetchPaylonyAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkVirtualAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkVirtualAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.virtualAccountCompleted = action.payload.exists;
        if (action.payload.virtualAccountDetails) {
          state.customerDetails = {
            ...state.customerDetails,
            virtualAccountDetails: action.payload.virtualAccountDetails,
          };
        }
      })
      .addCase(checkVirtualAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fundWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fundWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.walletBalance += action.payload.amount || 0;
        if (state.dashboardData?.user?.wallet) {
          state.dashboardData.user.wallet.balance = state.walletBalance;
        }
      })
      .addCase(fundWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, updateWalletBalance } = authSlice.actions;
export default authSlice.reducer;