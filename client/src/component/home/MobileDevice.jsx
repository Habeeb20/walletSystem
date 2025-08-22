/* eslint-disable no-unused-vars */
import React from 'react';
import { FaWallet, FaPhone, FaNetworkWired, FaTv, FaBolt, FaEllipsisH } from 'react-icons/fa';

const MobileDevice = () => {
  return (
    <div className="relative w-[330px] h-[580px] bg-green-800 rounded-3xl shadow-2xl overflow-hidden border-4 border-green-700 transform perspective-1000 hover:scale-105 transition-transform duration-300">
      {/* Animating Wallet Icon (Top-Left Corner) */}
      <div className="absolute top-2 left-2 w-6 h-6">
        <FaWallet className="text-white animate-pulse w-full h-full" />
        <style>
          {`
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.2); }
              100% { transform: scale(1); }
            }
            .animate-pulse {
              animation: pulse 1.5s infinite;
            }
          `}
        </style>
      </div>
      {/* Mobile Device Frame */}
      <div className="absolute inset-2 bg-black rounded-2xl overflow-hidden">
        {/* Screen */}
        <div className="relative w-full h-full bg-gray-200 rounded-xl">
          {/* Top Status Bar */}
          <div className="flex justify-between items-center p-1 bg-green-600 text-white text-xs rounded-t-xl">
            <div className="font-bold">Hi, Olutomi</div>
            <div className="text-green-400">✓</div>
          </div>
          {/* Content Area */}
          <div className="p-4 text-center">
            {/* Balance Card */}
            <div className="bg-white rounded-xl shadow-md p-3 mb-4 transform hover:scale-105 transition-transform duration-200">
              <div className="text-lg font-bold text-gray-800">Balance</div>
              <div className="text-2xl font-semibold text-green-600 mt-1">₦12,769.00</div>
              <div className="flex justify-between text-sm mt-2 text-gray-600">
                <div>Cashback <span className="text-gray-500">₦0.00</span></div>
                <div>Bills <span className="text-gray-500">₦0.00</span></div>
                <div>Deposit <span className="text-gray-500">₦2,900.00</span></div>
              </div>
            </div>
            {/* Transaction Buttons */}
            <div className="flex justify-between mb-4">
              <button className="bg-green-600 text-white w-5/12 py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 transform hover:scale-105">
                Fund Card
              </button>
              <button className="bg-gray-200 text-gray-700 w-5/12 py-2 rounded-lg shadow-md hover:bg-gray-300 transition-colors duration-200 transform hover:scale-105">
                Withdraw
              </button>
            </div>
            {/* Services Grid */}
            <div className="grid grid-cols-5 gap-2 text-xs mb-4">
              <div className="flex flex-col items-center p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg shadow-md hover:bg-gradient-to-tr hover:from-blue-200 hover:to-blue-300 transition-all duration-200 transform hover:scale-105">
                <FaPhone className="text-blue-500 w-6 h-6 mb-1" />
                <span className="text-blue-700 font-medium">Airtime</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg shadow-md hover:bg-gradient-to-tr hover:from-purple-200 hover:to-purple-300 transition-all duration-200 transform hover:scale-105">
                <FaNetworkWired className="text-purple-500 w-6 h-6 mb-1" />
                <span className="text-purple-700 font-medium">Data</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-gradient-to-br from-red-100 to-red-200 rounded-lg shadow-md hover:bg-gradient-to-tr hover:from-red-200 hover:to-red-300 transition-all duration-200 transform hover:scale-105">
                <FaTv className="text-red-500 w-6 h-6 mb-1" />
                <span className="text-red-700 font-medium">Cable TV</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg shadow-md hover:bg-gradient-to-tr hover:from-yellow-200 hover:to-yellow-300 transition-all duration-200 transform hover:scale-105">
                <FaBolt className="text-yellow-500 w-6 h-6 mb-1" />
                <span className="text-yellow-700 font-medium">Electricity</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-md hover:bg-gradient-to-tr hover:from-gray-200 hover:to-gray-300 transition-all duration-200 transform hover:scale-105">
                <FaEllipsisH className="text-gray-500 w-6 h-6 mb-1" />
                <span className="text-gray-700 font-medium">More</span>
              </div>
            </div>
            {/* Transaction History */}
            <div className="bg-white rounded-xl shadow-md p-3">
              <div className="text-sm font-semibold text-gray-800 mb-2">Transaction History</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm text-gray-700">
                  <span>Debit - Shop Purchase</span>
                  <span className="text-red-500">₦1,200 - 11:00 AM, Aug 22</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-700">
                  <span>Credit - Salary</span>
                  <span className="text-green-500">+₦5,000 - 10:00 AM, Aug 21</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-700">
                  <span>Debit - Utility Bill</span>
                  <span className="text-red-500">₦800 - 09:00 AM, Aug 20</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-green-600 text-right cursor-pointer hover:underline">
                View All
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Camera and Sensors */}
      <div className="absolute top-2 right-4 w-2 h-2 bg-green-300 rounded-full"></div>
      <div className="absolute top-2 right-8 w-1 h-1 bg-green-400 rounded-full"></div>
      {/* Speaker */}
      <div className="absolute top-2 right-12 w-8 h-1 bg-green-400 rounded"></div>
      {/* Home Button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-300 rounded-full"></div>
      {/* Side Buttons (Right) */}
      <div className="absolute top-1/4 right-0 w-2 h-8 bg-green-500 rounded-l"></div>
      <div className="absolute top-1/2 right-0 w-2 h-8 bg-green-500 rounded-l"></div>
    </div>
  );
};

export default MobileDevice;