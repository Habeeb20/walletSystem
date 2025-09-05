/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WalletAnimation from '../../resources/wallet';

function DataPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState('MTN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history] = useState([
    { id: 1, phone: '08012345678', amount: '1500', network: 'MTN', date: '2025-09-04 15:00' },
    { id: 2, phone: '09087654321', amount: '800', network: 'Glo', date: '2025-09-03 11:30' },
  ]);

  const networks = [
    { name: 'MTN', color: '#F2D638FF' },
    { name: 'Airtel', color: '#FF0055FF' },
    { name: 'Glo', color: '#00B900' },
    { name: '9mobile', color: '#5E8000FF' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone || !amount || amount <= 0) {
      setError('Please enter a valid phone number and amount.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setError('');
      alert(`Purchased ₦${amount} data for ${phone} on ${network}`);
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="pt-4 pb-4 pl-0 pr-0 md:p-6">
      {loading && <WalletAnimation />}
      <div className="rounded-3xl  p-6 md:p-8 transform transition-all hover:scale-102 duration-300">
        <h2 className="text-2xl font-poppins font-bold text-gray-800 mb-6 text-center md:text-left">Data</h2>
        {error && <p className="text-red-500 text-center mb-4 font-medium">{error}</p>}
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
            <label className="block text-gray-700 text-sm font-semibold mb-2">Amount (₦)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 placeholder-gray-400"
              placeholder="Enter amount"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Network</label>
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50"
            >
              {networks.map((net) => (
                <option key={net.name} value={net.name} style={{ backgroundColor: net.color, color: 'white' }}>
                  {net.name}
                </option>
              ))}
            </select>
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
            {history.map((tx) => (
              <div key={tx.id} className="p-4 bg-gray-50 rounded-xl shadow-md">
                <p className="text-gray-800 font-medium">Phone: {tx.phone}</p>
                <p className="text-green-700 font-bold">₦{tx.amount} ({tx.network})</p>
                <p className="text-gray-500 text-sm">{tx.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataPage;