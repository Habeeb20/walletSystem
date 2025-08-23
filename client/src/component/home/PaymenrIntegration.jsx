/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

const PaymentIntegrationSection = () => {
  return (
    <section className="bg-green-900 py-8 text-center">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-xl md:text-2xl font-semibold text-green-200 mb-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Transact seamlessly with...
        </motion.h2>
        <motion.p
          className="text-sm md:text-base text-green-300 mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          Connect your other accounts to Habeeeb seamlessly. Habeeeb supports 200+ integrations with other payment platforms like stripe, paypal, payoneer and others
        </motion.p>
        <motion.div
          className="flex flex-col md:flex-row justify-center items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
        >
          <div className="border-2 border-dashed border-green-400 p-2 flex items-center">
            <div className="w-[108px] h-[80px] bg-green-500 mx-1"></div>
            <div className="w-[108px] h-[80px] bg-green-500 mx-1"></div>
            <div className="w-[108px] h-[80px] bg-green-500 mx-1"></div>
            <div className="w-[108px] h-[80px] bg-green-500 mx-1"></div>
            <div className="w-[108px] h-[80px] bg-green-500 mx-1"></div>
          </div>
          <div className="border-2 border-dashed border-green-400 p-2 flex items-center">
            <div className="w-[108px] h-[80px] bg-green-500 mx-1"></div>
            <div className="w-[108px] h-[80px] bg-green-500 mx-1"></div>
            <div className="w-[108px] h-[80px] bg-green-500 mx-1"></div>
            <div className="w-[108px] h-[80px] bg-green-500 mx-1"></div>
            <div className="w-[108px] h-[80px] bg-green-500 mx-1"></div>
            <div className="w-[108px] h-[80px] bg-green-500 mx-1"></div>
            <div className="w-[108px] h-[80px] bg-green-500 mx-1"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PaymentIntegrationSection;