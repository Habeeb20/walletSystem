import { configureStore } from '@reduxjs/toolkit';

import authReducer from "./authSlice"
import walletReducer from "./authSlice"
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
















// // src/redux/store.js (or similar)
// import { configureStore } from '@reduxjs/toolkit';
// import { persistReducer, persistStore } from 'redux-persist'; // If using redux-persist (as seen in your error stack)
// import storage from 'redux-persist/lib/storage'; // Or sessionStorage if preferred

// // Import your reducers (adjust paths)
// import authReducer from './features/auth/authSlice'; // Assuming this exists based on your code
// import walletReducer from './features/wallet/walletSlice';
// import transferReducer from './features/transfer/transferSlice'; // Add this import

// // Redux-persist config (if you're using PersistGate as in the error stack)
// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['auth', 'wallet', 'transfer'], // Persist these slices; add 'transfer'
// };

// const rootReducer = {
//   auth: authReducer,
//   wallet: walletReducer,
//   transfer: transferReducer, // Add this
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false, // If needed for non-serializable data
//     }),
//   devTools: process.env.NODE_ENV !== 'production',
// });

// export const persistor = persistStore(store);









