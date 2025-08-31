// /* eslint-disable no-unused-vars */
// import React from 'react'
// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchDashboard, logout } from '../../redux/authSlice';
// import WalletLoadingAnimation from '../../resources/wallet';
// import { useNavigate } from 'react-router-dom';
// function DashboardContent() {
//   return (
//     <div>
//        <div className="p-6 pt-10 md:pt-4">
//     <div className="text-gray-700 text-lg">Welcome back, <span className="text-black font-bold">{useSelector((state) => state.auth.dashboardData?.user?.fullName) || localStorage.getItem('userFullName') || ''}</span></div>
//     <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
//       <div className="col-span-1 md:col-span-2">
//         <div className="bg-gradient-to-r from-green-900 to-green-700 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
//           <div>
//             <h3 className="text-sm">Total Balance</h3>
//             <h1 className="text-3xl font-bold">NGN 12,847.50</h1>
//           </div>
//           <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
//             <span className="text-2xl">💰</span>
//           </div>
//         </div>
//       </div>
//       <div className="grid grid-cols-1 gap-6">
//         <div className="bg-green-50 p-4 rounded-lg shadow-md flex items-center justify-between">
//           <div>
//             <h3 className="text-sm text-green-800">Income</h3>
//             <h1 className="text-2xl font-bold text-green-800">NGN 4,850.00</h1>
//           </div>
//           <span className="text-green-600 text-xl">⬆️</span>
//         </div>
//         <div className="bg-red-50 p-4 rounded-lg shadow-md flex items-center justify-between">
//           <div>
//             <h3 className="text-sm text-red-800">Expenses</h3>
//             <h1 className="text-2xl font-bold text-red-800">NGN 2,340.00</h1>
//           </div>
//           <span className="text-red-600 text-xl">⬇️</span>
//         </div>
//       </div>
//     </div>
//     <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//       <div>
//         <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
//         <div className="grid grid-cols-3 gap-4 mt-4">
//           <button className="bg-purple-500 text-white p-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center h-16 w-full">
//             <span className="text-lg">Add Money</span>
//           </button>
//           <button className="bg-orange-500 text-white p-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center h-16 w-full">
//             <span className="text-lg">Transfer</span>
//           </button>
//           <button className="bg-blue-500 text-white p-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center h-16 w-full">
//             <span className="text-lg">Airtime</span>
//           </button>
//           <button className="bg-pink-500 text-white p-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center h-16 w-full">
//             <span className="text-lg">Data</span>
//           </button>
//           <button className="bg-green-500 text-white p-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center h-16 w-full">
//             <span className="text-lg">Transfer</span>
//           </button>
//         </div>
//       </div>
//       <div>
//         <h3 className="text-lg font-semibold text-gray-800">Activity</h3>
//         <ul className="mt-4 space-y-2">
//           <li className="text-green-600 flex items-center"><span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>Payment received from Alex Johnson <span className="text-gray-500 ml-2">2 hours ago</span></li>
//           <li className="text-blue-600 flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>Card payment at Target <span className="text-gray-500 ml-2">5 hours ago</span></li>
//           <li className="text-purple-600 flex items-center"><span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>Monthly salary deposited <span className="text-gray-500 ml-2">1 day ago</span></li>
//         </ul>
//       </div>
//     </div>
//     <div className="mt-6">
//       <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
//       <div className="mt-4 space-y-4">
//         <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg shadow-md">
//           <div className="flex items-center">
//             <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">✔️</span>
//             <div>
//               <div>Payment from Emmanuel</div>
//               <div className="text-gray-500 text-sm">Today, 2:30 PM</div>
//             </div>
//           </div>
//           <div className="text-green-600 font-semibold">+NGN 2,500.00</div>
//         </div>
//         <div className="flex items-center justify-between bg-red-50 p-4 rounded-lg shadow-md">
//           <div className="flex items-center">
//             <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">🚛</span>
//             <div>
//               <div>1gb MTN sme</div>
//               <div className="text-gray-500 text-sm">Yesterday, 6:15 AM</div>
//             </div>
//           </div>
//           <div className="text-red-600 font-semibold">-NGN 15.99</div>
//         </div>
//         <div className="flex items-center justify-between bg-red-50 p-4 rounded-lg shadow-md">
//           <div className="flex items-center">
//             <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">⚡</span>
//             <div>
//               <div>Electricity</div>
//               <div className="text-gray-500 text-sm">Dec 5, 3:45 PM</div>
//             </div>
//           </div>
//           <div className="text-red-600 font-semibold">-NGN 89.99</div>
//         </div>
//         <div className="flex items-center justify-between bg-red-50 p-4 rounded-lg shadow-md">
//           <div className="flex items-center">
//             <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">📺</span>
//             <div>
//               <div>Cable TV</div>
//               <div className="text-gray-500 text-sm">Dec 14, 8:20 AM</div>
//             </div>
//           </div>
//           <div className="text-red-600 font-semibold">-NGN 5.45</div>
//         </div>
//       </div>
//       <a href="#" className="text-blue-600 mt-2 inline-block font-medium">View All →</a>
//     </div>
//   </div>
//     </div>
//   )
// }

