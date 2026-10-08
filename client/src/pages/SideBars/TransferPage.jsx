

// src/pages/SideBars/TransferPage.jsx
import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import WalletAnimation from '../../resources/wallet';
import { fetchWalletBalance } from '../../redux/walletSlice';
import { NIGERIAN_BANKS } from '../../resources/banks';
import {
  verifyAccount,
  transferFunds,
  clearError,
  clearVerifiedAccount,
} from '../../redux/store/transferSlice';

function TransferPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { walletBalance, loading: walletLoading } = useSelector((state) => state.wallet);
  const { loading, error, verifiedAccount } = useSelector((state) => state.transfer);

  const [recipient, setRecipient] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [bankSearch, setBankSearch] = useState('');
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const bankBoxRef = useRef(null);

  // Fetch wallet balance on mount
  useEffect(() => {
    dispatch(fetchWalletBalance());
  }, [dispatch]);

  // Clear any stale verified account when leaving the page
  useEffect(() => {
    return () => {
      dispatch(clearVerifiedAccount());
    };
  }, [dispatch]);

  // Show non-network errors
  useEffect(() => {
    if (error) {
      const isNetwork = error.includes('Network') || error.includes('Failed to fetch');
      if (!isNetwork) {
        enqueueSnackbar(error, { variant: 'error' });
        dispatch(clearError());
      }
    }
  }, [error, enqueueSnackbar, dispatch]);

  // Close bank dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (bankBoxRef.current && !bankBoxRef.current.contains(e.target)) {
        setShowBankDropdown(false);
        setBankSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Auto-verify when 10 digits + bank selected.
  // Depends ONLY on recipient + bankCode, so it can't re-trigger itself (no loop).
  useEffect(() => {
    let cancelled = false;

    // Inputs changed: any previous verification is no longer valid
    dispatch(clearVerifiedAccount());
    setShowConfirmModal(false);

    if (recipient.length === 10 && bankCode) {
      setVerifying(true);
      dispatch(verifyAccount({ bank_code: bankCode, account_number: recipient }))
        .unwrap()
        .catch(() => {
          if (!cancelled) dispatch(clearVerifiedAccount());
        })
        .finally(() => {
          if (!cancelled) setVerifying(false);
        });
    } else {
      setVerifying(false);
    }

    return () => {
      cancelled = true; // ignore stale responses
    };
  }, [recipient, bankCode, dispatch]);

  const handleTransfer = () => {
    if (!verifiedAccount || loading) return;

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      enqueueSnackbar('Enter a valid amount', { variant: 'error' });
      return;
    }
    if (transferAmount > walletBalance) {
      enqueueSnackbar('Insufficient balance', { variant: 'error' });
      return;
    }
    if (!narration.trim()) {
      enqueueSnackbar('Narration is required', { variant: 'error' });
      return;
    }

    dispatch(
      transferFunds({
        account_number: verifiedAccount.account_number,
        account_name: verifiedAccount.account_name,
        amount: transferAmount,
        narration: narration.trim(),
        bank_code: verifiedAccount.bank_code,
        bank_name: verifiedAccount.bank_name,
      })
    )
      .unwrap()
      .then((res) => {
        setShowConfirmModal(false);
        const pending = res?.status === 'pending';
        enqueueSnackbar(
          pending
            ? res?.message || 'Transfer submitted and awaiting confirmation'
            : `₦${transferAmount.toLocaleString()} sent to ${verifiedAccount.account_name}`,
          { variant: pending ? 'info' : 'success' }
        );
        dispatch(fetchWalletBalance());
        navigate('/dashboard');
      })
      .catch(() => {
        setShowConfirmModal(false);
        dispatch(fetchWalletBalance()); // balance may have been refunded
      });
  };

  const filteredBanks = useMemo(() => {
    if (!bankSearch) return NIGERIAN_BANKS;
    const lower = bankSearch.toLowerCase();
    return NIGERIAN_BANKS.filter((bank) => bank.name.toLowerCase().includes(lower));
  }, [bankSearch]);

  const selectedBankName = NIGERIAN_BANKS.find((b) => b.code === bankCode)?.name || '';

  const isBusy = loading || verifying || walletLoading;

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-100 flex items-center justify-center">
      {isBusy && <WalletAnimation />}

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
          {/* SEARCHABLE BANK INPUT */}
          <div className="relative" ref={bankBoxRef}>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Select Bank</label>
            <input
              type="text"
              value={showBankDropdown ? bankSearch : selectedBankName}
              onChange={(e) => {
                setBankSearch(e.target.value);
                setShowBankDropdown(true);
                setBankCode(''); // typing invalidates previous selection
              }}
              onFocus={() => {
                setBankSearch('');
                setShowBankDropdown(true);
              }}
              placeholder="Search or select bank..."
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50"
              autoComplete="off"
            />

            {showBankDropdown && filteredBanks.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                {filteredBanks.map((bank) => (
                  <div
                    key={bank.code}
                    onClick={() => {
                      setBankCode(bank.code);
                      setBankSearch('');
                      setShowBankDropdown(false);
                    }}
                    className="px-4 py-3 hover:bg-green-50 cursor-pointer transition"
                  >
                    {bank.name}
                  </div>
                ))}
              </div>
            )}

            {showBankDropdown && filteredBanks.length === 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center text-gray-500">
                No bank found
              </div>
            )}
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Recipient Account Number
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50"
              placeholder="Enter 10-digit account number"
              maxLength={10}
              required
            />
            {verifying && (
              <p className="mt-1 text-xs text-blue-600 animate-pulse">Verifying account...</p>
            )}
            { recipient.length === 10 && bankCode && !verifiedAccount && (
              <p className="mt-1 text-xs text-red-600">Invalid account</p>
            )}
            {recipient.length === 10 && !bankCode && (
              <p className="mt-1 text-xs text-amber-600">Select a bank to verify this account</p>
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

          {/* Narration (required by Paylony) */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Narration</label>
            <input
              type="text"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50"
              placeholder="e.g. Lunch money"
              maxLength={100}
              required
            />
          </div>

          {/* Review button: opens the modal only when the user clicks */}
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            disabled={!verifiedAccount || loading || !amount || !narration.trim()}
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
              <p><strong>To:</strong> {verifiedAccount.account_name}</p>
              <p><strong>Bank:</strong> {verifiedAccount.bank_name}</p>
              <p><strong>Account:</strong> {verifiedAccount.account_number}</p>
              <p><strong>Amount:</strong> ₦{parseFloat(amount || 0).toLocaleString()}</p>
              <p><strong>Narration:</strong> {narration}</p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleTransfer}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Money'}
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={loading}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition disabled:opacity-50"
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