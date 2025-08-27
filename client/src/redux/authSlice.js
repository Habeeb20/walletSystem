/* eslint-disable no-unused-vars */



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


// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     loading: false,
//     token: null,
//     error: null,
//     usernameSuggestions: [],
//   },
//   reducers: {},
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
//        .addCase(fetchDashboard.pending, (state) => {
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
//       });
//   },
// });

// export default authSlice.reducer;



/* eslint-disable no-unused-vars */

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

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loading: false,
    token: null,
    error: null,
    usernameSuggestions: [],
    dashboardData: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.dashboardData = null;
      state.error = null;
      state.usernameSuggestions = [];
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
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;