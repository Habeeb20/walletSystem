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
        {
          provider: network,
          amount: amount.toString(),
          number: phone,
          country: 'NG',
          promo: '0',
        },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to purchase airtime');
    }
  }
);

export const buyDataPin = createAsyncThunk(
  'wallet/buyDataPin',
  async ({ network, amount, phone, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/wallet/buy-data-pin`,
        {
          provider: network,
          amount: amount.toString(),
          number: phone,
          country: 'NG',
          promo: '0',
        },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to purchase data pin');
    }
  }
);

export const buyData = createAsyncThunk(
  'wallet/buyData',
  async ({ coded, phone, amount, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/wallet/buy-data`,
        {
          coded,
          number: phone,
          country: 'NG',
          promo: '0',
          reseller_price: amount.toString(),
        },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to purchase data');
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    loading: false,
    error: null,
    walletBalance: 0,
    transactions: [],
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
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
        state.transactions.push({
          type: 'airtime',
          reference: action.payload.reference,
          amount: parseFloat(action.meta.arg.amount),
          provider: action.meta.arg.network,
          number: action.meta.arg.phone,
          status: 'success',
          timestamp: new Date(),
        });
      })
      .addCase(rechargeAirtime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(buyDataPin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(buyDataPin.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.push({
          type: 'data_pin',
          reference: action.payload.reference,
          amount: parseFloat(action.meta.arg.amount),
          provider: action.meta.arg.network,
          number: action.meta.arg.phone,
          status: 'success',
          timestamp: new Date(),
        });
      })
      .addCase(buyDataPin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(buyData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(buyData.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.push({
          type: 'data',
          reference: action.payload.reference,
          amount: parseFloat(action.meta.arg.amount),
          coded: action.meta.arg.coded,
          number: action.meta.arg.phone,
          status: 'success',
          timestamp: new Date(),
        });
      })
      .addCase(buyData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = walletSlice.actions;
export default walletSlice.reducer;