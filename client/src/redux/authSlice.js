/* eslint-disable no-unused-vars */



// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// export const registerUser = createAsyncThunk(
//   'auth/register',
//   async (userData, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(userData),
//       });
//       if (!response.ok) throw new Error('Registration failed');
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const loginUser = createAsyncThunk(
//   'auth/login',
//   async (userData, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(userData),
//       });
//       if (!response.ok) throw new Error('Login failed');
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const verifyEmail = createAsyncThunk(
//   'auth/verifyemail',
//   async (userData, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/verifyemail`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(userData),
//       });
//       if (!response.ok) throw new Error('Verification failed');
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       return rejectWithValue({ error: error.message });
//     }
//   }
// );

// // export const fetchDashboard = createAsyncThunk(
// //   'auth/fetchDashboard',
// //   async (token, { rejectWithValue }) => {
// //     try {
// //       const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/dashboard`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       return response.data.data;
// //     } catch (error) {
// //       return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard data');
// //     }
// //   }
// // );


// export const fetchDashboard = createAsyncThunk(
//   'auth/fetchDashboard',
//   async (token, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/dashboard`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = response.data.data;

//       if (data?.user?.wallet?.transactions) {
//         for (const transaction of data.user.wallet.transactions) {
//           if (transaction.status === 'pending') {
//             const paymentResponse = await axios.get(
//               `https://api.paystack.co/transaction/verify/${transaction.reference}`,
//               {
//                 headers: { Authorization: `Bearer ${import.meta.env.PAYSTACK_SECRET_KEY}` },
//               }
//             );
//             if (paymentResponse.data.status === 'success') {
//               await axios.post(
//                 `${import.meta.env.VITE_BACKEND_URL}/auth/wallet-callback?reference=${transaction.reference}`
//               );
//               // Refresh data after update
//               const refreshedResponse = await axios.get(
//                 `${import.meta.env.VITE_BACKEND_URL}/auth/dashboard`,
//                 { headers: { Authorization: `Bearer ${token}` } }
//               );
//               return refreshedResponse.data.data;
//             }
//           }
//         }
//       }
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard data');
//     }
//   }
// );


// export const fetchCustomerDetails = createAsyncThunk(
//   'auth/fetchCustomerDetails',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/customer-details`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer details');
//     }
//   }
// );


// export const createVirtualAccount = createAsyncThunk(
//   'auth/createVirtualAccount',
//   async ({ token, customerId }, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/create-virtual-account`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ customerId }),
//       });
//       if (!response.ok) throw new Error('Failed to create virtual account');
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );




// // export const createPaylonyVirtualAccount = createAsyncThunk(
// //   'auth/createPaylonyVirtualAccount',
// //   async ({ dob, address, gender }, { getState, rejectWithValue }) => {
// //     const token = localStorage.getItem('token');
// //     const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/create-paylony-virtual-account`, {
// //       method: 'POST',
// //       headers: {
// //         'Content-Type': 'application/json',
// //         'Authorization': `Bearer ${token}`,
// //       },
// //       body: JSON.stringify({ dob, address, gender }),
// //     });
// //     if (!response.ok) {
// //       const errorData = await response.json();
// //       return rejectWithValue(errorData.error || 'Failed to create Paylony virtual account');
// //     }
// //     return response.json();
// //   }
// // );


// export const createPaylonyVirtualAccount = createAsyncThunk(
//   'auth/createPaylonyVirtualAccount',
//   async ({ token, customerId, dob, address, gender }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//              "https://api.paylony.com/api/v1/create_account",
//         {
//           customer_id: customerId,
//           dob,
//           address,
//           gender,
//           currency: 'NGN',
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${import.meta.env.PAYLONY_SECRET_KEY}`, 
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to create virtual account');
//     }
//   }
// );



// export const checkVirtualAccount = createAsyncThunk(
//   'auth/checkVirtualAccount',
//   async (token, { getState, rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/check-virtual-account`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to check virtual account');
//     }
//   }
// );




// export const fundWallet = createAsyncThunk(
//   'auth/fundWallet',
//   async ({ token, amount }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/wallet/fund-wallet`,
//         { amount },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fund wallet');
//     }
//   }
// );


// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     loading: false,
//     token: null,
//     error: null,
//     usernameSuggestions: [],
//     dashboardData: null,
//     customerDetails: null,
//     virtualAccountCompleted: false,
//   },
//   reducers: {
//     logout: (state) => {
//       state.token = null;
//       state.dashboardData = null;
//       state.error = null;
//       state.usernameSuggestions = [];
//       state.customerDetails = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.token = action.payload.token;
//         state.usernameSuggestions = action.payload.usernameSuggestions || [];
//         console.log('Registration successful, token set:', state.token);
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.token = action.payload.token;
//         console.log('Login successful, token set:', state.token);
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(verifyEmail.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(verifyEmail.fulfilled, (state, action) => {
//         state.loading = false;
//       })
//       .addCase(verifyEmail.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload.error;
//       })
//       .addCase(fetchDashboard.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchDashboard.fulfilled, (state, action) => {
//         state.loading = false;
//         state.dashboardData = action.payload;
//       })
//       .addCase(fetchDashboard.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(fetchCustomerDetails.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchCustomerDetails.fulfilled, (state, action) => {
//         state.loading = false;
//         state.error = null;
//         state.customerDetails = action.payload;
//       })
//       .addCase(fetchCustomerDetails.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//        .addCase(createVirtualAccount.pending, (state) => {
//     state.loading = true;
//     state.error = null;
//   })
//   .addCase(createVirtualAccount.fulfilled, (state, action) => {
//     state.loading = false;
//     state.customerDetails = { ...state.customerDetails, ...action.payload };
//   })
//   .addCase(createVirtualAccount.rejected, (state, action) => {
//     state.loading = false;
//     state.error = action.payload;
//   })
//     .addCase(createPaylonyVirtualAccount.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createPaylonyVirtualAccount.fulfilled, (state, action) => {
//         state.loading = false;
//         state.customerDetails = {
//           ...state.customerDetails,
//           paylonyVirtualAccountDetails: action.payload.details,
//         };
//         state.virtualAccountCompleted = true;
//       })
//       .addCase(createPaylonyVirtualAccount.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(checkVirtualAccount.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//     .addCase(checkVirtualAccount.fulfilled, (state, action) => {
//         state.loading = false;
//         state.virtualAccountCompleted = action.payload.exists;
//         if (action.payload.virtualAccountDetails) {
//           state.customerDetails = {
//             ...state.customerDetails,
//             virtualAccountDetails: action.payload.virtualAccountDetails,
//           };
//         }
//       })
//       .addCase(checkVirtualAccount.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//        .addCase(fundWallet.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fundWallet.fulfilled, (state, action) => {
//         state.loading = false;
//         if (state.dashboardData?.user) {
//           state.dashboardData.user.wallet.balance += action.payload.amount || 0;
//         }
//       })
//       .addCase(fundWallet.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });

//   },
// });

// export const { logout,  } = authSlice.actions;
// export default authSlice.reducer;

















/* eslint-disable no-unused-vars */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Registration failed');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyemail',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/verifyemail`,
        userData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Verification failed');
    }
  }
);

export const fetchDashboard = createAsyncThunk(
  'auth/fetchDashboard',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data.data;

      if (data?.user?.wallet?.transactions) {
        for (const transaction of data.user.wallet.transactions) {
          if (transaction.status === 'pending') {
            try {
              const paymentResponse = await axios.get(
                `https://api.paystack.co/transaction/verify/${transaction.reference}`,
                {
                  headers: { Authorization: `Bearer ${import.meta.env.VITE_PAYSTACK_SECRET_KEY}` },
                }
              );
              if (paymentResponse.data.status === 'success') {
                await axios.post(
                  `${import.meta.env.VITE_BACKEND_URL}/auth/wallet-callback?reference=${transaction.reference}`
                );
                const refreshedResponse = await axios.get(
                  `${import.meta.env.VITE_BACKEND_URL}/auth/dashboard`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                return refreshedResponse.data.data;
              }
            } catch (verifyError) {
              console.error(`Verification failed for reference ${transaction.reference}:`, verifyError);
            }
          }
        }
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  }
);

export const fetchCustomerDetails = createAsyncThunk(
  'auth/fetchCustomerDetails',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.token || localStorage.getItem('token');
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/customer`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer details');
    }
  }
);

export const createVirtualAccount = createAsyncThunk(
  'auth/createVirtualAccount',
  async ({ token, customerId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/create-virtual-account`,
        { customerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create virtual account');
    }
  }
);

export const createPaylonyVirtualAccount = createAsyncThunk(
  'auth/createPaylonyVirtualAccount',
  async ({ token, customerId, firstname, lastname, address, gender, email, phone, dob }, { rejectWithValue }) => {
    try {
      console.log('Calling Backend to Create Paylony Account with Token:', token);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/create-paylony-virtual-account`, // Adjust to your backend route
        {
          customerId,
          firstname,
          lastname,
          address,
          gender,
          email,
          phone,
          dob,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Backend Response for Paylony Creation:', response.data);
      return response.data.virtual_account; // Expecting { success: true, virtual_account: {...} }
    } catch (error) {
      console.error('Paylony Creation Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || 'Failed to create Paylony virtual account');
    }
  }
);






export const fetchPaylonyAccounts = createAsyncThunk(
  'auth/fetchPaylonyAccounts',
  async (token, { rejectWithValue }) => {
    try {
      console.log('Fetching Paylony Accounts with Token:', token);
      const response = await axios.get('https://api.paylony.com/api/v1/fetch_all_accounts', {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_PAYLONY_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Paylony Accounts Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Paylony Accounts Fetch Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch Paylony accounts');
    }
  }
);
// Other thunks and reducers remain unchanged

export const checkVirtualAccount = createAsyncThunk(
  'auth/checkVirtualAccount',
  async (token, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const effectiveToken = token || auth.token || localStorage.getItem('token');
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/check-virtual-account`, {
        headers: { Authorization: `Bearer ${effectiveToken}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check virtual account');
    }
  }
);

export const fundWallet = createAsyncThunk(
  'auth/fundWallet',
  async ({ token, amount }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/wallet/fund-wallet`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fund wallet');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loading: false,
    token: null,
    error: null,
    dashboardData: null,
    customerDetails: null,
    virtualAccountCompleted: false,
    paylonyAccounts: [],
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.dashboardData = null;
      state.error = null;
      state.customerDetails = null;
      state.virtualAccountCompleted = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        console.log('Registration successful, token set:', state.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        console.log('Login successful, token set:', state.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCustomerDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
     .addCase(fetchCustomerDetails.fulfilled, (state, action) => {
  state.loading = false;
  state.error = null;
  state.customerDetails = action.payload.data || {}; 
})
      .addCase(fetchCustomerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createVirtualAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVirtualAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.customerDetails = { ...state.customerDetails, ...action.payload };
      })
      .addCase(createVirtualAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPaylonyVirtualAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaylonyVirtualAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.customerDetails = {
          ...state.customerDetails,
          paylonyVirtualAccountDetails: action.payload.data || action.payload, // Adjust based on response
        };
        state.virtualAccountCompleted = true;
      })
      .addCase(createPaylonyVirtualAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPaylonyAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaylonyAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.paylonyAccounts = action.payload.data || []; 
      })
      .addCase(fetchPaylonyAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkVirtualAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkVirtualAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.virtualAccountCompleted = action.payload.exists;
        if (action.payload.virtualAccountDetails) {
          state.customerDetails = {
            ...state.customerDetails,
            virtualAccountDetails: action.payload.virtualAccountDetails,
          };
        }
      })
      .addCase(checkVirtualAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fundWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fundWallet.fulfilled, (state, action) => {
        state.loading = false;
        if (state.dashboardData?.user) {
          state.dashboardData.user.wallet.balance += action.payload.amount || 0;
        }
      })
      .addCase(fundWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;