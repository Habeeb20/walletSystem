import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchWalletBalance = createAsyncThunk(
  'wallet/fetchWalletBalance',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/wallet/wallet-balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.balance;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch wallet balance');
    }
  }
);

export const rechargeAirtime = createAsyncThunk(
  'wallet/rechargeAirtime',
  async ({ network, amount, phone, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/wallet/buy-airtime`,
        { network, amount, phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Recharge failed');
    }
  }
);


export const transferFunds = createAsyncThunk('auth/transferFunds', async ({ recipient, amount }, { rejectWithValue }) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/wallet/transfer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ recipient, amount }),
  });
  if (!response.ok) {
    const error = await response.json();
    return rejectWithValue(error.message);
  }
  const data = await response.json();
  return data;
});


const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    loading: false,
    error: null,
    walletBalance: 0,
    token: localStorage.getItem('token'),
  },
  reducers: {
    updateWalletBalance(state, action) {
      state.walletBalance = action.payload.amount;
    },
    },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWalletBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.walletBalance = action.payload;
      })
      .addCase(fetchWalletBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(rechargeAirtime.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rechargeAirtime.fulfilled, (state, action) => {
        state.loading = false;
        state.walletBalance = action.payload.balance; // Update with new balance
      })
      .addCase(rechargeAirtime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(transferFunds.pending, (state) => {
        state.loading = true;
      })
      .addCase(transferFunds.fulfilled, (state, action) => {
        state.loading = false;
        if (state.dashboardData) {
          state.dashboardData.user.balance -= parseFloat(action.meta.arg.amount);
        }
      })
      .addCase(transferFunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default walletSlice.reducer;










































