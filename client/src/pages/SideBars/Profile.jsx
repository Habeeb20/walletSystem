
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchCustomerDetails, createPaylonyVirtualAccount, checkVirtualAccount } from '../../redux/authSlice';
// import { useSnackbar } from 'notistack';
// import WalletLoadingAnimation from '../../resources/wallet';

// const Profile = () => {
//   const dispatch = useDispatch();
//   const { loading, customerDetails, error, virtualAccountCompleted } = useSelector((state) => state.auth);
//   const token = localStorage.getItem('token');
//   const [showVirtualAccountForm, setShowVirtualAccountForm] = useState(false); // For Paystack
//   const [showPaylonyAccountForm, setShowPaylonyAccountForm] = useState(false); // For Paylony
//   const [virtualAccountData, setVirtualAccountData] = useState({
//     dob: '',
//     address: '',
//     gender: '',
//   });
//   const [paylonyAccountData, setPaylonyAccountData] = useState({
//     dob: '',
//     address: '',
//     gender: '',
//   });
//   const [initialCustomerDetails, setInitialCustomerDetails] = useState(null); // To store initial state

//   const { enqueueSnackbar } = useSnackbar();

//   console.log('Virtual Account Completed:', virtualAccountCompleted);
//   console.log('Customer Details:', customerDetails);
//   console.log('Loading State:', loading);
//     console.log("details from env", import.meta.env)
//   useEffect(() => {
//     const timer = setTimeout(() => {
    
//       if (token) {
//         dispatch(fetchCustomerDetails()).then((action) => {
//           console.log('Fetched Customer Details:', action.payload);
//           setInitialCustomerDetails(action.payload.data || {});
//         });
//         dispatch(checkVirtualAccount(token)).then((action) => {
//           console.log('Check Virtual Account Result:', action.payload);
//         });
//       } else {
//         console.warn('Token not available, delaying fetch...');
//       }
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [dispatch, token]);

//   const handleCreateVirtualAccount = () => {
//     console.log('Paystack Button Clicked');
//     if (!virtualAccountCompleted) {
//       setShowVirtualAccountForm(true);
//     }
//   };

//   const handleVirtualAccountSubmit = async (e) => {
//     e.preventDefault();
//     if (!virtualAccountData.dob || !virtualAccountData.address || !virtualAccountData.gender) {
//       enqueueSnackbar('Please fill in all fields (DOB, Address, Gender)', { variant: 'error' });
//       return;
//     }
//     try {
//       await dispatch(
//         createPaylonyVirtualAccount({
//           token,
//           customerId: customerDetails?.id,
//           dob: virtualAccountData.dob,
//           address: virtualAccountData.address,
//           gender: virtualAccountData.gender,
//         })
//       ).unwrap();
//       setShowVirtualAccountForm(false);
//       dispatch(fetchCustomerDetails());
//       dispatch(checkVirtualAccount(token));
//       enqueueSnackbar('Virtual account created successfully', { variant: 'success' });
//     } catch (error) {
//       console.error('Failed to create virtual account:', error);
//       enqueueSnackbar('Failed to create virtual account. Please try again.', { variant: 'error' });
//     }
//   };

//   const handleCreatePaylonyAccount = () => {
//     console.log('Paylony Button Clicked');
//     setShowPaylonyAccountForm(true);
//   };

//   const handlePaylonyAccountSubmit = async (e) => {
//     e.preventDefault();
//     if (!paylonyAccountData.dob || !paylonyAccountData.address || !paylonyAccountData.gender) {
//       enqueueSnackbar('Please fill in all fields (DOB, Address, Gender)', { variant: 'error' });
//       return;
//     }
//     try {
//       await dispatch(
//         createPaylonyVirtualAccount({
//           token,
//           customerId: customerDetails?.id,
//           firstname: customerDetails?.first_name || '',
//           lastname: customerDetails?.last_name || '',
//           address: paylonyAccountData.address,
//           gender: paylonyAccountData.gender,
//           email: customerDetails?.email || '',
//           phone: customerDetails?.phone || '',
//           dob: paylonyAccountData.dob,
//         })
//       ).unwrap();
//       setShowPaylonyAccountForm(false);
//       dispatch(fetchCustomerDetails());
//       dispatch(checkVirtualAccount(token));
//       enqueueSnackbar('Paylony virtual account created successfully', { variant: 'success' });
//     } catch (error) {
//       console.error('Failed to create Paylony virtual account:', error.response?.data || error.message);
//       if (initialCustomerDetails) {
//         dispatch({ type: 'auth/fetchCustomerDetails/fulfilled', payload: { data: initialCustomerDetails } });
//       }
//       enqueueSnackbar('Failed to create Paylony virtual account. Please check your credentials or contact support.', { variant: 'error' });
//     }
//   };

//   const progressSteps = [
//     { id: 'account', label: 'Create Account', completed: true },
//     { id: 'customer', label: 'Create Customer Account', completed: true },
//     { id: 'virtual', label: 'Virtual Account', completed: virtualAccountCompleted },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-white to-indigo-100 p-6">
//       {(loading && showPaylonyAccountForm) && <WalletLoadingAnimation loading={loading} />} {/* For Paylony loading */}
//       {loading && <WalletLoadingAnimation loading={loading} />} {/* For other loading states */}
//       <div className="max-w-3xl mx-auto">
//         {/* Progress Bar */}
//         <div className="mb-8">
//           <h2 className="text-xl font-semibold text-black mb-4">Account Setup Progress</h2>
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
//           <h2 className="text-2xl font-bold text-black mb-4">Customer Profile</h2>
//           {loading ? (
//             <div className="text-center text-gray-500">Loading details...</div>
//           ) : error ? (
//             <div className="text-center text-red-500">{error}</div>
//           ) : customerDetails ? (
//             <div className="space-y-4">
//               <div className="flex items-center">
//                 <span className="w-32 text-gray-600 font-medium">First Name:</span>
//                 <span className="text-gray-800">{customerDetails?.first_name || 'N/A'}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="w-32 text-gray-600 font-medium">Last Name:</span>
//                 <span className="text-gray-800">{customerDetails?.last_name || 'N/A'}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="w-32 text-gray-600 font-medium">Email:</span>
//                 <span className="text-gray-800">{customerDetails?.email || 'N/A'}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="w-32 text-gray-600 font-medium">Phone Number:</span>
//                 <span className="text-gray-800">{customerDetails?.phone || 'N/A'}</span>
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

//         {/* Existing Virtual Account Button (Disabled if Paystack is created) */}
//         <button
//           onClick={handleCreateVirtualAccount}
//           className="mt-4 bg-gradient-to-r from-green-900 to-green-700 text-white p-2 rounded hover:bg-green-600 transition duration-300"
//           disabled={virtualAccountCompleted}
//         >
//           Create Virtual Account
//         </button>

//         {/* New Paylony Virtual Account Button (Green Gradient) */}
//         <button
//           onClick={handleCreatePaylonyAccount}
//           className="mt-4 ml-4 bg-gradient-to-r from-green-900 to-green-700 text-white p-2 rounded hover:bg-green-600 transition duration-300"
//           disabled={loading}
//         >
//           Create Paylony Virtual Account
//         </button>

//         {/* Existing Virtual Account Creation Modal */}
//         {showVirtualAccountForm && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md relative">
//               <button
//                 onClick={() => setShowVirtualAccountForm(false)}
//                 className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
//               >
//                 &times;
//               </button>
//               <h2 className="text-xl font-semibold mb-4">Create Virtual Account</h2>
//               <form onSubmit={handleVirtualAccountSubmit} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
//                   <input
//                     type="date"
//                     value={virtualAccountData.dob}
//                     onChange={(e) => setVirtualAccountData({ ...virtualAccountData, dob: e.target.value })}
//                     className="mt-1 block w-full p-2 border rounded-lg"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Address</label>
//                   <input
//                     type="text"
//                     value={virtualAccountData.address}
//                     onChange={(e) => setVirtualAccountData({ ...virtualAccountData, address: e.target.value })}
//                     className="mt-1 block w-full p-2 border rounded-lg"
//                     placeholder="Enter your address"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Gender</label>
//                   <select
//                     value={virtualAccountData.gender}
//                     onChange={(e) => setVirtualAccountData({ ...virtualAccountData, gender: e.target.value })}
//                     className="mt-1 block w-full p-2 border rounded-lg"
//                     required
//                   >
//                     <option value="">Select Gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </div>
//                 <button
//                   type="submit"
//                   className="w-full bg-gradient-to-r from-green-900 to-green-700 text-white p-2 rounded hover:bg-green-600 transition duration-300"
//                   disabled={loading}
//                 >
//                   {loading ? 'Creating...' : 'Submit'}
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* New Paylony Virtual Account Creation Modal */}
//         {showPaylonyAccountForm && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md relative">
//               <button
//                 onClick={() => setShowPaylonyAccountForm(false)}
//                 className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
//               >
//                 &times;
//               </button>
//               <h2 className="text-xl font-semibold mb-4">Create Paylony Virtual Account</h2>
//               <form onSubmit={handlePaylonyAccountSubmit} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
//                   <input
//                     type="date"
//                     value={paylonyAccountData.dob}
//                     onChange={(e) => setPaylonyAccountData({ ...paylonyAccountData, dob: e.target.value })}
//                     className="mt-1 block w-full p-2 border rounded-lg"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Address</label>
//                   <input
//                     type="text"
//                     value={paylonyAccountData.address}
//                     onChange={(e) => setPaylonyAccountData({ ...paylonyAccountData, address: e.target.value })}
//                     className="mt-1 block w-full p-2 border rounded-lg"
//                     placeholder="Enter your address"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Gender</label>
//                   <div className="mt-1 space-y-2">
//                     <label className="inline-flex items-center">
//                       <input
//                         type="radio"
//                         value="male"
//                         checked={paylonyAccountData.gender === 'male'}
//                         onChange={(e) => setPaylonyAccountData({ ...paylonyAccountData, gender: e.target.value })}
//                         className="form-radio text-blue-600"
//                         required
//                       />
//                       <span className="ml-2">Male</span>
//                     </label>
//                     <label className="inline-flex items-center">
//                       <input
//                         type="radio"
//                         value="female"
//                         checked={paylonyAccountData.gender === 'female'}
//                         onChange={(e) => setPaylonyAccountData({ ...paylonyAccountData, gender: e.target.value })}
//                         className="form-radio text-blue-600"
//                         required
//                       />
//                       <span className="ml-2">Female</span>
//                     </label>
//                     <label className="inline-flex items-center">
//                       <input
//                         type="radio"
//                         value="other"
//                         checked={paylonyAccountData.gender === 'other'}
//                         onChange={(e) => setPaylonyAccountData({ ...paylonyAccountData, gender: e.target.value })}
//                         className="form-radio text-blue-600"
//                         required
//                       />
//                       <span className="ml-2">Other</span>
//                     </label>
//                   </div>
//                 </div>
//                 <button
//                   type="submit"
//                   className="w-full bg-gradient-to-r from-green-900 to-green-700 text-white p-2 rounded hover:bg-green-600 transition duration-300"
//                   disabled={loading}
//                 >
//                   {loading ? 'Creating...' : 'Submit'}
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Profile;


import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomerDetails, createPaylonyVirtualAccount, checkVirtualAccount, fetchPaylonyAccounts } from '../../redux/authSlice';
import { useSnackbar } from 'notistack';
import WalletLoadingAnimation from '../../resources/wallet';

