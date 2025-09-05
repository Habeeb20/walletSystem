import { configureStore } from '@reduxjs/toolkit';

import authReducer from "./authSlice"
import walletReducer from "./authSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wallet: walletReducer,
  },
});