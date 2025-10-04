import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const buyElectricity = createAsyncThunk(
  'electricity/buyElectricity',
  async ({ provider, meterNumber, amount, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/electricity/buy-electricity`, 
        {
          provider,
          number: meterNumber,
          amount: amount.toString(),
          country: 'NG',
          promo: '0',
        },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to purchase electricity');
    }
  }
);

const electricitySlice = createSlice({
  name: 'electricity',
  initialState: {
    loading: false,
    error: null,
    transactions: [],
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(buyElectricity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(buyElectricity.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.push({
          type: 'electricity',
          reference: action.payload.reference,
          amount: parseFloat(action.meta.arg.amount),
          provider: action.meta.arg.provider,
          meterNumber: action.meta.arg.meterNumber,
          status: 'success',
          timestamp: new Date(),
        });
      })
      .addCase(buyElectricity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = electricitySlice.actions;
export default electricitySlice.reducer;

































