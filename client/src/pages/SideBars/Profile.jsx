/* eslint-disable no-unused-vars */



// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchCustomerDetails, createVirtualAccount } from '../../redux/authSlice';
// import { useSnackbar } from 'notistack';
// import { TailSpin } from 'react-loader-spinner';
// import WalletLoadingAnimation from '../../resources/wallet';

// const Profile = () => {
//   const dispatch = useDispatch();
//   const { loading, customerDetails, error } = useSelector((state) => state.auth);
//   const [virtualAccountCompleted, setVirtualAccountCompleted] = useState(false);
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (token) {
//         dispatch(fetchCustomerDetails());
//       } else {
//         console.warn('Token not available, delaying fetch...');
//       }
//     }, 500); // Wait 500ms for rehydration
//     return () => clearTimeout(timer);
//   }, [dispatch, token]);

//   const handleCreateVirtualAccount = async () => {
//     if (token && customerDetails) {
//       try {
//         const response = await dispatch(createVirtualAccount({ token, customerId: customerDetails.id })).unwrap();
//         setVirtualAccountCompleted(true);
//         dispatch(fetchCustomerDetails()); // Refresh customer details with virtual account info
//       } catch (error) {
//         console.error('Failed to create virtual account:', error);
//       }
//     }
//   };

//   const progressSteps = [
//     { id: 'account', label: 'Create Account', completed: true },
//     { id: 'customer', label: 'Create Customer Account', completed: true },
//     { id: 'virtual', label: 'Virtual Account', completed: virtualAccountCompleted }
//   ];

//   return (
//     <div className="min-h-screen  to-indigo-100 p-6">
//       {loading && <WalletLoadingAnimation loading={loading} />}
//       <div className="max-w-3xl mx-auto">
//         {/* Progress Bar */}
//         <div className="mb-8">
//           <h2 className="text-xl font-semibold text-gray-700 mb-4">Account Setup Progress</h2>
//           <div className="flex justify-between items-center">
//             {progressSteps.map((step, index) => (
//               <div key={step.id} className="flex-1 flex flex-col items-center">
//                 <div
//                   className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                     step.completed
//                       ? 'bg-gradient-to-r from-green-900 to-green-700 text-white'
//                       : 'bg-gray-300 text-gray-600'
//                   }`}
//                 >
//                   {step.completed ? (
//                     <svg
//                       className="w-6 h-6"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M5 13l4 4L19 7"
//                       />
//                     </svg>
//                   ) : (
//                     index + 1
//                   )}
//                 </div>
//                 <span className="mt-2 text-sm text-gray-600">{step.label}</span>
//                 {index < progressSteps.length - 1 && (
//                   <div
//                     className={`flex-1 h-1 mx-2 ${
//                       progressSteps[index + 1].completed ? 'bg-green-500' : 'bg-gray-300'
//                     }`}
//                   ></div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Customer Details Card */}
//         <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
//           <h2 className="text-2xl font-bold  mb-4">Customer Profile</h2>
//           {loading ? (
//             <div className="text-center text-gray-500">Loading details...</div>
//           ) : error ? (
//             <div className="text-center text-red-500">{error}</div>
//           ) : customerDetails ? (
//             <div className="space-y-4">
//               <div className="flex items-center">
//                 <span className="w-32 text-gray-600 font-medium">First Name:</span>
//                 <span className="text-gray-800">{customerDetails.first_name}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="w-32 text-gray-600 font-medium">Last Name:</span>
//                 <span className="text-gray-800">{customerDetails.last_name}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="w-32 text-gray-600 font-medium">Email:</span>
//                 <span className="text-gray-800">{customerDetails.email}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="w-32 text-gray-600 font-medium">Phone Number:</span>
//                 <span className="text-gray-800">{customerDetails.phone}</span>
//               </div>
//               {customerDetails.virtualAccountDetails && (
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-700 mt-4">Virtual Account Details</h3>
//                   <div className="flex items-center">
//                     <span className="w-32 text-gray-600 font-medium">Account Number:</span>
//                     <span className="text-gray-800">{customerDetails.virtualAccountDetails.account_number}</span>
//                   </div>
//                   <div className="flex items-center">
//                     <span className="w-32 text-gray-600 font-medium">Account Name:</span>
//                     <span className="text-gray-800">{customerDetails.virtualAccountDetails.account_name}</span>
//                   </div>
//                   <div className="flex items-center">
//                     <span className="w-32 text-gray-600 font-medium">Bank:</span>
//                     <span className="text-gray-800">{customerDetails.virtualAccountDetails.bank}</span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="text-center text-gray-500">No details available</div>
//           )}
//         </div>

//         {/* Optional Button to Mark Virtual Account */}
//         <button
//           onClick={handleCreateVirtualAccount}
//           className="mt-4 bg-gradient-to-r from-green-900 to-green-700 text-white p-2 rounded hover:bg-green-600 transition duration-300"
//           disabled={virtualAccountCompleted}
//         >
//           Create Virtual Account
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Profile;






import React, { useEffect } from 'react'; // Removed useState since it's now in Redux
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomerDetails, createVirtualAccount, checkVirtualAccount } from '../../redux/authSlice';
import { useSnackbar } from 'notistack';
import { TailSpin } from 'react-loader-spinner';
import WalletLoadingAnimation from '../../resources/wallet';

