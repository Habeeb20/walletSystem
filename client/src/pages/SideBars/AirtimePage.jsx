/* eslint-disable no-unused-vars */
import React from 'react'

const Airtime = () => {
        const networks = ["MTN", "9mobile", "Airtel", "Glo"];
      const amounts = [100, 200, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 10000];


  
      return (
        <div className="p-6 w-[1200px] h-[400px] mt-20  bg-white">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-gray-700 mb-2">Network</label>
              <select className="w-full p-2 border rounded text-gray-500">
                <option>Select network</option>
                {networks.map((network) => (
                  <option key={network} value={network}>{network}</option>
                ))}
              </select>

              <label className="block text-gray-700 mb-2 mt-4">Amount</label>
              <select className="w-full p-2 border rounded text-gray-500">
                <option>Enter the amount</option>
                {amounts.map((amount) => (
                  <option key={amount} value={amount}>{amount} N</option>
                ))}
              </select>

              <label className="block text-gray-700 mb-2 mt-4">Mobile Number</label>
              <input
                type="text"
                className="w-full p-2 border rounded text-gray-500"
                placeholder="Mobile Number"
              />

              <button className="w-full bg-gradient-to-r from-green-900 to-green-700 text-white p-2 rounded mt-6">
                Buy Now
              </button>
            </div>

            <div className="flex-1">
              <h3 className="text-gray-700 mb-2">Codes to check balance</h3>
              <div className="space-y-2">
                <div className="bg-yellow-400 p-2 rounded text-white">MTN *310#</div>
                <div className="bg-yellow-800 p-2 rounded text-white">9mobile *310#</div>
                <div className="bg-red-700 p-2 rounded text-white">Airtel *310#</div>
                <div className="bg-green-600 p-2 rounded text-white">Glo *310#</div>
              </div>
            </div>
          </div>
        </div>
      );
    };



export default Airtime
