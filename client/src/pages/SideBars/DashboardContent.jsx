

/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWalletBalance, checkWalletBalance } from '../../redux/walletSlice';
import { fetchDashboard, logout, fundWallet,  } from '../../redux/authSlice'; 
import WalletLoadingAnimation from '../../resources/wallet';
import { useNavigate } from 'react-router-dom';
import AirtimePage from './AirtimePage';
import DataPage from './DataPage';
import TransferPage from './TransferPage';
import axios from 'axios';

const Transfer = () => <div><TransferPage /></div>;
const Data = () => <div><DataPage /></div>;
const Airtime = () => <div> <AirtimePage/> </div>;
const CableTV = () => <div>Cable TV Component</div>;
const Electricity = () => <div>Electricity Component</div>;

function DashboardContent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {walletBalance, checkBalanceData, } = useSelector((state) => state.wallet);
  const { loading, dashboardData, error} = useSelector((state) => state.auth); // walletBalance is assumed to be updated by fetchWalletBalance
  const token = localStorage.getItem('token');
  const [fundingAmount, setFundingAmount] = useState('');
  const [fundingUrl, setFundingUrl] = useState(null);
  const [fundingReference, setFundingReference] = useState(null);
  const [showFundingForm, setShowFundingForm] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('');
  const [content, setContent] = useState(<DashboardContent />);

  const handleNavigation = (component) => {
    setContent(component);
    if (window.innerWidth < 768) setIsMenuOpen(false);
  };

  const handleMenuClick = (component, menuName) => {
    setActiveMenu(menuName);
    handleNavigation(component);
  };
    const handleCheckBalance = () => {
    dispatch(checkWalletBalance(token));
  };

  useEffect(() => {
    if (token) {
      dispatch(fetchDashboard(token));
      dispatch(fetchWalletBalance(token)); // Dispatch fetchWalletBalance to get the latest balance
    }
  }, [dispatch, token]);

  const fetchPaylonyTransactions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/wallet/fetch-paylony-transactions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success && response.data.wallet) {
        dispatch({ type: 'auth/updateWalletBalance', payload: { amount: response.data.wallet.balance } });
      }
    } catch (error) {
      console.error('Error fetching Paylony transactions:', error);
    }
  };

  const updateSpecificTransaction = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/wallet/fetch-and-update-balance/202509061722427362561/paylony`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        dispatch({ type: 'auth/updateWalletBalance', payload: { amount: response.data.walletBalance } });
        dispatch(fetchDashboard(token)); // Refresh dashboard data
      }
    } catch (error) {
      console.error('Error updating specific transaction:', error);
    }
  };

  useEffect(() => {
    fetchPaylonyTransactions();
  }, [token]);

  const walletBalanceFromData = dashboardData?.user?.wallet?.balance || 0;
  const virtualBalance = dashboardData?.user?.paylonyVirtualAccountDetails?.balance || 0;
  const totalBalance = (walletBalance || walletBalanceFromData) + virtualBalance; // Use walletBalance from state if available, else fallback to walletBalanceFromData
  const allTransactions = [
    ...(dashboardData?.user?.wallet?.transactions || []),
    ...(dashboardData?.user?.paylonyVirtualAccountDetails?.transactions || [])
  ];
  const income = allTransactions
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0) || 0;
  const expenses = allTransactions
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0) || 0;
  const recentTransactions = allTransactions
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
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
            <div>
      <button onClick={handleCheckBalance} disabled={loading}>
        Check Balance
      </button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {checkBalanceData && (
        <div>
          <p>Balance: ₦{checkBalanceData.balance}</p>
          <p>Account: {checkBalanceData.dva_account_number}</p>
          <p>Last Updated: {checkBalanceData.last_updated}</p>
        </div>
      )}
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
                  setShowFundingForm(true);
                  setFundingAmount('');
                }}
              >
                <span className="text-lg">Add Money</span>
              </button>
              <button onClick={() => handleMenuClick(<TransferPage/>, 'transfer')}
               className="bg-orange-500 text-white p-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center h-16 w-full">
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
                  {transaction.details?.description || `${transaction.type} transaction` || transaction.reference}
                  <span className="text-gray-500 ml-2">
                    {new Date(transaction.timestamp || Date.now()).toLocaleString('en-US', {
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
        {/* Notifications, FAQs, and Support Team Section */}
        <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="bg-gradient-to-r from-green-900 to-green-700  text-white p-3 rounded-lg w-full md:w-auto">
            Notifications
          </div>
          <div className="bg-gradient-to-r from-green-900 to-green-700  text-white p-3 rounded-lg w-full md:w-auto">
            <p>FAQs: Please go through them to have a better knowledge of this platform</p>
            <button className="mt-2 bg-blue-700 text-white p-2 rounded-lg w-full md:w-auto">FAQs</button>
          </div>
          <div className="bg-gradient-to-r from-green-900 to-green-700  text-white p-3 rounded-lg w-full md:w-auto">
            <p>Support Team: Have anything to say to us? Please contact our Support Team on Whatsapp</p>
            <button className="mt-2 bg-green-500 text-white p-2 rounded-lg w-full md:w-auto">Whatsapp us</button>
            <button className="mt-2 bg-green-500 text-white p-2 rounded-lg w-full md:w-auto">Join Our Whatsapp group</button>
          </div>
        </div>
        {/* Quick Actions Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center h-32">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-2xl">📱</span>
            </div>
            <p className="mt-2 text-gray-800">Airtime TopUp</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center h-32">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">📶</span>
            </div>
            <p className="mt-2 text-gray-800">Buy Data</p>
          </div>
          <div className="bg-gradient-to-r from-green-900 to-green-700 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center h-32">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">💸</span>
            </div>
            <p className="mt-2">Airtime to cash</p>
          </div>
          <div className="bg-gradient-to-r from-green-900 to-green-700 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center h-32">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">💡</span>
            </div>
            <p className="mt-2">Electricity Bills</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center h-32">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">📺</span>
            </div>
            <p className="mt-2 text-gray-800">Cable Subscription</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center h-32">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">💳</span>
            </div>
            <p className="mt-2 text-gray-800">Bonus to wallet</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center h-32">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">📩</span>
            </div>
            <p className="mt-2 text-gray-800">Bulk SMS</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center h-32">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎓</span>
            </div>
            <p className="mt-2 text-gray-800">Result Checker</p>
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
                    <div>{transaction.details?.description || transaction.provider || transaction.reference}</div>
                    <div className="text-gray-500 text-sm">
                      {new Date(transaction.timestamp || Date.now()).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div
                  className={`text-${
                    transaction.type === 'credit' ? 'green' : 'red'
                  }-600 font-semibold`}
                >
                  {transaction.type === 'credit' ? '+NGN' : '-NGN'} {transaction.amount?.toFixed(2) || 0}
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















































