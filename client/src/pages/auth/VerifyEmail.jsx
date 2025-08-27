// /* eslint-disable no-unused-vars */
// /* eslint-disable react/no-unescaped-entities */
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { verifyEmail } from '../../redux/authSlice';
// import WalletLoadingAnimation from '../../resources/wallet';
// import { useSnackbar } from 'notistack';
// import { TailSpin } from 'react-loader-spinner';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
// import { useNavigate } from 'react-router-dom';
// import { MailIcon } from '@heroicons/react/solid';

// const VerifyEmailPage = () => {
//   const [code, setCode] = useState('');
//   const { loading, error } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const { enqueueSnackbar } = useSnackbar();
//   const navigate = useNavigate();

//   // Get email from localStorage
//   useEffect(() => {
//     const storedEmail = localStorage.getItem('email');
//     if (!storedEmail) {
//       enqueueSnackbar('No email found in local storage. Please log in again.', { variant: 'error' });
//     //   navigate('/login');
//     }
//   }, [enqueueSnackbar, navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const storedEmail = localStorage.getItem('userEmail');
//     if (!storedEmail) return;

//     const userData = { email: storedEmail, code };
//     dispatch(verifyEmail(userData))
//       .unwrap()
//       .then((response) => {
//         enqueueSnackbar(response.message || 'Email verified successfully!', { variant: 'success' });
//         navigate('/login');
//       })
//       .catch((err) => {
//         enqueueSnackbar(
//           `Verification failed: ${err.error || err.message || 'Unknown error'} at ${new Date().toLocaleString('en-US', {
//             timeZone: 'Africa/Lagos',
//           })}`,
//           { variant: 'error' }
//         );
//       });
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="flex w-full mt-20 max-w-4xl">
//         {/* Left Section with Large Icon and Animation */}
//         <div className="hidden sm:flex w-1/2 bg-green-800 h-[500px] relative">
//           <MailIcon
//             className="absolute top-1/2 left-1/2 mt-20 transform -translate-x-1/2 -translate-y-1/2 text-white"
//             style={{ width: '200px', height: '200px' }}
//           />
//           {(loading || !localStorage.getItem('userEmail')) && (
//             <WalletLoadingAnimation className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
//           )}
//           <div className="absolute inset-0 flex items-center justify-center text-center p-6">
//             <div>
//               <h1 className="text-4xl mb-10 font-bold text-white">Verify Your Email</h1>
//               <p className="mb-20 text-white">Enter the code sent to your email to proceed.</p>
//             </div>
//           </div>
//           {/* Static characters mimicking the image */}
//           <div className="absolute left-10 top-1/3 transform -translate-y-1/2 text-white">
//             <p className="font-bold">📧</p>
//             <p className="text-sm"></p>
//           </div>
//           <div className="absolute right-10 bottom-1/4 transform translate-y-1/2 text-white">
//             <p className="font-bold">🌱</p>
//             <p className="text-sm"></p>
//           </div>
//         </div>

//         {/* Right Section with Form */}
//         <div className="w-full sm:w-1/2 bg-white text-gray-900 h-[500px]  p-6 pt-16 sm:pt-12 flex flex-col justify-center">
//           <div className="w-full bg-green-700 p-4 sm:hidden flex justify-center">
//             <MailIcon className="text-white" style={{ width: '100px', height: '100px' }} />
//           </div>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Verification Code</label>
//               <div className="flex justify-center space-x-2 mt-1">
//                 {Array(4)
//                   .fill()
//                   .map((_, index) => (
//                     <input
//                       key={index}
//                       type="text"
//                       value={code[index] || ''}
//                       onChange={(e) => {
//                         const newCode = code.split('');
//                         newCode[index] = e.target.value.slice(-1);
//                         setCode(newCode.join(''));
//                       }}
//                       className="w-12 h-12 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-green-600"
//                       maxLength="1"
//                       required
//                     />
//                   ))}
//               </div>
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition duration-300 flex items-center justify-center"
//               disabled={loading}
//             >
//               {loading ? <TailSpin height="24" width="24" color="#ffffff" /> : 'Confirm'}
//             </button>
//             {loading && <WalletLoadingAnimation className="mt-4 mx-auto" />}
//           </form>
//           <div className="mt-6 text-center">
//             <a href="/resend-code" className="text-green-700 text-sm hover:underline">
//               Resend Code
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VerifyEmailPage;




