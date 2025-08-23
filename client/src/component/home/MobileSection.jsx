/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { APP_NAME } from '../utils/projectName';

const MobileSection = () => {
  return (
    <motion.div
      className="relative w-[270px] h-[520px] bg-white rounded-2xl border-2 border-gray-600 overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-500 rounded-full"></div>
      <div className="absolute top-6 left-4 right-4 h-12 bg-gray-700 flex items-center justify-center text-white text-sm font-semibold">
       {APP_NAME}
      </div>
      <div className="absolute top-20 left-4 right-4 h-32 bg-gray-600 flex flex-col items-center justify-center text-white">
        <motion.div
          className="text-lg font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          ₦1,500
        </motion.div>
        <motion.div
          className="text-sm text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Available Balance
        </motion.div>
        <motion.div
          className="mt-4 text-sm text-blue-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          +₦200 Cashback
        </motion.div>
      </div>
      <div className="absolute bottom-4 left-4 right-4 h-12 bg-gray-700 flex items-center justify-between px-2">
        <motion.div
          className="text-white text-xs"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          Electricity
        </motion.div>
        <motion.div
          className="text-white text-xs"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          Internet
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MobileSection;