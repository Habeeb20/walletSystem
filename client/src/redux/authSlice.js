/* eslint-disable no-unused-vars */


// /* eslint-disable no-unused-vars */

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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

// export const fetchDashboard = createAsyncThunk(
//   'auth/dashboard',
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const { auth } = getState();
//       const token = auth.token;
//       if (!token) throw new Error('No authentication token');

//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/dashboard`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       if (!response.ok) throw new Error('Failed to fetch dashboard');
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const fetchCustomerDetails = createAsyncThunk(
//   'auth/fetchCustomerDetails',
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const { auth } = getState();
//       let token = auth.token;

//       console.log('Initial token from Redux:', token);

//       if (!token) {
//         const persistedState = localStorage.getItem('persist:root');
//         console.log('Persisted state:', persistedState);
//         if (persistedState) {
//           const parsedState = JSON.parse(persistedState);
//           const authState = JSON.parse(parsedState.auth);
//           token = authState.token;
//         }
//         if (!token) throw new Error('No authentication token');
//       }
//       console.log('Final token used:', token);

//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/customer?t=${Date.now()}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       console.log('Raw response status:', response.status);
//       console.log('Raw response headers:', Object.fromEntries(response.headers.entries()));

//       if (!response.ok && response.status !== 304) {
//         const errorText = await response.text();
//         console.error('API Error Response:', errorText);
//         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText || 'Unknown error'}`);
//       }

//       // For 304, assume cached data is valid (optional: fetch from cache if needed)
//       if (response.status === 304) {
//         console.warn('304 Not Modified, using cached data or rejecting');
//         throw new Error('Resource not modified, please refresh or clear cache');
//       }

//       const data = await response.json();
//       console.log('Fetched customer data before validation:', data);
//       if (!data || typeof data !== 'object') {
//         console.error('Invalid data type:', typeof data, 'Data:', data);
//         throw new Error('Invalid response data');
//       }
//       return data;
//     } catch (error) {
//       console.error('Fetch customer details error:', error);
//       return rejectWithValue(error.message);
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
//     customerDetails:null
//   },
//   reducers: {
//     logout: (state) => {
//       state.token = null;
//       state.dashboardData = null;
//       state.error = null;
//       state.usernameSuggestions = [];
//       state.customerDetails= null;
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
//       } )
//       .addCase(fetchCustomerDetails.fulfilled, (state, action) => {
//         state.loading = false,
//         state.error = null,
//         state.customerDetails = action.payload;

//       })
//       .addCase(fetchCustomerDetails.rejected, (state, action) => {
//         state.loading= false,
//         state.error = action.payload
//       });
//   },
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;




import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/verifyemail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Verification failed');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);

export const fetchDashboard = createAsyncThunk(
  'auth/dashboard',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) throw new Error('No authentication token');

      console.log('Fetching dashboard with token:', token);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch dashboard');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// export const fetchCustomerDetails = createAsyncThunk(
//   'auth/fetchCustomerDetails',
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const { auth } = getState();
//       let token = auth.token;

//       console.log('Initial token from Redux:', token);

//       if (!token) {
//         const persistedState = localStorage.getItem('persist:root');
//         console.log('Persisted state:', persistedState);
//         if (persistedState) {
//           const parsedState = JSON.parse(persistedState);
//           const authState = parsedState.auth ? JSON.parse(parsedState.auth) : null;
//           token = authState?.token;
//           console.log('Token from persisted state:', token);
//         }
//         // Fallback to localStorage token if still null
//         if (!token) {
//           token = localStorage.getItem('token');
//           console.log('Token from localStorage fallback:', token);
//         }
//         if (!token) throw new Error('No authentication token');
//       }
//       console.log('Final token used:', token);

//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/customer?t=${Date.now()}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       console.log('Raw response status:', response.status);
//       console.log('Raw response headers:', Object.fromEntries(response.headers.entries()));

//       if (!response.ok && response.status !== 304) {
//         const errorText = await response.text();
//         console.error('API Error Response:', errorText);
//         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText || 'Unknown error'}`);
//       }

//       if (response.status === 304) {
//         console.warn('304 Not Modified, using cached data or rejecting');
//         throw new Error('Resource not modified, please refresh or clear cache');
//       }

//       const data = await response.json();
//       console.log('Fetched customer data before validation:', data);
//       if (!data || typeof data !== 'object') {
//         console.error('Invalid data type:', typeof data, 'Data:', data);
//         throw new Error('Invalid response data');
//       }
//       return data;
//     } catch (error) {
//       console.error('Fetch customer details error:', error);
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const fetchCustomerDetails = createAsyncThunk(
  'auth/fetchCustomerDetails',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      let token = auth.token;

      console.log('Initial token from Redux:', token);

      // Fallback to localStorage if Redux token is null
      if (!token) {
        token = localStorage.getItem('token');
        console.log('Token from localStorage fallback:', token);
        // if (!token) throw new Error('No authentication token');
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/customer?t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Raw response status:', response.status);
      console.log('Raw response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Fetched customer data before validation:', data);
      if (!data || typeof data !== 'object') {
        console.error('Invalid data type:', typeof data, 'Data:', data);
        throw new Error('Invalid response data');
      }
      return data;
    } catch (error) {
      console.error('Fetch customer details error:', error);
      return rejectWithValue(error.message);
    }
  }
);




const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loading: false,
    token: null,
    error: null,
    usernameSuggestions: [],
    dashboardData: null,
    customerDetails: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.dashboardData = null;
      state.error = null;
      state.usernameSuggestions = [];
      state.customerDetails = null;
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
        state.usernameSuggestions = action.payload.usernameSuggestions || [];
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
        state.error = action.payload.error;
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
        state.customerDetails = action.payload;
      })
      .addCase(fetchCustomerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;







































