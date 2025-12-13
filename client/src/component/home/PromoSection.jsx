/* eslint-disable no-unused-vars */
import  { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import MobileSection from './MobileSection';
import { APP_NAME } from '../utils/projectName';

const PromoSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, inView]);

  return (
    // <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
    //   <motion.div
    //     ref={ref}
    //     className="max-w-6xl w-full bg-white rounded-lg shadow-lg p-6"
    //     initial="hidden"
    //     animate={controls}
    //     variants={{
    //       hidden: { opacity: 0, y: 50 },
    //       visible: { opacity: 1, y: 0 },
    //     }}
    //     transition={{ duration: 0.8 }}
    //   >
    //     <motion.div
    //       className="text-center mb-6"
    //       variants={{
    //         hidden: { opacity: 0 },
    //         visible: { opacity: 1 },
    //       }}
    //       transition={{ delay: 0.2, duration: 0.8 }}
    //     >
    //       <h2 className="text-xl font-semibold text-gray-700">Make every penny count</h2>
    //       <p className="text-gray-600">
    //         Spend smarter, lower your bills, get cashback on everything you buy, and unlock credit to grow your business.
    //       </p>
    //     </motion.div>
    //     <div className="flex flex-col md:flex-row items-center justify-between gap-6">
    //       <motion.div
    //         className="bg-blue-100 p-6 rounded-lg w-full md:w-1/2"
    //         variants={{
    //           hidden: { opacity: 0, x: -50 },
    //           visible: { opacity: 1, x: 0 },
    //         }}
    //         transition={{ delay: 0.4, duration: 0.8 }}
    //       >
    //         <h3 className="text-lg font-semibold text-blue-800 mb-2">Pay with {APP_NAME}, quick, simple and easy</h3>
    //         <p className="text-blue-600">
    //           Paying your bills on {APP_NAME} has never been easier. Whether you are paying for electricity or internet, Habeeb gets it done within seconds.
    //         </p>
    //       </motion.div>
    //       <motion.div
    //         className="flex items-center justify-center w-full md:w-1/3"
    //         variants={{
    //           hidden: { opacity: 0, scale: 0.8 },
    //           visible: { opacity: 1, scale: 1 },
    //         }}
    //         transition={{ delay: 0.6, duration: 0.8 }}
    //       >
    //         <MobileSection />
    //       </motion.div>
    //       <motion.div
    //         className="bg-purple-100 p-6 rounded-lg w-full md:w-1/3"
    //         variants={{
    //           hidden: { opacity: 0, x: 50 },
    //           visible: { opacity: 1, x: 0 },
    //         }}
    //         transition={{ delay: 0.8, duration: 0.8 }}
    //       >
    //         <div className="flex items-center justify-center mb-2">
    //           <span className="text-purple-800 text-2xl">✔</span>
    //         </div>
    //         <h3 className="text-lg font-semibold text-purple-800 mb-2">Bank level security</h3>
    //         <p className="text-purple-600">
    //           Your money is 100% safe and secure on {APP_NAME}. No hassles, no glitches, get access to your money anytime.
    //         </p>
    //       </motion.div>
    //     </div>
    //   </motion.div>
    // </div>
    <section className="py-20 bg-gray-50">
  <div className="max-w-7xl mx-auto px-6 text-center">
    <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need in One App</h2>
    <p className="text-xl text-gray-600 mb-12">Fast, secure, and rewarding financial services at your fingertips.</p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {/* Feature 1 */}
      <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
          <svg className="w-10 h-10 text-[#09a353]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h3 className="text-2xl font-semibold mb-4">Instant Transfers</h3>
        <p className="text-gray-600">Send money to any bank or wallet instantly, with zero fees on select transfers.</p>
      </div>
      
      {/* Feature 2 */}
      <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
          <svg className="w-10 h-10 text-[#09a353]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h3 className="text-2xl font-semibold mb-4">Bill Payments</h3>
        <p className="text-gray-600">Pay electricity, airtime, data, cable TV, and more – all in seconds.</p>
      </div>
      
      {/* Feature 3 */}
      <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
          <svg className="w-10 h-10 text-[#09a353]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        </div>
        <h3 className="text-2xl font-semibold mb-4">Savings & Rewards</h3>
        <p className="text-gray-600">Earn high interest on savings and get cashback on everyday transactions.</p>
      </div>
      
      {/* Add more features as needed */}
    </div>
  </div>
</section>
  );
};

export default PromoSection;