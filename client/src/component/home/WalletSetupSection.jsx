/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { APP_NAME } from '../utils/projectName';

const WalletSetupSection = () => {
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
    // <div className="bg-gray-50 min-h-screen flex items-center text-1xl font-bold justify-center p-4">
    //   <motion.div
    //     ref={ref}
    //     className="max-w-5xl w-full bg-white p-6 border-t-2 border-gray-200"
    //     initial="hidden"
    //     animate={controls}
    //     variants={{
    //       hidden: { opacity: 0, y: 50 },
    //       visible: { opacity: 1, y: 0 },
    //     }}
    //     transition={{ duration: 0.8 }}
    //   >
    //     {/* Steps Section */}
    //     <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
    //       {/* Step 1 */}
    //       <motion.div
    //         className="text-center"
    //         variants={{
    //           hidden: { opacity: 0, x: -50 },
    //           visible: { opacity: 1, x: 0 },
    //         }}
    //         transition={{ delay: 0.4, duration: 0.8 }}
    //       >
    //         <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2 mx-auto">
    //           <span className="text-green-600 text-2xl">1</span>
    //         </div>
    //         <div className="w-10 h-10 bg-green-50 rounded flex items-center justify-center mb-2 mx-auto">
    //           <span className="text-green-600">✔</span>
    //         </div>
    //         <h3 className="text-lg font-semibold text-gray-800 mb-2">Create Your Wallet</h3>
    //         <p className="text-gray-600">
    //           Sign up in seconds with just your email and phone number. Your secure digital wallet is ready instantly - no paperwork, no waiting.
    //         </p>
    //         <ul className="text-green-600 list-disc list-inside mt-2">
    //           <li>Instant setup</li>
    //           <li>Bank-level security</li>
    //           <li>No hidden fees</li>
    //         </ul>
    //       </motion.div>

    //       {/* Step 2 */}
    //       <motion.div
    //         className="text-center"
    //         variants={{
    //           hidden: { opacity: 0, x: 0 },
    //           visible: { opacity: 1, x: 0 },
    //         }}
    //         transition={{ delay: 0.6, duration: 0.8 }}
    //       >
    //         <div className="w-4 h-2 bg-gray-300 rounded-full mx-auto mb-4">•••</div>
    //         <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2 mx-auto">
    //           <span className="text-green-600 text-2xl">2</span>
    //         </div>
    //         <div className="w-10 h-10 bg-green-50 rounded flex items-center justify-center mb-2 mx-auto">
    //           <span className="text-green-600"></span>
    //         </div>
    //         <h3 className="text-lg font-semibold text-gray-800 mb-2">Link Your Bank Account</h3>
    //         <p className="text-gray-600">
    //           Securely connect your existing bank account using our encrypted platform. Works with all major Nigerian banks - GTBank, Access, UBA, and more.
    //         </p>
    //         <ul className="text-green-600 list-disc list-inside mt-2">
    //           <li>All major banks supported</li>
    //           <li>256-bit encryption</li>
    //           <li>One-time setup</li>
    //         </ul>
    //       </motion.div>

    //       {/* Step 3 */}
    //       <motion.div
    //         className="text-center"
    //         variants={{
    //           hidden: { opacity: 0, x: 50 },
    //           visible: { opacity: 1, x: 0 },
    //         }}
    //         transition={{ delay: 0.8, duration: 0.8 }}
    //       >
    //         <div className="w-4 h-2 bg-gray-300 rounded-full mx-auto mb-4">•••</div>
    //         <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2 mx-auto">
    //           <span className="text-green-600 text-2xl">3</span>
    //         </div>
    //         <div className="w-10 h-10 bg-green-50 rounded flex items-center justify-center mb-2 mx-auto">
    //           <span className="text-green-600">★</span>
    //         </div>
    //         <h3 className="text-lg font-semibold text-gray-800 mb-2">Automate Everything</h3>
    //         <p className="text-gray-600">
    //           Set up automatic savings goals, wallet top-ups, and recurring payments. Your money works smarter while you focus on what matters most.
    //         </p>
    //         <ul className="text-green-600 list-disc list-inside mt-2">
    //           <li>Smart savings goals</li>
    //           <li>Auto wallet funding</li>
    //           <li>Recurring payments</li>
    //         </ul>
    //       </motion.div>
    //     </div>

    //     {/* Call to Action */}
    //     <motion.div
    //       className="text-center mt-8"
    //       variants={{
    //         hidden: { opacity: 0 },
    //         visible: { opacity: 1 },
    //       }}
    //       transition={{ delay: 1.0, duration: 0.8 }}
    //     >
    //       <p className="text-gray-500 mb-4">Ready to take control of your money?</p>
    //       <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-300">
    //         Start Your E-Wallet Journey
    //       </button>
    //     </motion.div>
    //   </motion.div>
    // </div>
    <>

    </>

 
  );
};

export default WalletSetupSection;