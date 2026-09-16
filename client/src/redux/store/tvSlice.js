import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../component/utils/axiosInstance';

export const buyTvSubscription = createAsyncThunk(
  'tvSubscription/buyTvSubscription',
  async ({ coded, number, price }, { rejectWithValue }) => {
    try {
      const response = await api.post('/tv/buy-tv-subscription', {
        coded,
        number,
        reseller_price: price.toString(),
        country: 'NG',
        promo: '0',
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to purchase TV subscription');
    }
  }
);

const tvSubscriptionSlice = createSlice({
  name: 'tvSubscription',
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
      .addCase(buyTvSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(buyTvSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.push({
          type: 'tv_subscription',
          reference: action.payload.reference,
          amount: parseFloat(action.meta.arg.price),
          coded: action.meta.arg.coded,
          number: action.meta.arg.number,
          status: 'success',
          timestamp: new Date(),
        });
      })
      .addCase(buyTvSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = tvSubscriptionSlice.actions;
export default tvSubscriptionSlice.reducer;
