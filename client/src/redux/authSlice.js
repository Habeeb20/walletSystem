/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../component/utils/axiosInstance';

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Registration failed');
  }
});

export const loginUser = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/login', userData);
    // The backend sets an httpOnly auth cookie on success — nothing to store client-side.
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Login failed');
  }
});

export const verifyEmail = createAsyncThunk('auth/verifyemail', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/verifyemail', userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Verification failed');
  }
});

// NOTE: this used to also poll Paystack/Paylony directly from the browser using
// VITE_PAYSTACK_SECRET_KEY / VITE_PAYLONY_SECRET_KEY — those are SECRET keys and must
// never ship in frontend code (anyone can read them from the built JS bundle). That
// verification-and-refresh logic needs to move to a backend endpoint (e.g. your existing
// /wallet/callback and /wallet/fetch-and-update-balance routes already do this server-side —
// this thunk now just calls the dashboard endpoint and trusts the backend to have already
// reconciled pending transactions).
export const fetchDashboard = createAsyncThunk('auth/fetchDashboard', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/auth/dashboard');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard data');
  }
});

export const fetchCustomerDetails = createAsyncThunk('auth/fetchCustomerDetails', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/auth/customer');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer details');
  }
});

export const createVirtualAccount = createAsyncThunk('auth/createVirtualAccount', async ({ customerId }, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/create-virtual-account', { customerId });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create virtual account');
  }
});

export const createPaylonyVirtualAccount = createAsyncThunk(
  'auth/createPaylonyVirtualAccount',
  async ({ customerId, firstname, lastname, address, gender, email, phone, dob }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/create-paylony-virtual-account', {
        customerId, firstname, lastname, address, gender, email, phone, dob,
      });
      return response.data.virtual_account;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create Paylony virtual account');
    }
  }
);

// REMOVED: this thunk previously called https://api.paylony.com directly from the browser
// using VITE_PAYLONY_SECRET_KEY, exposing your Paylony secret key to every visitor.
// Add a backend route (e.g. GET /api/auth/paylony-accounts) that makes this call
// server-side with the key from your backend .env, then point this thunk at that route:
//
// export const fetchPaylonyAccounts = createAsyncThunk('auth/fetchPaylonyAccounts', async (_, { rejectWithValue }) => {
//   try {
//     const response = await api.get('/auth/paylony-accounts');
//     return response.data;
//   } catch (error) {
//     return rejectWithValue(error.response?.data?.message || 'Failed to fetch Paylony accounts');
//   }
// });

export const checkVirtualAccount = createAsyncThunk('auth/checkVirtualAccount', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/auth/check-virtual-account');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to check virtual account');
  }
});

export const fundWallet = createAsyncThunk('auth/fundWallet', async ({ amount }, { rejectWithValue }) => {
  try {
    const response = await api.post('/wallet/fund-wallet', { amount });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fund wallet');
  }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await api.post('/auth/logout');
    return true;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Logout failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loading: false,
    isAuthenticated: false,
    error: null,
    dashboardData: null,
    customerDetails: null,
    virtualAccountCompleted: false,
    paylonyAccounts: [],
    walletBalance: 0,
  },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.dashboardData = null;
      state.error = null;
      state.customerDetails = null;
      state.virtualAccountCompleted = false;
      state.walletBalance = 0;
      // No localStorage to clear — call the logoutUser thunk to clear the httpOnly cookie server-side.
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
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
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
        state.isAuthenticated = true;
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
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.dashboardData = null;
        state.customerDetails = null;
        state.virtualAccountCompleted = false;
        state.walletBalance = 0;
      });
  },
});

export const { logout, updateWalletBalance } = authSlice.actions;
export default authSlice.reducer;
