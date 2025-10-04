import { configureStore } from '@reduxjs/toolkit';

import authReducer from "./authSlice"
import walletReducer from "./authSlice"
import electricityReducer from "./store/electrictySlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wallet: walletReducer,
    electricity:electricityReducer
  },
});