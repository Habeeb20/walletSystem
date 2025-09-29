// /* eslint-disable no-unused-vars */
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import WalletAnimation from '../../resources/wallet';

// function DataPage() {
//   const navigate = useNavigate();
//   const [phone, setPhone] = useState('');
//   const [amount, setAmount] = useState('');
//   const [network, setNetwork] = useState('MTN');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [history] = useState([
//     { id: 1, phone: '08012345678', amount: '1500', network: 'MTN', date: '2025-09-04 15:00' },
//     { id: 2, phone: '09087654321', amount: '800', network: 'Glo', date: '2025-09-03 11:30' },
//   ]);

//   const networks = [
//     { name: 'MTN', color: '#F2D638FF' },
//     { name: 'Airtel', color: '#FF0055FF' },
//     { name: 'Glo', color: '#00B900' },
//     { name: '9mobile', color: '#5E8000FF' },
//   ];

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!phone || !amount || amount <= 0) {
//       setError('Please enter a valid phone number and amount.');
//       return;
//     }
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//       setError('');
//       alert(`Purchased ₦${amount} data for ${phone} on ${network}`);
//       navigate('/dashboard');
//     }, 2000);
//   };

//   return (
//     <div className="pt-4 pb-4 pl-0 pr-0 md:p-6">
//       {loading && <WalletAnimation />}
//       <div className="rounded-3xl  p-6 md:p-8 transform transition-all hover:scale-102 duration-300">
//         <h2 className="text-2xl font-poppins font-bold text-gray-800 mb-6 text-center md:text-left">Data</h2>
//         {error && <p className="text-red-500 text-center mb-4 font-medium">{error}</p>}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-gray-700 text-sm font-semibold mb-2">Phone</label>
//             <input
//               type="tel"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 placeholder-gray-400"
//               placeholder="Enter phone number"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-gray-700 text-sm font-semibold mb-2">Amount (₦)</label>
//             <input
//               type="number"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 placeholder-gray-400"
//               placeholder="Enter amount"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-gray-700 text-sm font-semibold mb-2">Network</label>
//             <select
//               value={network}
//               onChange={(e) => setNetwork(e.target.value)}
//               className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50"
//             >
//               {networks.map((net) => (
//                 <option key={net.name} value={net.name} style={{ backgroundColor: net.color, color: 'white' }}>
//                   {net.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-green-900 to-green-700 text-white p-4 rounded-xl hover:from-green-800 hover:to-green-600 transition-all duration-300 font-semibold text-xl shadow-lg hover:shadow-xl disabled:opacity-70"
//             disabled={loading}
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
//             {history.map((tx) => (
//               <div key={tx.id} className="p-4 bg-gray-50 rounded-xl shadow-md">
//                 <p className="text-gray-800 font-medium">Phone: {tx.phone}</p>
//                 <p className="text-green-700 font-bold">₦{tx.amount} ({tx.network})</p>
//                 <p className="text-gray-500 text-sm">{tx.date}</p>
//               </div>
//             ))}
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
import { buyData, fetchWalletBalance } from '../../redux/store/airtimeSlice';

import { useSnackbar } from 'notistack';
import WalletAnimation from '../../resources/wallet';

// Mock data plans (replace with actual API call to fetch plans if available)
const dataPlans = [
  { coded: 'MTN_100MB', name: 'MTN 100MB', price: 100 },
  { coded: 'MTN_500MB', name: 'MTN 500MB', price: 500 },
  { coded: 'Airtel_100MB', name: 'Airtel 100MB', price: 100 },
  { coded: 'Airtel_500MB', name: 'Airtel 500MB', price: 500 },
  { coded: 'Glo_200MB', name: 'Glo 200MB', price: 200 },
  { coded: '9mobile_100MB', name: '9mobile 100MB', price: 150 },
];

function DataPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, walletBalance, transactions } = useSelector((state) => state.wallet);
  const token = useSelector((state) => state.auth.token) || localStorage.getItem('token');
  const { enqueueSnackbar } = useSnackbar();

  const [phone, setPhone] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (token) {
      dispatch(fetchWalletBalance(token));
    }
  }, [dispatch, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !selectedPlan) {
      enqueueSnackbar('Please enter a phone number and select a data plan', { variant: 'error' });
      return;
    }
    if (phone.length !== 11) {
      enqueueSnackbar('Enter a valid 11-digit phone number', { variant: 'error' });
      return;
    }
    const selectedPlanData = dataPlans.find((plan) => plan.coded === selectedPlan);
    if (!selectedPlanData) {
      enqueueSnackbar('Invalid data plan selected', { variant: 'error' });
      return;
    }
    if (walletBalance < selectedPlanData.price) {
      enqueueSnackbar('Insufficient balance. Please fund your wallet.', { variant: 'error' });
      return;
    }

    try {
      await dispatch(
        buyData({
          coded: selectedPlan,
          phone,
          amount: selectedPlanData.price,
          token,
        })
      ).unwrap();
      enqueueSnackbar('Data purchase successful', { variant: 'success' });
      dispatch(fetchWalletBalance(token));
      setPhone('');
      setSelectedPlan('');
      setAmount('');
      navigate('/dashboard');
    } catch (error) {
      enqueueSnackbar(error || 'Data purchase failed. Please try again.', { variant: 'error' });
    }
  };

  return (
    <div className="pt-4 pb-4 pl-0 pr-0 md:p-6">
      {loading && <WalletAnimation />}
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 placeholder-gray-400"
              placeholder="Enter phone number"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Data Plan</label>
            <select
              value={selectedPlan}
              onChange={(e) => {
                setSelectedPlan(e.target.value);
                const plan = dataPlans.find((p) => p.coded === e.target.value);
                setAmount(plan ? plan.price.toString() : '');
              }}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50"
              required
            >
              <option value="">Select data plan</option>
              {dataPlans.map((plan) => (
                <option key={plan.coded} value={plan.coded}>
                  {plan.name} (₦{plan.price})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Amount (₦)</label>
            <input
              type="number"
              value={amount}
              readOnly
              className="w-full p-4 border border-gray-300 rounded-xl bg-gray-100 placeholder-gray-400"
              placeholder="Select a plan to see amount"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-900 to-green-700 text-white p-4 rounded-xl hover:from-green-800 hover:to-green-600 transition-all duration-300 font-semibold text-xl shadow-lg hover:shadow-xl disabled:opacity-70"
            disabled={loading}
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