/* eslint-disable react/prop-types */
// src/components/ErrorModal.jsx
import { useDispatch } from 'react-redux';
import { clearError } from '../redux/store/transferSlice';


export default function ErrorModal({ error, onRetry }) {
  const dispatch = useDispatch();

  if (!error) return null;

  const isNetwork = error.includes('Network') || error.includes('Failed to fetch');
  const title = isNetwork ? 'No Internet Connection' : 'Server Error';
  const message = isNetwork
    ? 'Please check your internet connection and try again.'
    : 'We are having trouble connecting to the server.';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fadeIn">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        </div>

        <p className="text-sm text-gray-600 mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={() => {
              dispatch(clearError());
              onRetry?.();
            }}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
          <button
            onClick={() => dispatch(clearError())}
            className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}