import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const verifyAccount = createAsyncThunk(
  'transfer/verifyAccount',
  async ({ bank_code, account_number, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/transfer/verify-account`,
        { bank_code, account_number },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error) {
        console.log(error)
      return rejectWithValue(error.response?.data?.error || 'Failed to verify account');
    }
  }
);

export const transferFunds = createAsyncThunk(
  'transfer/transferFunds',
  async ({ account_number, amount, narration, bank_code, bank_name, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/transfer/transferfunds`,
        {
          account_number,
          amount: amount.toString(),
          narration,
          bank_code,
          bank_name,
        },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to transfer funds');
    }
  }
);

const transferSlice = createSlice({
  name: 'transfer',
  initialState: {
    loading: false,
    error: null,
    transfers: [],
    verifiedAccount: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearVerifiedAccount: (state) => {
      state.verifiedAccount = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.verifiedAccount = action.payload;
      })
      .addCase(verifyAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(transferFunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(transferFunds.fulfilled, (state, action) => {
        state.loading = false;
        state.transfers.push({
          type: 'transfer',
          reference: action.payload.reference || `mcd_${Date.now()}`,
          amount: parseFloat(action.meta.arg.amount),
          account_number: action.meta.arg.account_number,
          bank_name: action.meta.arg.bank_name,
          bank_code: action.meta.arg.bank_code,
          narration: action.meta.arg.narration,
          status: 'success',
          timestamp: new Date(),
        });
        state.verifiedAccount = null;
      })
      .addCase(transferFunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearVerifiedAccount } = transferSlice.actions;
export default transferSlice.reducer;