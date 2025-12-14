// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';

// import { buyData, fetchWalletBalance } from '../../redux/store/airtimeSlice' 
// import WalletLoadingAnimation from '../../resources/wallet';
// import { useSnackbar } from 'notistack';
// import mtnPlans from '../../component/plans/MTN';
// import gloPlans from '../../component/plans/GLO';
// import airtelPlans from '../../component/plans/AIRTEL';
// import nineMobilePlans from '../../component/plans/9MOBILE';


// function DataPage() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { loading, error, walletBalance, transactions } = useSelector((state) => state.wallet);
//   const token = useSelector((state) => state.auth.token) || localStorage.getItem('token');
//   const { enqueueSnackbar } = useSnackbar();

//   const [number, setNumber] = useState('');
//   const [selectedPlan, setSelectedPlan] = useState(null); // Now an object
//   const [selectedNetwork, setSelectedNetwork] = useState('MTN');
//   const [selectedCategory, setSelectedCategory] = useState('All');

//   const networkPlans = {
//     MTN: mtnPlans,
//     GLO: gloPlans,
//     AIRTEL: airtelPlans,
//     '9MOBILE': nineMobilePlans,
//   };

//   useEffect(() => {
//     if (token) {
//       dispatch(fetchWalletBalance(token));
//     }
//   }, [dispatch, token]);

//   const categorizePlan = (plan) => {
//     const lowerName = plan.name.toLowerCase();
//     if (lowerName.includes('daily') || lowerName.includes('1 day') || lowerName.includes('2 days')) return 'Daily';
//     if (lowerName.includes('weekly') || lowerName.includes('7 days')) return 'Weekly';
//     if (lowerName.includes('monthly') || lowerName.includes('30 days') || lowerName.includes('1 month')) return 'Monthly';
//     return 'Other'; // For others, but we'll include in All
//   };

//   const filteredPlans = networkPlans[selectedNetwork]
//     .filter((plan) => {
//       if (selectedCategory === 'All') return true;
//       return categorizePlan(plan) === selectedCategory;
//     })
//     .sort((a, b) => a.price - b.price); // Sort by price ascending

//   const handlePlanSelect = (plan) => {
//     setSelectedPlan(plan);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!number || !selectedPlan) {
//       enqueueSnackbar('Please enter a phone number and select a data plan', { variant: 'error' });
//       return;
//     }
//     if (number.length !== 11) {
//       enqueueSnackbar('Enter a valid 11-digit phone number', { variant: 'error' });
//       return;
//     }
//     if (walletBalance < selectedPlan.price) {
//       enqueueSnackbar('Insufficient balance. Please fund your wallet.', { variant: 'error' });
//       return;
//     }

//     try {
//       await dispatch(
//         buyData({
//           coded: selectedPlan.coded,
//           number,
//           price: selectedPlan.price,
//           token,
//         })
//       ).unwrap();
//       enqueueSnackbar('Data purchase successful', { variant: 'success' });
//       dispatch(fetchWalletBalance(token));
//       setNumber('');
//       setSelectedPlan(null);
//       navigate('/dashboard');
//     } catch (error) {
//       enqueueSnackbar(error || 'Data purchase failed. Please try again.', { variant: 'error' });
//     }
//   };

