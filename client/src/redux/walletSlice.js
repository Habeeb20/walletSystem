import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../component/utils/axiosInstance';

export const fetchWalletBalance = createAsyncThunk(
  'wallet/fetchWalletBalance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/wallet/wallet-balance');
      return response.data.balance;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch wallet balance');
    }
  }
);

export const rechargeAirtime = createAsyncThunk(
  'wallet/rechargeAirtime',
  async ({ network, amount, phone }, { rejectWithValue }) => {
    try {
      const response = await api.post('/airtime/buy-airtime', { network, amount, phone });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Recharge failed');
    }
  }
);

export const transferFunds = createAsyncThunk('auth/transferFunds', async ({ recipient, amount }, { rejectWithValue }) => {
  try {
    const response = await api.post('/wallet/transfer', { recipient, amount });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Transfer failed');
  }
});

export const checkWalletBalance = createAsyncThunk(
  'wallet/checkWalletBalance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/wallet/check-balance');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to check wallet balance');
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    loading: false,
    error: null,
    walletBalance: 0,
    checkBalanceData: null,
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
      })
      .addCase(checkWalletBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkWalletBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.walletBalance = action.payload.balance;
        state.checkBalanceData = action.payload;
      })
      .addCase(checkWalletBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default walletSlice.reducer;