const Profile = () => {
  const dispatch = useDispatch();
  const { loading, customerDetails, error, virtualAccountCompleted } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');

  console.log(virtualAccountCompleted)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) {
        dispatch(fetchCustomerDetails());
        dispatch(checkVirtualAccount(token)); // Check virtual account status
      } else {
        console.warn('Token not available, delaying fetch...');
      }
    }, 500); // Wait 500ms for rehydration
    return () => clearTimeout(timer);
  }, [dispatch, token]);

  const handleCreateVirtualAccount = async () => {
    if (token && customerDetails) {
      try {
        await dispatch(createVirtualAccount({ token, customerId: customerDetails.id })).unwrap();
        dispatch(fetchCustomerDetails()); 
      } catch (error) {
        console.error('Failed to create virtual account:', error);
      }
    }
  };

  const progressSteps = [
    { id: 'account', label: 'Create Account', completed: true },
    { id: 'customer', label: 'Create Customer Account', completed: true },
    { id: 'virtual', label: 'Virtual Account', completed: virtualAccountCompleted }
  ];

  return (
    <div className="min-h-screen  to-indigo-100 p-6">
      {loading && <WalletLoadingAnimation loading={loading} />}
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-black mb-4">Account Setup Progress</h2>
          <div className="flex justify-between items-center">
            {progressSteps.map((step, index) => (
              <div key={step.id} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.completed
                      ? 'bg-gradient-to-r from-green-900 to-green-700 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {step.completed ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="mt-2 text-sm text-gray-600">{step.label}</span>
                {index < progressSteps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      progressSteps[index + 1].completed ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Customer Details Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
          <h2 className="text-2xl font-bold text-black mb-4">Customer Profile</h2>
          {loading ? (
            <div className="text-center text-gray-500">Loading details...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : customerDetails ? (
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="w-32 text-gray-600 font-medium">First Name:</span>
                <span className="text-gray-800">{customerDetails.first_name}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 text-gray-600 font-medium">Last Name:</span>
                <span className="text-gray-800">{customerDetails.last_name}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 text-gray-600 font-medium">Email:</span>
                <span className="text-gray-800">{customerDetails.email}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 text-gray-600 font-medium">Phone Number:</span>
                <span className="text-gray-800">{customerDetails.phone}</span>
              </div>
              {customerDetails.virtualAccountDetails && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mt-4">Virtual Account Details</h3>
                  <div className="flex items-center">
                    <span className="w-32 text-gray-600 font-medium">Account Number:</span>
                    <span className="text-gray-800">{customerDetails.virtualAccountDetails.account_number}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-32 text-gray-600 font-medium">Account Name:</span>
                    <span className="text-gray-800">{customerDetails.virtualAccountDetails.account_name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-32 text-gray-600 font-medium">Bank:</span>
                    <span className="text-gray-800">{customerDetails.virtualAccountDetails.bank}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500">No details available</div>
          )}
        </div>

        {/* Create Virtual Account Button */}
        <button
          onClick={handleCreateVirtualAccount}
          className="mt-4 bg-gradient-to-r from-green-900 to-green-700 text-white p-2 rounded hover:bg-green-600 transition duration-300"
          disabled={virtualAccountCompleted}
        >
          Create Virtual Account
        </button>
      </div>
    </div>
  );
};

export default Profile;