// export default DashboardContent
































































/* eslint-disable no-unused-vars */
// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchDashboard, logout } from '../../redux/authSlice';
// import WalletLoadingAnimation from '../../resources/wallet';
// import { useNavigate } from 'react-router-dom';

// function DashboardContent() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loading, dashboardData, error } = useSelector((state) => state.auth);
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     if (token) {
//       dispatch(fetchDashboard(token));
//     }
//   }, [dispatch, token]);

//   const walletBalance = dashboardData?.user?.wallet?.balance || 0;
//   const virtualBalance = dashboardData?.user?.virtualAccountDetails?.balance || 0; // Assuming balance is tracked if applicable
//   const totalBalance = walletBalance + virtualBalance;
//   const income = dashboardData?.user?.wallet?.transactions
//     ?.filter((t) => t.type === 'credit')
//     .reduce((sum, t) => sum + t.amount, 0) || 0;
//   const expenses = dashboardData?.user?.wallet?.transactions
//     ?.filter((t) => t.type === 'debit')
//     .reduce((sum, t) => sum + t.amount, 0) || 0;
//   const recentTransactions = dashboardData?.user?.wallet?.transactions
//     ?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
//     .slice(0, 4) || [];

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate('/login');
//   };

//   return (
//     <div>
//       <div className="p-6 pt-10 md:pt-4">
//         <div className="text-gray-700 text-lg">
//           Welcome back,{' '}
//           <span className="text-black font-bold">
//             {dashboardData?.user?.fullName || localStorage.getItem('userFullName') || ''}
//           </span>
//         </div>
//         <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="col-span-1 md:col-span-2">
//             <div className="bg-gradient-to-r from-green-900 to-green-700 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
//               <div>
//                 <h3 className="text-sm">Total Balance</h3>
//                 <h1 className="text-3xl font-bold">NGN {totalBalance.toFixed(2)}</h1>
//               </div>
//               <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
//                 <span className="text-2xl">💰</span>
//               </div>
//             </div>
//           </div>
//           <div className="grid grid-cols-1 gap-6">
//             <div className="bg-green-50 p-4 rounded-lg shadow-md flex items-center justify-between">
//               <div>
//                 <h3 className="text-sm text-green-800">Income</h3>
//                 <h1 className="text-2xl font-bold text-green-800">NGN {income.toFixed(2)}</h1>
//               </div>
//               <span className="text-green-600 text-xl">⬆️</span>
//             </div>
//             <div className="bg-red-50 p-4 rounded-lg shadow-md flex items-center justify-between">
//               <div>
//                 <h3 className="text-sm text-red-800">Expenses</h3>
//                 <h1 className="text-2xl font-bold text-red-800">NGN {expenses.toFixed(2)}</h1>
//               </div>
//               <span className="text-red-600 text-xl">⬇️</span>
//             </div>
//           </div>
//         </div>
//         <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
//             <div className="grid grid-cols-3 gap-4 mt-4">
//               <button className="bg-purple-500 text-white p-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center h-16 w-full">
//                 <span className="text-lg">Add Money</span>
//               </button>
//               <button className="bg-orange-500 text-white p-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center h-16 w-full">
//                 <span className="text-lg">Transfer</span>
//               </button>
//               <button className="bg-blue-500 text-white p-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center h-16 w-full">
//                 <span className="text-lg">Airtime</span>
//               </button>
//               <button className="bg-pink-500 text-white p-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center h-16 w-full">
//                 <span className="text-lg">Data</span>
//               </button>
//               <button className="bg-green-500 text-white p-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center h-16 w-full">
//                 <span className="text-lg">Transfer</span>
//               </button>
//             </div>
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800">Activity</h3>
//             <ul className="mt-4 space-y-2">
//               {recentTransactions.map((transaction, index) => (
//                 <li
//                   key={index}
//                   className={`flex items-center ${
//                     transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
//                   }`}
//                 >
//                   <span className="w-2 h-2 bg-current rounded-full mr-2"></span>
//                   {transaction.details?.description || `${transaction.type} transaction`}
//                   <span className="text-gray-500 ml-2">
//                     {new Date(transaction.timestamp).toLocaleString('en-US', {
//                       hour: '2-digit',
//                       minute: '2-digit',
//                       hour12: true,
//                     })}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//         <div className="mt-6">
//           <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
//           <div className="mt-4 space-y-4">
//             {recentTransactions.map((transaction, index) => (
//               <div
//                 key={index}
//                 className={`flex items-center justify-between ${
//                   transaction.type === 'credit' ? 'bg-green-50' : 'bg-red-50'
//                 } p-4 rounded-lg shadow-md`}
//               >
//                 <div className="flex items-center">
//                   <span className="w-8 h-8 bg-current/10 rounded-full flex items-center justify-center mr-3">
//                     {transaction.type === 'credit' ? '✔️' : '🚛'}
//                   </span>
//                   <div>
//                     <div>{transaction.details?.description || transaction.provider}</div>
//                     <div className="text-gray-500 text-sm">
//                       {new Date(transaction.timestamp).toLocaleString()}
//                     </div>
//                   </div>
//                 </div>
//                 <div
//                   className={`text-${
//                     transaction.type === 'credit' ? 'green' : 'red'
//                   }-600 font-semibold`}
//                 >
//                   {transaction.type === 'credit' ? '+NGN' : '-NGN'} {transaction.amount.toFixed(2)}
//                 </div>
//               </div>
//             ))}
//           </div>
//           <a href="#" className="text-blue-600 mt-2 inline-block font-medium">View All →</a>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DashboardContent;








































/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboard, logout, fundWallet } from '../../redux/authSlice';
import WalletLoadingAnimation from '../../resources/wallet';
import { useNavigate } from 'react-router-dom';

function DashboardContent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, dashboardData, error } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');
  const [fundingAmount, setFundingAmount] = useState('');
  const [fundingUrl, setFundingUrl] = useState(null);
  const [fundingReference, setFundingReference] = useState(null);
  const [showFundingForm, setShowFundingForm] = useState(false); // New state to toggle form

  useEffect(() => {
    if (token) {
      dispatch(fetchDashboard(token));
    }
  }, [dispatch, token]);

  const walletBalance = dashboardData?.user?.wallet?.balance || 0;
  const virtualBalance = dashboardData?.user?.virtualAccountDetails?.balance || 0;
  const totalBalance = walletBalance + virtualBalance;
  const income = dashboardData?.user?.wallet?.transactions
    ?.filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0) || 0;
  const expenses = dashboardData?.user?.wallet?.transactions
    ?.filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0) || 0;
  const recentTransactions = dashboardData?.user?.wallet?.transactions
    ?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 4) || [];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleFundWallet = async () => {
    if (!token || !fundingAmount || parseFloat(fundingAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    try {
      const result = await dispatch(
        fundWallet({ token, amount: parseFloat(fundingAmount) })
      ).unwrap();
      setFundingUrl(result.url);
      setFundingReference(result.reference);
      if (result.url) window.location.href = result.url;
    } catch (error) {
      console.error('Funding failed:', error);
      alert('Failed to initiate funding');
    }
  };

  return (
    <div>
      <div className="p-6 pt-10 md:pt-4">
        <div className="text-gray-700 text-lg">
          Welcome back,{' '}
          <span className="text-black font-bold">
            {dashboardData?.user?.fullName || localStorage.getItem('userFullName') || ''}
          </span>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2">
            <div className="bg-gradient-to-r from-green-900 to-green-700 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
              <div>
                <h3 className="text-sm">Total Balance</h3>
                <h1 className="text-3xl font-bold">NGN {totalBalance.toFixed(2)}</h1>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-green-50 p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <h3 className="text-sm text-green-800">Income</h3>
                <h1 className="text-2xl font-bold text-green-800">NGN {income.toFixed(2)}</h1>
              </div>
              <span className="text-green-600 text-xl">⬆️</span>
            </div>
            <div className="bg-red-50 p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <h3 className="text-sm text-red-800">Expenses</h3>
                <h1 className="text-2xl font-bold text-red-800">NGN {expenses.toFixed(2)}</h1>
              </div>
              <span className="text-red-600 text-xl">⬇️</span>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <button
                className="bg-purple-500 text-white p-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center h-16 w-full"
                onClick={() => {
                  setShowFundingForm(true); // Toggle form visibility
                  setFundingAmount(''); // Reset amount
                }}
              >
                <span className="text-lg">Add Money</span>
              </button>
              <button className="bg-orange-500 text-white p-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center h-16 w-full">
                <span className="text-lg">Transfer</span>
              </button>
              <button className="bg-blue-500 text-white p-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center h-16 w-full">
                <span className="text-lg">Airtime</span>
              </button>
              <button className="bg-pink-500 text-white p-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center h-16 w-full">
                <span className="text-lg">Data</span>
              </button>
              <button className="bg-green-500 text-white p-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center h-16 w-full">
                <span className="text-lg">Transfer</span>
              </button>
            </div>
            {showFundingForm && (
              <div className="mt-4">
                <input
                  type="number"
                  value={fundingAmount}
                  onChange={(e) => setFundingAmount(e.target.value)}
                  placeholder="Enter amount (NGN)"
                  className="w-full p-2 border rounded-lg mb-2"
                />
                <button
                  onClick={handleFundWallet}
                  className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition duration-300 w-full"
                >
                  Fund Wallet
                </button>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Activity</h3>
            <ul className="mt-4 space-y-2">
              {recentTransactions.map((transaction, index) => (
                <li
                  key={index}
                  className={`flex items-center ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  <span className="w-2 h-2 bg-current rounded-full mr-2"></span>
                  {transaction.details?.description || `${transaction.type} transaction`}
                  <span className="text-gray-500 ml-2">
                    {new Date(transaction.timestamp).toLocaleString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
          <div className="mt-4 space-y-4">
            {recentTransactions.map((transaction, index) => (
              <div
                key={index}
                className={`flex items-center justify-between ${
                  transaction.type === 'credit' ? 'bg-green-50' : 'bg-red-50'
                } p-4 rounded-lg shadow-md`}
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-current/10 rounded-full flex items-center justify-center mr-3">
                    {transaction.type === 'credit' ? '✔️' : '🚛'}
                  </span>
                  <div>
                    <div>{transaction.details?.description || transaction.provider}</div>
                    <div className="text-gray-500 text-sm">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div
                  className={`text-${
                    transaction.type === 'credit' ? 'green' : 'red'
                  }-600 font-semibold`}
                >
                  {transaction.type === 'credit' ? '+NGN' : '-NGN'} {transaction.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <a href="#" className="text-blue-600 mt-2 inline-block font-medium">View All →</a>
        </div>
      </div>
    </div>
  );
}

export default DashboardContent;