/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail } from '../../redux/authSlice';
import WalletLoadingAnimation from '../../resources/wallet';
import { useSnackbar } from 'notistack';
import { TailSpin } from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { MailIcon } from '@heroicons/react/solid';

const VerifyEmailPage = () => {
  const [code, setCode] = useState('');
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Get email from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (!storedEmail) {
      enqueueSnackbar('No email found in local storage. Please log in again.', { variant: 'error' });
      navigate('/login');
    }
  }, [enqueueSnackbar, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedEmail = localStorage.getItem('email');
    if (!storedEmail) {
      enqueueSnackbar('No email found in local storage. Please log in again.', { variant: 'error' });
      navigate('/signup');
      return;
    }

    const userData = { email: storedEmail, code };
    try {
      const result = await dispatch(verifyEmail(userData)).unwrap();
      enqueueSnackbar(result.message || 'Email verified successfully!', { variant: 'success' });
      navigate('/login');
    } catch (err) {
      enqueueSnackbar(
        `Verification failed: ${err.error || err.message || 'Unknown error'} at ${new Date().toLocaleString('en-US', {
          timeZone: 'Africa/Lagos',
        })}`,
        { variant: 'error' }
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full mt-20 max-w-4xl">
        {/* Left Section with Large Icon and Animation */}
        <div className="hidden sm:flex w-1/2 bg-green-800 h-[500px] relative">
          <MailIcon
            className="absolute top-1/2 left-1/2 mt-20 transform -translate-x-1/2 -translate-y-1/2 text-white"
            style={{ width: '200px', height: '200px' }}
          />
          {(loading || !localStorage.getItem('userEmail')) && (
            <WalletLoadingAnimation className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          )}
          <div className="absolute inset-0 flex items-center justify-center text-center p-6">
            <div>
              <h1 className="text-4xl mb-10 font-bold text-white">Verify Your Email</h1>
              <p className="mb-20 text-white">Enter the code sent to your email to proceed.</p>
            </div>
          </div>
          {/* Static characters mimicking the image */}
          <div className="absolute left-10 top-1/3 transform -translate-y-1/2 text-white">
            <p className="font-bold">📧</p>
            <p className="text-sm"></p>
          </div>
          <div className="absolute right-10 bottom-1/4 transform translate-y-1/2 text-white">
            <p className="font-bold">🌱</p>
            <p className="text-sm"></p>
          </div>
        </div>

        {/* Right Section with Form */}
        <div className="w-full sm:w-1/2 bg-white text-gray-900 h-[500px] p-6 pt-16 sm:pt-12 flex flex-col justify-center">
          <div className="w-full bg-green-700 p-4 sm:hidden flex justify-center">
            <MailIcon className="text-white" style={{ width: '100px', height: '100px' }} />
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Verification Code</label>
              <div className="flex justify-center space-x-2 mt-1">
                {Array(4)
                  .fill()
                  .map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      value={code[index] || ''}
                      onChange={(e) => {
                        const newCode = code.split('');
                        newCode[index] = e.target.value.slice(-1);
                        setCode(newCode.join(''));
                      }}
                      className="w-12 h-12 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-green-600"
                      maxLength="1"
                      required
                    />
                  ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition duration-300 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <TailSpin height="24" width="24" color="#ffffff" /> : 'Confirm'}
            </button>
            {loading && <WalletLoadingAnimation className="mt-4 mx-auto" />}
          </form>
          <div className="mt-6 text-center">
            <a href="/resend-code" className="text-green-700 text-sm hover:underline">
              Resend Code
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;