import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WalletAnimation from '../../resources/wallet';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

function TransferPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');
  const [loading, setLoading] = useState(false);
  const { dashboardData } = useSelector((state) => state.auth);
  const walletBalance = dashboardData?.user?.balance || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate recipient is 10 digits
    const recipientDigits = recipient.replace(/[^0-9]/g, '');
    if (recipientDigits.length !== 10) {
      enqueueSnackbar('Recipient must be a valid 10-digit account number.', { variant: 'error' });
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      enqueueSnackbar('Please enter a valid amount.', { variant: 'error' });
      return;
    }
    if (parseFloat(amount) > walletBalance) {
      enqueueSnackbar('Insufficient balance. Please fund your wallet.', { variant: 'error' });
      return;
    }
    if (!narration.trim()) {
      enqueueSnackbar('Please provide a narration for the transfer.', { variant: 'error' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/transfer/transferfunds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Assuming auth token is handled via middleware or headers
        },
        body: JSON.stringify({
          account_number: recipientDigits,
          amount: parseFloat(amount),
          narration,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 400 && result.error === 'Insufficient wallet balance') {
          enqueueSnackbar('Insufficient balance. Please fund your wallet.', { variant: 'error' });
        } else {
          enqueueSnackbar(result.error || 'Transfer failed. Please try again.', { variant: 'error' });
        }
        setLoading(false);
        return;
      }

      setLoading(false);
      enqueueSnackbar(`Transferred ₦${amount} to ${recipient}`, { variant: 'success' });
      navigate('/dashboard');
    } catch (err) {
      console.log(err)
      setLoading(false);
      enqueueSnackbar('Transfer failed. Please try again.', { variant: 'error' });
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-100 flex items-center justify-center">
      {loading && <WalletAnimation />}
      <div className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-2xl shadow-lg transform transition-all hover:scale-[1.02] duration-300">
        <h2 className="text-2xl font-poppins font-bold text-gray-800 mb-6 text-center sm:text-left">
          Transfer
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">To</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 placeholder-gray-400"
              placeholder="Enter 10-digit account number"
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
            <label className="block text-gray-700 text-sm font-semibold mb-2">Narration</label>
            <input
              type="text"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 placeholder-gray-400"
              placeholder="Enter narration"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-900 to-green-700 text-white p-4 rounded-xl hover:from-green-800 hover:to-green-600 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl disabled:opacity-70"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Send Money'}
          </button>
        </form>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 w-full bg-gray-200 text-gray-800 p-3 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold"
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default TransferPage;