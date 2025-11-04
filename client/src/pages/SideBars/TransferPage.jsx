/* eslint-disable no-unused-vars */




// // src/pages/SideBars/TransferPage.jsx
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { useSnackbar } from 'notistack';
// import WalletAnimation from '../../resources/wallet';
// import { fetchWalletBalance } from '../../redux/store/airtimeSlice';
// import { NIGERIAN_BANKS } from '../../../../utils/banks';
// import { verifyAccount, transferFunds,
//   clearError,
//   clearVerifiedAccount, } from '../../redux/store/transferSlice';


// function TransferPage() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { enqueueSnackbar } = useSnackbar();
//   const {  walletBalance } = useSelector((state) => state.wallet);
//   const { dashboardData, token } = useSelector((state) => state.auth);
//   const { loading, error, verifiedAccount } = useSelector((state) => state.transfer);


//   const [recipient, setRecipient] = useState('');
//   const [bankCode, setBankCode] = useState('');
//   const [amount, setAmount] = useState('');
//   const [narration, setNarration] = useState('');
//   const [verifying, setVerifying] = useState(false);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);


//     useEffect(() => {
//       if (token) {
//         dispatch(fetchWalletBalance(token));
//       }
//     }, [dispatch, token]);

//   // Auto-clear error snackbar
//   useEffect(() => {
//     if (error) {
//       const isNetwork = error.includes('Network') || error.includes('Failed to fetch');
//       if (!isNetwork) {
//         enqueueSnackbar(error, { variant: 'error' });
//         dispatch(clearError());
//       }
//     }
//   }, [error, enqueueSnackbar, dispatch]);

//   // Debounced account verification
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       const digits = recipient.replace(/\D/g, '');
//       if (digits.length === 10 && bankCode && token) {
//         setVerifying(true);
//         dispatch(verifyAccount({ bank_code: bankCode, account_number: digits, token }))
//           .unwrap()
//           .then(() => {
//             setShowConfirmModal(true);
//           })
//           .catch(() => {
//             dispatch(clearVerifiedAccount());
//           })
//           .finally(() => setVerifying(false));
//       } else {
//         dispatch(clearVerifiedAccount());
//       }
//     }, 800);

//     return () => clearTimeout(timer);
//   }, [recipient, bankCode, token, dispatch]);

//   const handleTransfer = () => {
//     if (!verifiedAccount || !token) return;

//     const transferAmount = parseFloat(amount);
//     if (isNaN(transferAmount) || transferAmount <= 0) {
//       enqueueSnackbar('Enter a valid amount', { variant: 'error' });
//       return;
//     }
//     if (transferAmount > walletBalance) {
//       enqueueSnackbar('Insufficient balance', { variant: 'error' });
//       return;
//     }

//     dispatch(
//       transferFunds({
//         account_number: verifiedAccount.account_number,
//         amount: transferAmount,
//         narration,
//         bank_code: verifiedAccount.bank_code,
//         bank_name: verifiedAccount.bank_name,
//         token,
//       })
//     )
//       .unwrap()
//       .then(() => {
//         enqueueSnackbar(`₦${amount} sent to ${verifiedAccount.account_name}`, {
//           variant: 'success',
//         });
//         navigate('/dashboard');
//       })
//       .catch(() => {
//         // error already shown via slice
//       });
//   };

//   return (
//     <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-100 flex items-center justify-center">
//       {(loading || verifying) && <WalletAnimation />}

//       <div className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-poppins font-bold text-gray-800">Transfer Money</h2>
//           <div className="text-right">
//             <p className="text-xs text-gray-500">Wallet Balance</p>
//             <p className="text-lg font-semibold text-green-600">₦{walletBalance.toLocaleString()}</p>
//           </div>
//         </div>

//         <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
//           {/* Bank Select */}
//           <div>
//             <label className="block text-gray-700 text-sm font-semibold mb-2">Select Bank</label>
//             <select
//               value={bankCode}
//               onChange={(e) => setBankCode(e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50"
//               required
//             >
//               <option value="">-- Choose Bank --</option>
//               {NIGERIAN_BANKS.map((b) => (
//                 <option key={b.code} value={b.code}>
//                   {b.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Account Number */}
//           <div>
//             <label className="block text-gray-700 text-sm font-semibold mb-2">
//               Recipient Account Number
//             </label>
//             <input
//               type="text"
//               value={recipient}
//               onChange={(e) => setRecipient(e.target.value.replace(/\D/g, '').slice(0, 10))}
//               className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50"
//               placeholder="10-digit account number"
//               maxLength={10}
//               required
//             />
//             {verifying && (
//               <p className="mt-1 text-xs text-blue-600 animate-pulse">Verifying account...</p>
//             )}
//           </div>