//   return (
//     <div className="pt-4 pb-4 pl-0 pr-0 md:p-6">
//       {loading && <WalletLoadingAnimation />}
//       <div className="rounded-3xl p-6 md:p-8 transform transition-all hover:scale-102 duration-300">
//         <h2 className="text-2xl font-poppins font-bold text-gray-800 mb-6 text-center md:text-left">Buy Data</h2>
//         {error && <p className="text-red-500 text-center mb-4 font-medium">{error}</p>}
//         <p className="font-bold text-base md:text-lg text-gray-600 mb-4 md:mb-6">
//           Wallet Balance: {walletBalance || 0} NGN
//         </p>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-gray-700 text-sm font-semibold mb-2">Phone</label>
//             <input
//               type="tel"
//               value={number}
//               onChange={(e) => setNumber(e.target.value)}
//               className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 placeholder-gray-400"
//               placeholder="Enter phone number"
//               required
//             />
//           </div>
//           <div className="flex space-x-4 mb-4">
//             {Object.keys(networkPlans).map((net) => (
//               <button
//                 key={net}
//                 type="button"
//                 onClick={() => setSelectedNetwork(net)}
//                 className={`px-4 py-2 rounded-lg ${selectedNetwork === net ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}
//               >
//                 {net}
//               </button>
//             ))}
//           </div>
//           <div className="flex space-x-4 mb-4">
//             {['All', 'Daily', 'Weekly', 'Monthly'].map((cat) => (
//               <button
//                 key={cat}
//                 type="button"
//                 onClick={() => setSelectedCategory(cat)}
//                 className={`px-4 py-2 rounded-lg ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
//               >
//                 {cat}
//               </button>
//             ))}
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-60 overflow-y-auto">
//             {filteredPlans.map((plan) => (
//               <div
//                 key={plan.coded}
//                 onClick={() => handlePlanSelect(plan)}
//                 className={`p-4 bg-white rounded-lg shadow cursor-pointer ${selectedPlan?.coded === plan.coded ? 'border-2 border-green-600' : ''}`}
//               >
//                 <p className="font-semibold">{plan.name}</p>
//                 <p className="text-green-700 font-bold">₦{plan.price}</p>
//               </div>
//             ))}
//           </div>
//           <div>
//             <label className="block text-gray-700 text-sm font-semibold mb-2">Amount (₦)</label>
//             <input
//               type="number"
//               value={selectedPlan ? selectedPlan.price : ''}
//               readOnly
//               className="w-full p-4 border border-gray-300 rounded-xl bg-gray-100 placeholder-gray-400"
//               placeholder="Select a plan to see amount"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-green-900 to-green-700 text-white p-4 rounded-xl hover:from-green-800 hover:to-green-600 transition-all duration-300 font-semibold text-xl shadow-lg hover:shadow-xl disabled:opacity-70"
//             disabled={loading || !selectedPlan}
//           >
//             {loading ? 'Processing...' : 'Buy Data'}
//           </button>
//         </form>
//         <button
//           onClick={() => navigate('/dashboard')}
//           className="mt-4 w-full bg-gray-200 text-gray-800 p-3 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold"
//         >
//           Back
//         </button>
//         <div className="mt-6">
//           <h3 className="text-2xl font-poppins font-semibold text-gray-700 mb-4">Transaction History</h3>
//           <div className="max-h-44 overflow-y-auto space-y-3">
//             {transactions
//               ?.filter((tx) => tx.type === 'data')
//               .map((tx) => (
//                 <div key={tx.reference} className="p-4 bg-gray-50 rounded-xl shadow-md">
//                   <p className="text-gray-800 font-medium">Phone: {tx.number}</p>
//                   <p className="text-green-700 font-bold">₦{tx.amount} ({tx.coded})</p>
//                   <p className="text-gray-500 text-sm">{new Date(tx.timestamp).toLocaleString()}</p>
//                 </div>
//               ))}
//             {transactions?.filter((tx) => tx.type === 'data').length === 0 && (
//               <p className="text-gray-500 text-center">No data transactions yet</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DataPage;



/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { buyData, fetchWalletBalance } from '../../redux/store/airtimeSlice' 
import WalletLoadingAnimation from '../../resources/wallet';
import { useSnackbar } from 'notistack';
import mtnPlans from '../../component/plans/MTN';
import gloPlans from '../../component/plans/GLO';
import airtelPlans from '../../component/plans/AIRTEL';
import nineMobilePlans from '../../component/plans/9MOBILE';


function DataPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, walletBalance, transactions } = useSelector((state) => state.wallet);
  const token = useSelector((state) => state.auth.token) || localStorage.getItem('token');
  const { enqueueSnackbar } = useSnackbar();

  const [number, setNumber] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null); // Now an object
  const [selectedNetwork, setSelectedNetwork] = useState('MTN');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const networkPlans = {
    MTN: mtnPlans,
    GLO: gloPlans,
    AIRTEL: airtelPlans,
    '9MOBILE': nineMobilePlans,
  };

  useEffect(() => {
    if (token) {
      dispatch(fetchWalletBalance(token));
    }
  }, [dispatch, token]);

  const categorizePlan = (plan) => {
    const lowerName = plan.name.toLowerCase();
    if (lowerName.includes('daily') || lowerName.includes('1 day') || lowerName.includes('2 days')) return 'Daily';
    if (lowerName.includes('weekly') || lowerName.includes('7 days')) return 'Weekly';
    if (lowerName.includes('monthly') || lowerName.includes('30 days') || lowerName.includes('1 month')) return 'Monthly';
    return 'Other'; // For others, but we'll include in All
  };

  const filteredPlans = networkPlans[selectedNetwork]
    .filter((plan) => {
      if (selectedCategory === 'All') return true;
      return categorizePlan(plan) === selectedCategory;
    })
    .sort((a, b) => a.price - b.price); // Sort by price ascending

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!number || !selectedPlan) {
      enqueueSnackbar('Please enter a phone number and select a data plan', { variant: 'error' });
      return;
    }
    if (number.length !== 11) {
      enqueueSnackbar('Enter a valid 11-digit phone number', { variant: 'error' });
      return;
    }
    if (walletBalance < selectedPlan.price) {
      enqueueSnackbar('Insufficient balance. Please fund your wallet.', { variant: 'error' });
      return;
    }

    try {
      await dispatch(
        buyData({
          coded: selectedPlan.coded,
          number,
          price: selectedPlan.price,
          token,
        })
      ).unwrap();
      enqueueSnackbar('Data purchased successfully', { variant: 'success' });
      dispatch(fetchWalletBalance(token));
      setNumber('');
      setSelectedPlan(null);
      navigate('/dashboard');
    } catch (error) {
      enqueueSnackbar(error || 'Data purchase failed. Please try again.', { variant: 'error' });
    }
  };

  return (
    <div className="pt-4 pb-4 pl-0 pr-0 md:p-6 relative"> {/* Added relative here */}
      {/* Show loading animation during buyData submission */}
      {loading && <WalletLoadingAnimation />}

      <div className="rounded-3xl p-6 md:p-8 transform transition-all hover:scale-102 duration-300">
        <h2 className="text-2xl font-poppins font-bold text-gray-800 mb-6 text-center md:text-left">Buy Data</h2>
        {error && <p className="text-red-500 text-center mb-4 font-medium">{error}</p>}
        <p className="font-bold text-base md:text-lg text-gray-600 mb-4 md:mb-6">
          Wallet Balance: {walletBalance || 0} NGN
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Phone</label>
            <input
              type="tel"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 placeholder-gray-400"
              placeholder="Enter phone number"
              required
            />
          </div>
          <div className="flex space-x-4 mb-4">
            {Object.keys(networkPlans).map((net) => (
              <button
                key={net}
                type="button"
                onClick={() => setSelectedNetwork(net)}
                className={`px-4 py-2 rounded-lg ${selectedNetwork === net ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                {net}
              </button>
            ))}
          </div>
                {loading && <WalletLoadingAnimation />}
          <div className="flex space-x-4 mb-4">
            {['All', 'Daily', 'Weekly', 'Monthly'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-60 overflow-y-auto">
            {filteredPlans.map((plan) => (
              <div
                key={plan.coded}
                onClick={() => handlePlanSelect(plan)}
                className={`p-4 bg-white rounded-lg shadow cursor-pointer ${selectedPlan?.coded === plan.coded ? 'border-2 border-green-600' : ''}`}
              >
                <p className="font-semibold">{plan.name}</p>
                <p className="text-green-700 font-bold">₦{plan.price}</p>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Amount (₦)</label>
            <input
              type="number"
              value={selectedPlan ? selectedPlan.price : ''}
              readOnly
              className="w-full p-4 border border-gray-300 rounded-xl bg-gray-100 placeholder-gray-400"
              placeholder="Select a plan to see amount"
            />
          </div>
             {loading && <WalletLoadingAnimation />}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-900 to-green-700 text-white p-4 rounded-xl hover:from-green-800 hover:to-green-600 transition-all duration-300 font-semibold text-xl shadow-lg hover:shadow-xl disabled:opacity-70"
            disabled={loading || !selectedPlan}
          >
            {loading ? 'Processing...' : 'Buy Data'}
          </button>
        </form>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 w-full bg-gray-200 text-gray-800 p-3 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold"
        >
          Back
        </button>
        <div className="mt-6">
          <h3 className="text-2xl font-poppins font-semibold text-gray-700 mb-4">Transaction History</h3>
          <div className="max-h-44 overflow-y-auto space-y-3">
            {transactions
              ?.filter((tx) => tx.type === 'data')
              .map((tx) => (
                <div key={tx.reference} className="p-4 bg-gray-50 rounded-xl shadow-md">
                  <p className="text-gray-800 font-medium">Phone: {tx.number}</p>
                  <p className="text-green-700 font-bold">₦{tx.amount} ({tx.coded})</p>
                  <p className="text-gray-500 text-sm">{new Date(tx.timestamp).toLocaleString()}</p>
                </div>
              ))}
            {transactions?.filter((tx) => tx.type === 'data').length === 0 && (
              <p className="text-gray-500 text-center">No data transactions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataPage;