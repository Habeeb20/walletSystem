/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/authSlice';
import WalletLoadingAnimation from '../../resources/wallet';
import { useSnackbar } from 'notistack';
import { TailSpin } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { email, password };
    dispatch(loginUser(userData))
      .unwrap()
      .then((response) => {
        enqueueSnackbar('Login successful!', { variant: 'success' });
        if (response.token) {
          enqueueSnackbar('Token received', { variant: 'info' });
          localStorage.setItem("token", response.token)
          navigate("/dashboard")
        }
      })
      .catch((err) => {
        if (err.error) {
          enqueueSnackbar(`Login failed: ${err.error} at ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' })}`, { variant: 'error' });
        } else {
          enqueueSnackbar(`Login failed: ${err.message || 'Unknown error'} at ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' })}`, { variant: 'error' });
        }
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-4xl">
        {/* Desktop Layout with Left Panel */}
        <div className="hidden sm:flex sm:w-1/2 bg-green-900 mt-20 h-[500px] relative">
          <WalletLoadingAnimation className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute inset-0 flex items-center justify-center text-center p-6">
            <div>
              <h1 className="text-4xl font-bold text-white">Welcome Back</h1>
              <p className="text-white mt-4">Enter your details to log in.</p>
            </div>
          </div>
        </div>
        {/* Form Section */}
        <div className="w-full sm:w-1/2 bg-white h-[550px] mt-20 p-6 pt-16 sm:pt-12 flex flex-col justify-center">
          {/* Mobile Wallet Animation */}
          <div className="w-full bg-green-800 p-4 sm:hidden">
            <WalletLoadingAnimation className="mx-auto" />
          </div>
          <form onSubmit={handleSubmit} className="space-y-1">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                required
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? (
                  <span>👁️‍🗨️</span> // Fallback eye-slash icon (Unicode)
                ) : (
                  <span>👁️</span> // Fallback eye icon (Unicode)
                )}
              </button>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={true} // No terms agreement needed for login
                disabled
                className="h-5 w-5 text-green-600 focus:ring-green-600 opacity-50"
              />
              <label className="ml-2 text-sm text-gray-700">Stay logged in</label>
            </div>
            <button
              type="submit"
              className="w-full bg-green-800 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <TailSpin height="24" width="24" color="#ffffff" /> : 'Login'}
            </button>
            {loading && <WalletLoadingAnimation className="mt-4 mx-auto" />}
          </form>
          <div className="mt-6 text-center">
            <a href='/signup'><p className="text-green-800 pb-10 text-sm">Don't have an account? Sign up.</p></a>
            <div className="mt-4 flex justify-center">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;