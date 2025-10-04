/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { buyElectricity } from '../../redux/store/electrictySlice';
import { fetchWalletBalance } from '../../redux/walletSlice';
import WalletLoadingAnimation from '../../resources/wallet';
import { useSnackbar } from 'notistack';
import electricityPlans from '../../component/plans/Electricty';


function ElectricityPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, transactions } = useSelector((state) => state.electricity);
  const { walletBalance } = useSelector((state) => state.wallet); // From wallet slice
  const token = useSelector((state) => state.auth.token) || localStorage.getItem('token');
  const { enqueueSnackbar } = useSnackbar();

  const [meterNumber, setMeterNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(electricityPlans[0].code); // Default to first

  const predefinedAmounts = [500, 1000, 2000, 2500, 3000, 3500, 4000];

  useEffect(() => {
    if (token) {
      dispatch(fetchWalletBalance(token));
    }
  }, [dispatch, token]);

  const handleAmountSelect = (selectedAmount) => {
    setAmount(selectedAmount.toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!meterNumber || !parsedAmount || parsedAmount < 500) {
      enqueueSnackbar('Please enter a valid meter number and amount (min 500)', { variant: 'error' });
      return;
    }
    if (meterNumber.length < 10) { // Basic validation, adjust as needed
      enqueueSnackbar('Enter a valid meter number (at least 10 digits)', { variant: 'error' });
      return;
    }
    if (walletBalance < parsedAmount) {
      enqueueSnackbar('Insufficient balance. Please fund your wallet.', { variant: 'error' });
      return;
    }

    try {
      await dispatch(
        buyElectricity({
          provider: selectedProvider,
          meterNumber,
          amount: parsedAmount,
          token,
        })
      ).unwrap();
      enqueueSnackbar('Electricity purchase successful', { variant: 'success' });
      dispatch(fetchWalletBalance(token));
      setMeterNumber('');
      setAmount('');
      navigate('/dashboard');
    } catch (error) {
      enqueueSnackbar(error || 'Electricity purchase failed. Please try again.', { variant: 'error' });
    }
  };

  return (
    <div className="pt-4 pb-4 pl-0 pr-0 md:p-6">
      {loading && <WalletLoadingAnimation />}
      <div className="rounded-3xl p-6 md:p-8 transform transition-all hover:scale-102 duration-300">
        <h2 className="text-2xl font-poppins font-bold text-gray-800 mb-6 text-center md:text-left">Buy Electricity</h2>
        {error && <p className="text-red-500 text-center mb-4 font-medium">{error}</p>}
        <p className="font-bold text-base md:text-lg text-gray-600 mb-4 md:mb-6">
          Wallet Balance: {walletBalance || 0} NGN
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Meter Number</label>
            <input
              type="text"
              value={meterNumber}
              onChange={(e) => setMeterNumber(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 placeholder-gray-400"
              placeholder="Enter meter number"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Provider (Disco)</label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50"
              required
            >
              {electricityPlans.map((plan) => (
                <option key={plan.code} value={plan.code}>
                  {plan.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Amount (₦) - Select or Enter</label>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-4">
              {predefinedAmounts.map((amt) => (
                <div
                  key={amt}
                  onClick={() => handleAmountSelect(amt)}
                  className={`p-3 bg-white rounded-lg shadow cursor-pointer text-center font-semibold ${parseFloat(amount) === amt ? 'border-2 border-green-600' : ''}`}
                >
                  ₦{amt}
                </div>
              ))}
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 placeholder-gray-400"
              placeholder="Or enter custom amount (min 500)"
              min="500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-900 to-green-700 text-white p-4 rounded-xl hover:from-green-800 hover:to-green-600 transition-all duration-300 font-semibold text-xl shadow-lg hover:shadow-xl disabled:opacity-70"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Buy Electricity'}
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
              ?.filter((tx) => tx.type === 'electricity')
              .map((tx) => (
                <div key={tx.reference} className="p-4 bg-gray-50 rounded-xl shadow-md">
                  <p className="text-gray-800 font-medium">Meter: {tx.meterNumber}</p>
                  <p className="text-green-700 font-bold">₦{tx.amount} ({tx.provider})</p>
                  <p className="text-gray-500 text-sm">{new Date(tx.timestamp).toLocaleString()}</p>
                </div>
              ))}
            {transactions?.filter((tx) => tx.type === 'electricity').length === 0 && (
              <p className="text-gray-500 text-center">No electricity transactions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ElectricityPage;