const Profile = () => {
  const dispatch = useDispatch();
  const { loading, customerDetails, error, virtualAccountCompleted, paylonyAccounts } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');
  const [showVirtualAccountForm, setShowVirtualAccountForm] = useState(false);
  const [showPaylonyAccountForm, setShowPaylonyAccountForm] = useState(false);
  const [virtualAccountData, setVirtualAccountData] = useState({
    dob: '',
    address: '',
    gender: '',
  });
  const [paylonyAccountData, setPaylonyAccountData] = useState({
    dob: '',
    address: '',
    gender: '',
  });
  const [initialCustomerDetails, setInitialCustomerDetails] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  console.log('Virtual Account Completed:', virtualAccountCompleted);
  console.log('Customer Details:', customerDetails);
  console.log('Paylony Accounts:', paylonyAccounts);
  console.log('Loading State:', loading);
  console.log('ENV Details:', import.meta.env);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) {
        dispatch(fetchCustomerDetails()).then((action) => {
          console.log('Fetched Customer Details:', action.payload);
          setInitialCustomerDetails(action.payload.data || {});
        });
        dispatch(checkVirtualAccount(token)).then((action) => {
          console.log('Check Virtual Account Result:', action.payload);
        });
        dispatch(fetchPaylonyAccounts(token)).then((action) => {
          console.log('Fetched Paylony Accounts:', action.payload);
        });
      } else {
        console.warn('Token not available, delaying fetch...');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [dispatch, token]);

  const handleCreateVirtualAccount = () => {
    console.log('Paystack Button Clicked');
    if (!virtualAccountCompleted) {
      setShowVirtualAccountForm(true);
    }
  };

  const handleVirtualAccountSubmit = async (e) => {
    e.preventDefault();
    if (!virtualAccountData.dob || !virtualAccountData.address || !virtualAccountData.gender) {
      enqueueSnackbar('Please fill in all fields (DOB, Address, Gender)', { variant: 'error' });
      return;
    }
    try {
      await dispatch(
        createPaylonyVirtualAccount({
          token,
          customerId: customerDetails?.id,
          dob: virtualAccountData.dob,
          address: virtualAccountData.address,
          gender: virtualAccountData.gender,
        })
      ).unwrap();
      setShowVirtualAccountForm(false);
      dispatch(fetchCustomerDetails());
      dispatch(checkVirtualAccount(token));
      dispatch(fetchPaylonyAccounts(token));
      enqueueSnackbar('Virtual account created successfully', { variant: 'success' });
    } catch (error) {
      console.error('Failed to create virtual account:', error);
      enqueueSnackbar('Failed to create virtual account. Please try again.', { variant: 'error' });
    }
  };

  const handleCreatePaylonyAccount = () => {
    console.log('Paylony Button Clicked');
    setShowPaylonyAccountForm(true);
  };
