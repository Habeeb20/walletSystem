import { configureStore } from '@reduxjs/toolkit';

import authReducer from "./authSlice"
import walletReducer from "./store/airtimeSlice"
import electricityReducer from "./store/electrictySlice"
import tvSubscriptionReducer from "./store/tvSlice"
import transferReducer from "./store/transferSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wallet: walletReducer,
    electricity:electricityReducer,
    tvSubscription:tvSubscriptionReducer,
    transfer: transferReducer,
  },
});











