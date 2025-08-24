/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { registerUser } from '../../redux/authSlice';
// import WalletLoadingAnimation from '../../resources/wallet';
// import { useSnackbar } from 'notistack';
// import { TailSpin } from 'react-loader-spinner';

// const SignupPage = () => {
//   const [fullName, setFullName] = useState('');
//   const [username, setUsername] = useState('');
//   const [phone, setPhone] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [agreeTerms, setAgreeTerms] = useState(false);
//   const [usernameSuggestions, setUsernameSuggestions] = useState([]);
//   const { loading, error, token } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const { enqueueSnackbar } = useSnackbar();

//   useEffect(() => {
//     if (fullName) {
//       fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register?fullName=${encodeURIComponent(fullName)}`)
//         .then((res) => {
//           if (!res.ok) throw new Error('Failed to fetch suggestions');
//           return res.json();
//         })
//         .then((data) => {
//           setUsernameSuggestions(data);
//           setUsername(data[0] || '');
//         })
//         .catch((err) => enqueueSnackbar(`Failed to fetch username suggestions: ${err.message} at ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' })}`, { variant: 'error' }));
//     }
//   }, [fullName]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!agreeTerms) {
//       enqueueSnackbar('Please agree to the Terms and Conditions', { variant: 'warning' });
//       return;
//     }
//     const userData = { fullName, username, phone, email, password };
//     dispatch(registerUser(userData))
//       .unwrap()
//       .then(() => {
//         enqueueSnackbar('Registration successful!', { variant: 'success' });
//       })
//       .catch((err) => {
//         enqueueSnackbar(`${err.message || 'Registration failed'} at ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' })}`, { variant: 'error' });
//       });
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="flex w-full max-w-4xl">
//         {/* Desktop Layout with Left Panel */}
//         <div className="hidden sm:flex sm:w-1/2 bg-green-900 mt-20 h-[500px] relative">
//           <WalletLoadingAnimation className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
//           <div className="absolute inset-0 flex items-center justify-center text-center p-6">
//             <div>
//               <h1 className="text-4xl font-bold text-white">Let's get you started</h1>
//               <p className="text-white mt-4">Fill in the information to complete your account creation.</p>
//             </div>
//           </div>
//         </div>
//         {/* Form Section */}
//         <div className="w-full sm:w-1/2 bg-white h-[550px] mt-20 p-6 pt-16 sm:pt-12 flex flex-col justify-center">
//           {/* Mobile Wallet Animation */}
//           <div className="w-full bg-green-800 p-4 sm:hidden">
//             <WalletLoadingAnimation className="mx-auto" />
//           </div>
//           <form onSubmit={handleSubmit} className="space-y-1">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Full Name</label>
//               <input
//                 type="text"
//                 value={fullName}
//                 onChange={(e) => setFullName(e.target.value)}
//                 className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
//                 required
//               />
//             </div>
//             {/* <div>
//               <label className="block text-sm font-medium text-gray-700">Username</label>
//               <select
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
//                 required
//               >
//                 {usernameSuggestions.map((suggestion, index) => (
//                   <option key={index} value={suggestion}>{suggestion}</option>
//                 ))}
//               </select>
//             </div> */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Phone</label>
//               <input
//                 type="tel"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
//                 required
//               />
//             </div>
//             <div className="relative">
//               <label className="block text-sm font-medium text-gray-700">Password</label>
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 pr-10"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 hover:text-gray-800"
//               >
//                 {showPassword ? (
//                   <span>👁️‍🗨️</span> // Fallback eye-slash icon (Unicode)
//                 ) : (
//                   <span>👁️</span> // Fallback eye icon (Unicode)
//                 )}
//               </button>
//             </div>
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 checked={agreeTerms}
//                 onChange={(e) => setAgreeTerms(e.target.checked)}
//                 className="h-5 w-5 text-green-600 focus:ring-green-600"
//               />
//               <label className="ml-2 text-sm text-gray-700">By creating your account, you agree to our Terms and Conditions</label>
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-green-800 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center"
//               disabled={loading}
//             >
//               {loading ? <TailSpin height="24" width="24" color="#ffffff" /> : 'Register'}
//             </button>
//             {loading && <WalletLoadingAnimation className="mt-4 mx-auto" />}
//           </form>
//           <div className="mt-6 text-center">
//             <a href='/login'><p className="text-green-800 pb-10 text-sm">Already have an account? login.</p></a>
          
//             <div className="mt-4 flex justify-center">
            
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignupPage;


/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/authSlice';
import WalletLoadingAnimation from '../../resources/wallet';
import { useSnackbar } from 'notistack';
import { TailSpin } from 'react-loader-spinner';

const SignupPage = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { loading, error, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // No username suggestions needed
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      enqueueSnackbar('Please agree to the Terms and Conditions', { variant: 'warning' });
      return;
    }
    const userData = { fullName, phone, email, password };
    dispatch(registerUser(userData))
      .unwrap()
      .then((response) => {
        enqueueSnackbar('Registration successful!', { variant: 'success' });
        if (response.token) {
          enqueueSnackbar(`Token received: ${response.token}`, { variant: 'info' });
        }
      })
    .catch((err) => {
  if (err.error) {
    enqueueSnackbar(`Registration failed: ${err.error} at ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' })}`, { variant: 'error' });
  } else {
    enqueueSnackbar(`Registration failed: ${err.message || 'Unknown error'} at ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' })}`, { variant: 'error' });
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
              <h1 className="text-4xl font-bold text-white">Let's get you started</h1>
              <p className="text-white mt-4">Fill in the information to complete your account creation.</p>
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
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                required
              />
            </div>
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
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="h-5 w-5 text-green-600 focus:ring-green-600"
              />
              <label className="ml-2 text-sm text-gray-700">By creating your account, you agree to our Terms and Conditions</label>
            </div>
            <button
              type="submit"
              className="w-full bg-green-800 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <TailSpin height="24" width="24" color="#ffffff" /> : 'Register'}
            </button>
            {loading && <WalletLoadingAnimation className="mt-4 mx-auto" />}
          </form>
          <div className="mt-6 text-center">
            <a href='/login'><p className="text-green-800 pb-10 text-sm">Already have an account? login.</p></a>
            <div className="mt-4 flex justify-center">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;