const handlePaylonyAccountSubmit = async (e) => {
  e.preventDefault();
  if (!paylonyAccountData.dob || !paylonyAccountData.address || !paylonyAccountData.gender) {
    enqueueSnackbar('Please fill in all fields (DOB, Address, Gender)', { variant: 'error' });
    return;
  }
  try {
    await dispatch(
      createPaylonyVirtualAccount({
        token,
        customerId: customerDetails?.id,
        firstname: customerDetails?.first_name || '',
        lastname: customerDetails?.last_name || '',
        address: paylonyAccountData.address,
        gender: paylonyAccountData.gender,
        email: customerDetails?.email || '',
        phone: customerDetails?.phone || '',
        dob: paylonyAccountData.dob,
      })
    ).unwrap();
    setShowPaylonyAccountForm(false);
    dispatch(fetchCustomerDetails());
    dispatch(checkVirtualAccount(token));
    dispatch(fetchPaylonyAccounts(token)); // Ensure this is updated to use backend
    enqueueSnackbar('Paylony virtual account created successfully', { variant: 'success' });
  } catch (error) {
    console.error('Failed to create Paylony virtual account:', error.response?.data || error.message);
    if (initialCustomerDetails) {
      dispatch({ type: 'auth/fetchCustomerDetails/fulfilled', payload: { data: initialCustomerDetails } });
    }
    enqueueSnackbar('Failed to create Paylony virtual account. Please check your credentials or contact support.', { variant: 'error' });
  }
};
  const progressSteps = [
    { id: 'account', label: 'Create Account', completed: true },
    { id: 'customer', label: 'Create Customer Account', completed: true },
    { id: 'virtual', label: 'Virtual Account', completed: virtualAccountCompleted },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-100 p-6">
      {(loading && showPaylonyAccountForm) && <WalletLoadingAnimation loading={loading} />}
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
                <span className="text-gray-800">{customerDetails?.first_name || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 text-gray-600 font-medium">Last Name:</span>
                <span className="text-gray-800">{customerDetails?.last_name || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 text-gray-600 font-medium">Email:</span>
                <span className="text-gray-800">{customerDetails?.email || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 text-gray-600 font-medium">Phone Number:</span>
                <span className="text-gray-800">{customerDetails?.phone || 'N/A'}</span>
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
              {paylonyAccounts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mt-4">Paylony Virtual Account Details</h3>
                  {paylonyAccounts.map((account, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center">
                        <span className="w-32 text-gray-600 font-medium">Account Number:</span>
                        <span className="text-gray-800">{account.account_number || 'N/A'}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32 text-gray-600 font-medium">Account Name:</span>
                        <span className="text-gray-800">{account.account_name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32 text-gray-600 font-medium">Bank:</span>
                        <span className="text-gray-800">{account.bank || 'N/A'}</span>
                      </div>
                      {index < paylonyAccounts.length - 1 && <hr className="my-2 border-gray-200" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500">No details available</div>
          )}
        </div>

        {/* Existing Virtual Account Button */}
        <button
          onClick={handleCreateVirtualAccount}
          className="mt-4 bg-gradient-to-r from-green-900 to-green-700 text-white p-2 rounded hover:bg-green-600 transition duration-300"
          disabled={virtualAccountCompleted}
        >
          Create Virtual Account
        </button>

        {/* Paylony Virtual Account Button */}
        <button
          onClick={handleCreatePaylonyAccount}
          className="mt-4 ml-4 bg-gradient-to-r from-green-900 to-green-700 text-white p-2 rounded hover:bg-green-600 transition duration-300"
          disabled={loading}
        >
          Create Paylony Virtual Account
        </button>

        {/* Existing Virtual Account Creation Modal */}
        {showVirtualAccountForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md relative">
              <button
                onClick={() => setShowVirtualAccountForm(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold mb-4">Create Virtual Account</h2>
              <form onSubmit={handleVirtualAccountSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    value={virtualAccountData.dob}
                    onChange={(e) => setVirtualAccountData({ ...virtualAccountData, dob: e.target.value })}
                    className="mt-1 block w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    value={virtualAccountData.address}
                    onChange={(e) => setVirtualAccountData({ ...virtualAccountData, address: e.target.value })}
                    className="mt-1 block w-full p-2 border rounded-lg"
                    placeholder="Enter your address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    value={virtualAccountData.gender}
                    onChange={(e) => setVirtualAccountData({ ...virtualAccountData, gender: e.target.value })}
                    className="mt-1 block w-full p-2 border rounded-lg"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-900 to-green-700 text-white p-2 rounded hover:bg-green-600 transition duration-300"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Submit'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Paylony Virtual Account Creation Modal */}
        {showPaylonyAccountForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md relative">
              <button
                onClick={() => setShowPaylonyAccountForm(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold mb-4">Create Paylony Virtual Account</h2>
              <form onSubmit={handlePaylonyAccountSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    value={paylonyAccountData.dob}
                    onChange={(e) => setPaylonyAccountData({ ...paylonyAccountData, dob: e.target.value })}
                    className="mt-1 block w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    value={paylonyAccountData.address}
                    onChange={(e) => setPaylonyAccountData({ ...paylonyAccountData, address: e.target.value })}
                    className="mt-1 block w-full p-2 border rounded-lg"
                    placeholder="Enter your address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <div className="mt-1 space-y-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="Male"
                        checked={paylonyAccountData.gender === 'Male'}
                        onChange={(e) => setPaylonyAccountData({ ...paylonyAccountData, gender: e.target.value })}
                        className="form-radio text-blue-600"
                        required
                      />
                      <span className="ml-2">Male</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="Female"
                        checked={paylonyAccountData.gender === 'Female'}
                        onChange={(e) => setPaylonyAccountData({ ...paylonyAccountData, gender: e.target.value })}
                        className="form-radio text-blue-600"
                        required
                      />
                      <span className="ml-2">Female</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="other"
                        checked={paylonyAccountData.gender === 'other'}
                        onChange={(e) => setPaylonyAccountData({ ...paylonyAccountData, gender: e.target.value })}
                        className="form-radio text-blue-600"
                        required
                      />
                      <span className="ml-2">Other</span>
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-900 to-green-700 text-white p-2 rounded hover:bg-green-600 transition duration-300"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Submit'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;