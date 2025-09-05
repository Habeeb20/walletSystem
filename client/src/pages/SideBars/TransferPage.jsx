// import  { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import WalletAnimation from '../../resources/wallet';

// function TransferPage() {
//   const navigate = useNavigate();
//   const [recipient, setRecipient] = useState('');
//   const [amount, setAmount] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [history] = useState([
//     { id: 1, recipient: 'john.doe@gmail.com', amount: '5000', date: '2025-09-04 14:30' },
//     { id: 2, recipient: 'jane.smith@yahoo.com', amount: '3000', date: '2025-09-03 10:15' },
//   ]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!recipient || !amount || amount <= 0) {
//       setError('Please enter a valid recipient and amount.');
//       return;
//     }
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//       setError('');
//       alert(`Transferred ₦${amount} to ${recipient}`);
//       navigate('/dashboard');
//     }, 2000);
//   };

//   return (
//     <div className="p-4 md:p-6 sm:px-2">
//       {loading && <WalletAnimation />}
//       <div className=" p-6 md:p-8 transform transition-all hover:scale-102 duration-300">
//         <h2 className="text-2xl font-poppins font-bold text-gray-800 mb-6 text-center md:text-left">Transfer</h2>
//         {error && <p className="text-red-500 text-center mb-4 font-medium">{error}</p>}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-gray-700 text-sm font-semibold mb-2">To</label>
//             <input
//               type="text"
//               value={recipient}
//               onChange={(e) => setRecipient(e.target.value)}
//               className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 placeholder-gray-400"
//               placeholder="Email or Phone"
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
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-green-900 to-green-700 text-white p-4 rounded-xl hover:from-green-800 hover:to-green-600 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl disabled:opacity-70"
//             disabled={loading}
//           >
//             {loading ? 'Processing...' : 'Send Money'}
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
//               <div key={tx.id} className="p-4 bg-gray-50 rounded-xl shadow-md border-l-4 border-green-700">
//                 <p className="text-gray-800 font-medium">To: {tx.recipient}</p>
//                 <p className="text-green-700 font-bold">₦{tx.amount}</p>
//                 <p className="text-gray-500 text-sm">{tx.date}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TransferPage;




import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WalletAnimation from '../../resources/wallet';
import { useSelector, useDispatch } from 'react-redux';
import { transferFunds } from '../../redux/walletSlice';

import { useSnackbar } from 'notistack';

function TransferPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [history] = useState([
    { id: 1, recipient: 'john.doe@gmail.com', amount: '5000', date: '2025-09-04 14:30' },
    { id: 2, recipient: 'jane.smith@yahoo.com', amount: '3000', date: '2025-09-03 10:15' },
  ]);
  const { dashboardData } = useSelector((state) => state.auth);
  const walletBalance = dashboardData?.user?.balance || 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate recipient is 11 digits
    const recipientDigits = recipient.replace(/[^0-9]/g, ''); 
    if (recipientDigits.length !== 10) {
      enqueueSnackbar('Recipient must be a valid 10-digit account number.', { variant: 'error' });
      return;
    }
    if (!amount || amount <= 0) {
      enqueueSnackbar('Please enter a valid amount.', { variant: 'error' });
      return;
    }
    if (parseFloat(amount) > walletBalance) {
      enqueueSnackbar('Insufficient balance. Please fund your wallet.', { variant: 'error' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      dispatch(transferFunds({ recipient, amount }))
        .then(() => {
          setLoading(false);
          enqueueSnackbar(`Transferred ₦${amount} to ${recipient}`, { variant: 'success' });
          navigate('/dashboard');
        })
        .catch((err) => {
          setLoading(false);
          enqueueSnackbar('Transfer failed. Please try again.', { variant: 'error' });
        });
    }, 2000);
  };

  return (
    <div className="p-4 md:p-6 sm:px-2">
      {loading && <WalletAnimation />}
      <div className=" p-6 md:p-8 transform transition-all hover:scale-102 duration-300">
        <h2 className="text-2xl font-poppins font-bold text-gray-800 mb-6 text-center md:text-left">Transfer</h2>
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
        <div className="mt-6">
          <h3 className="text-2xl font-poppins font-semibold text-gray-700 mb-4">Transaction History</h3>
          <div className="max-h-44 overflow-y-auto space-y-3">
            {history.map((tx) => (
              <div key={tx.id} className="p-4 bg-gray-50 rounded-xl shadow-md border-l-4 border-green-700">
                <p className="text-gray-800 font-medium">To: {tx.recipient}</p>
                <p className="text-green-700 font-bold">₦{tx.amount}</p>
                <p className="text-gray-500 text-sm">{tx.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransferPage;