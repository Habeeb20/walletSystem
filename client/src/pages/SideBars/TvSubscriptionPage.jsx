/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import gotvPlans from '../../component/plans/GOTV';
import dstvPlans from '../../component/plans/DSTV';
import startimesPlans from "../../component/plans/Startimes"
import showmaxPlans from '../../component/plans/Showmax';
import { buyTvSubscription,clearError } from '../../redux/store/tvSlice';
import { fetchWalletBalance } from '../../redux/walletSlice';

import WalletLoadingAnimation from '../../resources/wallet';
import { useSnackbar } from 'notistack';


function TvSubscriptionPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, transactions } = useSelector((state) => state.tvSubscription || { loading: false, error: null, transactions: [] });
  const { walletBalance } = useSelector((state) => state.wallet || { walletBalance: 0 });
  const token = useSelector((state) => state.auth?.token) || localStorage.getItem('token');
  const { enqueueSnackbar } = useSnackbar();

  const [number, setNumber] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState('DStv');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const providerPlans = {
    DStv: dstvPlans,
    GOtv: gotvPlans,
    StarTimes: startimesPlans,
    Showmax: showmaxPlans,
  };

  useEffect(() => {
    if (token) {
      dispatch(fetchWalletBalance(token));
    }
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, token]);

  const categorizePlan = (plan) => {
    const lowerName = plan.name.toLowerCase();
    if (lowerName.includes('weekly') || lowerName.includes('1 week')) return 'Weekly';
    if (lowerName.includes('monthly') || lowerName.includes('1 month') || lowerName.includes('3 months') || lowerName.includes('6 months') || lowerName.includes('yearly')) return 'Monthly';
    return 'Other';
  };

  const filteredPlans = (providerPlans[selectedProvider] || [])
    .filter((plan) => {
      if (selectedCategory === 'All') return true;
      return categorizePlan(plan) === selectedCategory;
    })
    .sort((a, b) => a.price - b.price);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!number || !selectedPlan) {
      enqueueSnackbar('Please enter a valid number and select a plan', { variant: 'error' });
      return;
    }
    if (number.length < 8) { // Basic validation for smartcard/account number
      enqueueSnackbar('Enter a valid number (at least 8 digits)', { variant: 'error' });
      return;
    }
    if (walletBalance < selectedPlan.price) {
      enqueueSnackbar('Insufficient balance. Please fund your wallet.', { variant: 'error' });
      return;
    }

    try {
      await dispatch(
        buyTvSubscription({
          coded: selectedPlan.coded,
          number,
          price: selectedPlan.price,
          token,
        })
      ).unwrap();
      enqueueSnackbar('TV subscription purchase successful', { variant: 'success' });
      dispatch(fetchWalletBalance(token));
      setNumber('');
      setSelectedPlan(null);
      navigate('/dashboard');
    } catch (err) {
      enqueueSnackbar(err || 'TV subscription purchase failed. Please try again.', { variant: 'error' });
    }
  };

  return (
    <div className=" pt-4 pb-4 pl-0 pr-0 md:p-6">
      {loading && <WalletLoadingAnimation />}
      <div className="rounded-3xl p-6 md:p-8 transform transition-all hover:scale-102 duration-300">
        <h2 className="text-3xl font-poppins font-bold text-gray-800 mb-6 text-center md:text-left tracking-tight">TV Subscription</h2>
        {error && <p className="text-red-500 text-center mb-4 font-medium bg-red-100 p-3 rounded-xl">{error}</p>}
        <p className="font-bold text-lg md:text-xl text-gray-700 mb-6 bg-green-50 p-4 rounded-xl shadow-inner">
          Wallet Balance: ₦{walletBalance.toLocaleString() || 0}
        </p>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2 uppercase tracking-wide">Account/Smartcard Number</label>
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 placeholder-gray-400 transition-all duration-200"
              placeholder="Enter account/smartcard number"
              required
            />
          </div>
          <div className="flex flex-wrap gap-3 mb-6">
            {Object.keys(providerPlans).map((prov) => (
              <button
                key={prov}
                type="button"
                onClick={() => setSelectedProvider(prov)}
                className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 shadow-md ${selectedProvider === prov ? 'bg-green-600 text-white scale-105' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              >
                {prov}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mb-6">
            {['All', 'Weekly', 'Monthly'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 shadow-md ${selectedCategory === cat ? 'bg-blue-600 text-white scale-105' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-80 overflow-y-auto p-4 bg-gray-50 rounded-xl shadow-inner">
            {filteredPlans.map((plan) => (
              <div
                key={plan.coded}
                onClick={() => handlePlanSelect(plan)}
                className={`p-4 bg-white rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${selectedPlan?.coded === plan.coded ? 'border-2 border-green-600 bg-green-50' : ''}`}
              >
                <p className="font-semibold text-gray-800 mb-1">{plan.name}</p>
                <p className="text-green-700 font-bold text-lg">₦{plan.price.toLocaleString()}</p>
              </div>
            ))}
            {filteredPlans.length === 0 && <p className="text-gray-500 col-span-full text-center">No plans available in this category</p>}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2 uppercase tracking-wide">Amount (₦)</label>
            <input
              type="number"
              value={selectedPlan ? selectedPlan.price : ''}
              readOnly
              className="w-full p-4 border border-gray-300 rounded-xl bg-gray-100 placeholder-gray-400 font-bold text-lg text-gray-800"
              placeholder="Select a plan to see amount"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-900 to-green-700 text-white p-4 rounded-xl hover:from-green-800 hover:to-green-600 transition-all duration-300 font-semibold text-xl shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading || !selectedPlan }
          >
            {loading ? 'Processing...' : 'Subscribe Now'}
          </button>
        </form>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-6 w-full bg-gray-200 text-gray-800 p-4 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold text-lg shadow-md"
        >
          Back to Dashboard
        </button>
        <div className="mt-8 border-t pt-6">
          <h3 className="text-2xl font-poppins font-semibold text-gray-700 mb-4 tracking-tight">Transaction History</h3>
          <div className="max-h-60 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-xl shadow-inner">
            {transactions
              ?.filter((tx) => tx.type === 'tv_subscription')
              .map((tx) => (
                <div key={tx.reference} className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                  <p className="text-gray-800 font-medium">Number: {tx.number}</p>
                  <p className="text-green-700 font-bold">₦{tx.amount.toLocaleString()} ({tx.coded})</p>
                  <p className="text-gray-500 text-sm">{new Date(tx.timestamp).toLocaleString()}</p>
                </div>
              ))}
            {transactions?.filter((tx) => tx.type === 'tv_subscription').length === 0 && (
              <p className="text-gray-500 text-center">No TV subscription transactions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TvSubscriptionPage;