//           {/* Verified Account Info */}
//           {verifiedAccount && (
//             <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
//               <strong>{verifiedAccount.account_name}</strong>
//               <br />
//               {verifiedAccount.bank_name} – {verifiedAccount.account_number}
//             </div>
//           )}

//           {/* Amount */}
//           <div>
//             <label className="block text-gray-700 text-sm font-semibold mb-2">Amount (₦)</label>
//             <input
//               type="number"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50"
//               placeholder="0.00"
//               min="1"
//               step="0.01"
//               required
//             />
//           </div>

//           {/* Narration */}
//           <div>
//             <label className="block text-gray-700 text-sm font-semibold mb-2">Narration</label>
//             <input
//               type="text"
//               value={narration}
//               onChange={(e) => setNarration(e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50"
//               placeholder="e.g. Lunch money"
//               required
//             />
//           </div>

//           {/* Send Button */}
//           <button
//             type="button"
//             onClick={() => setShowConfirmModal(true)}
//             disabled={!verifiedAccount || loading || !amount || !narration}
//             className="w-full bg-gradient-to-r from-green-900 to-green-700 text-white p-4 rounded-xl hover:from-green-800 hover:to-green-600 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? 'Processing...' : 'Review & Send'}
//           </button>
//         </form>

//         <button
//           onClick={() => navigate('/dashboard')}
//           className="mt-4 w-full bg-gray-200 text-gray-800 p-3 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold"
//         >
//           Back
//         </button>
//       </div>

//       {/* Confirmation Modal */}
//       {showConfirmModal && verifiedAccount && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
//             <h3 className="text-lg font-bold text-gray-800 mb-4">Confirm Transfer</h3>

//             <div className="space-y-2 text-sm">
//               <p><strong>To:</strong> {verifiedAccount.account_name}</p>
//               <p><strong>Bank:</strong> {verifiedAccount.bank_name}</p>
//               <p><strong>Account:</strong> {verifiedAccount.account_number}</p>
//               <p><strong>Amount:</strong> ₦{parseFloat(amount).toLocaleString()}</p>
//               <p><strong>Narration:</strong> {narration}</p>
//             </div>

//             <div className="flex gap-3 mt-6">
//               <button
//                 onClick={handleTransfer}
//                 disabled={loading}
//                 className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
//               >
//                 {loading ? 'Sending...' : 'Send Money'}
//               </button>
//               <button
//                 onClick={() => setShowConfirmModal(false)}
//                 className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default TransferPage;












// src/pages/SideBars/TransferPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import WalletAnimation from '../../resources/wallet';
import { fetchWalletBalance } from '../../redux/walletSlice';

import { NIGERIAN_BANKS } from '../../../../utils/banks';
import { verifyAccount, transferFunds,
  clearError,
  clearVerifiedAccount, } from '../../redux/store/transferSlice';

function TransferPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
 const token = useSelector((state) => state.auth.token) || localStorage.getItem('token');
  const { walletBalance, loading: walletLoading } = useSelector((state) => state.wallet);
  const { dashboardData,  } = useSelector((state) => state.auth);
  const { loading, error, verifiedAccount } = useSelector((state) => state.transfer);

  const [recipient, setRecipient] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Fetch wallet balance on mount
  useEffect(() => {
    if (token) {
      dispatch(fetchWalletBalance(token));
    }
  }, [dispatch, token]);

  // Show non-network errors as snackbar
  useEffect(() => {
    if (error) {
      const isNetwork = error.includes('Network') || error.includes('Failed to fetch');
      if (!isNetwork) {
        enqueueSnackbar(error, { variant: 'error' });
        dispatch(clearError());
      }
    }
  }, [error, enqueueSnackbar, dispatch]);

  // Verify account IMMEDIATELY when 10 digits are entered
  useEffect(() => {
    const digits = recipient.replace(/\D/g, '');

    // Trigger verification only when exactly 10 digits and bank is selected
    if (digits.length === 10 && bankCode && token && !verifying) {
      setVerifying(true);
      dispatch(
        verifyAccount({
          bank_code: bankCode,
          account_number: digits,
          token,
        })
      )
        .unwrap()
        .then(() => {
          setShowConfirmModal(true); // Auto-open confirm modal on success
        })
        .catch(() => {
          dispatch(clearVerifiedAccount());
        })
        .finally(() => {
          setVerifying(false);
        });
    } else {
      // Clear verification if input is invalid
      if (verifiedAccount) {
        dispatch(clearVerifiedAccount());
        setShowConfirmModal(false);
      }
    }
  }, [recipient, bankCode, token, dispatch, verifying, verifiedAccount]);

  const handleTransfer = () => {
    if (!verifiedAccount || !token) return;

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      enqueueSnackbar('Enter a valid amount', { variant: 'error' });
      return;
    }
    if (transferAmount > walletBalance) {
      enqueueSnackbar('Insufficient balance', { variant: 'error' });
      return;
    }

    dispatch(
      transferFunds({
        account_number: verifiedAccount.account_number,
        amount: transferAmount,
        narration,
        bank_code: verifiedAccount.bank_code,
        bank_name: verifiedAccount.bank_name,
        token,
      })
    )
      .unwrap()
      .then(() => {
        enqueueSnackbar(`₦${amount} sent to ${verifiedAccount.account_name}`, {
          variant: 'success',
        });
        navigate('/dashboard');
      })
      .catch(() => {
        // Error already handled in slice
      });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-100 flex items-center justify-center">
      {(loading || verifying || walletLoading) && <WalletAnimation />}

      <div className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-poppins font-bold text-gray-800">Transfer Money</h2>
          <div className="text-right">
            <p className="text-xs text-gray-500">Wallet Balance</p>
            <p className="text-lg font-semibold text-green-600">
              ₦{walletBalance?.toLocaleString() || '0'}
            </p>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          {/* Bank Select */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Select Bank</label>
            <select
              value={bankCode}
              onChange={(e) => setBankCode(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50"
              required
            >
              <option value="">-- Choose Bank --</option>
              {NIGERIAN_BANKS.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Recipient Account Number
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                setRecipient(value);
              }}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50"
              placeholder="Enter 10-digit account number"
              maxLength={10}
              required
            />
            {verifying && (
              <p className="mt-1 text-xs text-blue-600 animate-pulse">Verifying account...</p>
            )}
            {!verifying && recipient.length === 10 && !verifiedAccount && (
              <p className="mt-1 text-xs text-red-600">Invalid account</p>
            )}
          </div>

          {/* Verified Account Info */}
          {verifiedAccount && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm animate-fadeIn">
              <strong>{verifiedAccount.account_name}</strong>
              <br />
              {verifiedAccount.bank_name} – {verifiedAccount.account_number}
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Amount (₦)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50"
              placeholder="0.00"
              min="1"
              step="0.01"
              required
            />
          </div>

          {/* Narration */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Narration</label>
            <input
              type="text"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50"
              placeholder="e.g. Lunch money"
              required
            />
          </div>

          {/* Send Button */}
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            disabled={!verifiedAccount || loading || !amount || !narration}
            className="w-full bg-gradient-to-r from-green-900 to-green-700 text-white p-4 rounded-xl hover:from-green-800 hover:to-green-600 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Review & Send'}
          </button>
        </form>

        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 w-full bg-gray-200 text-gray-800 p-3 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold"
        >
          Back
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && verifiedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Confirm Transfer</h3>

            <div className="space-y-2 text-sm">
              <p>
                <strong>To:</strong> {verifiedAccount.account_name}
              </p>
              <p>
                <strong>Bank:</strong> {verifiedAccount.bank_name}
              </p>
              <p>
                <strong>Account:</strong> {verifiedAccount.account_number}
              </p>
              <p>
                <strong>Amount:</strong> ₦{parseFloat(amount).toLocaleString()}
              </p>
              <p>
                <strong>Narration:</strong> {narration}
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleTransfer}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                {loading ? 'Sending...' : 'Send Money'}
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransferPage;