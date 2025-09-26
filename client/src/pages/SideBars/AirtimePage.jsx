// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { rechargeAirtime, fetchWalletBalance } from '../../redux/walletSlice';
// import { useSnackbar } from 'notistack';
// import WalletLoadingAnimation from '../../resources/wallet';

// const Airtime = () => {
//   const networks = ["MTN", "9mobile", "Airtel", "Glo"];
//   const amounts = [100, 200, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 10000];

//   const dispatch = useDispatch();
//   const walletState = useSelector((state) => state.wallet || { loading: false, error: null, walletBalance: 0 });
//   const { loading, error, walletBalance } = walletState;
//   const token = localStorage.getItem('token');
//   const { enqueueSnackbar } = useSnackbar();

//   const [selectedNetwork, setSelectedNetwork] = useState('');
//   const [selectedAmount, setSelectedAmount] = useState('');
//   const [phone, setPhone] = useState('');

//   useEffect(() => {
//     if (token) {
//       dispatch(fetchWalletBalance(token));
//     }
//   }, [dispatch, token]);

//   const handleRecharge = async (e) => {
//     e.preventDefault();
//     if (!selectedNetwork || !selectedAmount || !phone) {
//       enqueueSnackbar('Please select network, amount, and enter phone number', { variant: 'error' });
     
//       return;
//     }
//      if(phone.length < 11 || phone.length > 11){
//            enqueueSnackbar(' enter a valid phone number', { variant: 'error' }); 
//       }

//     if (walletBalance < selectedAmount) {
//       enqueueSnackbar('Insufficient balance. Please fund your wallet.', { variant: 'error' });
//       return;
//     }

//     try {
//       await dispatch(rechargeAirtime({ network: selectedNetwork, amount: selectedAmount, phone, token })).unwrap();
//       enqueueSnackbar('Airtime recharge successful', { variant: 'success' });
//       dispatch(fetchWalletBalance(token));
//       setSelectedNetwork('');
//       setSelectedAmount('');
//       setPhone('');
//     } catch (error) {
//       enqueueSnackbar(error || 'Recharge failed. Please try again.', { variant: 'error' });
//     }
//   };

//   return (
//     <div className="p-4 mt-10 sm:p-6 md:mt-20">
//       {loading && <WalletLoadingAnimation loading={loading} />}
//       <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Buy Airtime</h2>
//       {error && <div className="text-center text-red-500 mb-4">{error}</div>}
//       <p className="font-bold text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">Wallet Balance: {walletBalance || 0} NGN</p>
//       <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
//         <form onSubmit={handleRecharge} className="w-full sm:w-1/2 space-y-4 sm:space-y-6">
//           <div>
//             <label className="block text-sm sm:text-md font-medium text-gray-700">Network</label>
//             <select
//               value={selectedNetwork}
//               onChange={(e) => setSelectedNetwork(e.target.value)}
//               className="mt-2 sm:mt-2 block w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//               required
//             >
//               <option value="">Select network</option>
//               {networks.map((network) => (
//                 <option key={network} value={network} className="text-gray-700">
//                   {network}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm sm:text-md font-medium text-gray-700">Amount</label>
//             <select
//               value={selectedAmount}
//               onChange={(e) => setSelectedAmount(e.target.value)}
//               className="mt-2 sm:mt-2 block w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//               required
//             >
//               <option value="">Enter the amount</option>
//               {amounts.map((amount) => (
//                 <option key={amount} value={amount} className="text-gray-700">
//                   {amount} NGN
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm sm:text-md font-medium text-gray-700">Mobile Number</label>
//             <input
//               type="text"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               className="mt-2 sm:mt-2 block w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//               placeholder="Mobile Number"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full p-2 sm:p-3 bg-gradient-to-r from-green-900 to-green-700 text-white rounded-lg hover:from-green-800 hover:to-green-600 transition duration-300"
//             disabled={loading}
//           >
//             {loading ? 'Processing...' : 'Buy Now'}
//           </button>
//         </form>
//         <div className="w-full sm:w-1/2">
//           <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 sm:mb-4">Codes to Check Balance</h3>
//           <div className="space-y-3 sm:space-y-4">
//             <div className="p-2 sm:p-3 rounded-lg bg-yellow-400 text-white font-medium">MTN *310#</div>
//             <div className="p-2 sm:p-3 rounded-lg bg-yellow-800 text-white font-medium">9mobile *310#</div>
//             <div className="p-2 sm:p-3 rounded-lg bg-red-700 text-white font-medium">Airtel *310#</div>
//             <div className="p-2 sm:p-3 rounded-lg bg-green-600 text-white font-medium">Glo *310#</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Airtime;
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { rechargeAirtime, fetchWalletBalance } from '../../redux/walletSlice';
import { useSnackbar } from 'notistack';
import WalletLoadingAnimation from '../../resources/wallet';

const Airtime = () => {
  const networks = ["MTN", "9mobile", "Airtel", "Glo"];
  const amounts = [100, 200, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 10000];

  const dispatch = useDispatch();
  const walletState = useSelector((state) => state.wallet || { loading: false, error: null, walletBalance: 0 });
  const { loading, error, walletBalance } = walletState;
  const token = localStorage.getItem('token');
  const { enqueueSnackbar } = useSnackbar();

  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [selectedAmount, setSelectedAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [customAmount, setCustomAmount] = useState('');

  useEffect(() => {
    if (token) {
      dispatch(fetchWalletBalance(token));
    }
  }, [dispatch, token]);

  const handleRecharge = async (e) => {
    e.preventDefault();
    if (!selectedNetwork || !selectedAmount && !customAmount || !phone) {
      enqueueSnackbar('Please select network, amount, and enter phone number', { variant: 'error' });
      return;
    }
    if (phone.length < 11 || phone.length > 11) {
      enqueueSnackbar('Enter a valid phone number', { variant: 'error' });
      return;
    }

    const finalAmount = customAmount || selectedAmount;
    if (walletBalance < finalAmount) {
      enqueueSnackbar('Insufficient balance. Please fund your wallet.', { variant: 'error' });
      return;
    }

    try {
      await dispatch(rechargeAirtime({ network: selectedNetwork, amount: finalAmount, phone, token })).unwrap();
      enqueueSnackbar('Airtime recharge successful', { variant: 'success' });
      dispatch(fetchWalletBalance(token));
      setSelectedNetwork('');
      setSelectedAmount('');
      setCustomAmount('');
      setPhone('');
    } catch (error) {
      enqueueSnackbar(error || 'Recharge failed. Please try again.', { variant: 'error' });
    }
  };

  return (
    <div className="p-4 mt-3 sm:p-6 md:mt-20">
      {loading && <WalletLoadingAnimation loading={loading} />}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Buy Airtime</h2>
      {error && <div className="text-center text-red-500 mb-4">{error}</div>}
      <p className="font-bold text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">Wallet Balance: {walletBalance || 0} NGN</p>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <form onSubmit={handleRecharge} className="w-full sm:w-1/2 space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm sm:text-md font-medium text-gray-700">Network</label>
            <select
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(e.target.value)}
              className="mt-2 sm:mt-2 block w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select network</option>
              {networks.map((network) => (
                <option key={network} value={network} className="text-gray-700">
                  {network}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm sm:text-md font-medium text-gray-700">Amount</label>
            <div className="mt-2 sm:mt-2 grid grid-cols-3 gap-2 sm:gap-3">
              {amounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setSelectedAmount(amount)}
                  className={`p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${selectedAmount === amount ? 'bg-green-500 text-white' : 'bg-white text-gray-700'}`}
                >
                  {amount} NGN
                </button>
              ))}
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value ? parseInt(e.target.value) : '')}
                placeholder="Or enter custom amount"
                className="mt-2 sm:mt-0 col-span-3 p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                min="100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm sm:text-md font-medium text-gray-700">Mobile Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 sm:mt-2 block w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Mobile Number"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-2 sm:p-3 bg-gradient-to-r from-green-900 to-green-700 text-white rounded-lg hover:from-green-800 hover:to-green-600 transition duration-300"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Buy Now'}
          </button>
        </form>
        <div className="w-full sm:w-1/2">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 sm:mb-4">Codes to Check Balance</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="p-2 sm:p-3 rounded-lg bg-yellow-400 text-white font-medium">MTN *310#</div>
            <div className="p-2 sm:p-3 rounded-lg bg-yellow-800 text-white font-medium">9mobile *310#</div>
            <div className="p-2 sm:p-3 rounded-lg bg-red-700 text-white font-medium">Airtel *310#</div>
            <div className="p-2 sm:p-3 rounded-lg bg-green-600 text-white font-medium">Glo *310#</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Airtime;