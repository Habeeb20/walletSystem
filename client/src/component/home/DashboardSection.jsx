/* eslint-disable no-unused-vars */
// import { useEffect } from 'react';
// import { motion, useAnimation } from 'framer-motion';
// import { useInView } from 'react-intersection-observer';
// import { APP_NAME } from '../utils/projectName';

// const DashboardSection = () => {
//   const controls = useAnimation();
//   const [ref, inView] = useInView({ threshold: 0.2 });

//   useEffect(() => {
//     if (inView) {
//       controls.start('visible');
//     } else {
//       controls.start('hidden');
//     }
//   }, [controls, inView]);

//   return (
//     <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
//       <motion.div
//         ref={ref}
//         className="max-w-5xl w-full bg-white p-6 border-t-2 border-gray-200"
//         initial="hidden"
//         animate={controls}
//         variants={{
//           hidden: { opacity: 0, y: 50 },
//           visible: { opacity: 1, y: 0 },
//         }}
//         transition={{ duration: 0.8 }}
//       >
//         {/* Recent Transactions */}
//         <motion.div
//           className="mb-6"
//           variants={{
//             hidden: { opacity: 0, x: -50 },
//             visible: { opacity: 1, x: 0 },
//           }}
//           transition={{ delay: 0.4, duration: 0.8 }}
//         >
//           <div className="flex justify-between items-center mb-2">
//             <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
//             <a href="#" className="text-green-600 text-sm">View All</a>
//           </div>
//           <div className="space-y-2">
//             <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
//               <div className="flex items-center">
//                 <span className="w-6 h-6 bg-gray-300 rounded-full mr-2"></span>
//                 <span>Connect Nest Hub</span>
//               </div>
//               <span className="text-red-600">-NGN 49.99</span>
//               <span className="text-gray-500 text-sm">May 15, 2025</span>
//             </div>
//             <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
//               <div className="flex items-center">
//                 <span className="w-6 h-6 bg-gray-300 rounded-full mr-2"></span>
//                 <span>Salary Deposit</span>
//               </div>
//               <span className="text-green-600">+NGN 3,450.00</span>
//               <span className="text-gray-500 text-sm">May 12, 2025</span>
//             </div>
//             <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
//               <div className="flex items-center">
//                 <span className="w-6 h-6 bg-gray-300 rounded-full mr-2"></span>
//                 <span>Health Insurance</span>
//               </div>
//               <span className="text-red-600">-NGN 189.50</span>
//               <span className="text-gray-500 text-sm">May 10, 2025</span>
//             </div>
//             <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
//               <div className="flex items-center">
                 
//                 <span className="w-6 h-6 bg-gray-300 rounded-full mr-2"></span>
//                 <span>Investment Return</span>
//               </div>
//               <span className="text-green-600">+NGN 125.32</span>
//               <span className="text-gray-500 text-sm">May 8, 2025</span>
//             </div>
//           </div>
//         </motion.div>

//         {/* Spending Analysis and Savings Goals */}
//         <div className="flex flex-col md:flex-row gap-6">
//           {/* Spending Analysis */}
//           <motion.div
//             className="w-full md:w-1/2 p-4 bg-gray-50 rounded-lg"
//             variants={{
//               hidden: { opacity: 0, x: -50 },
//               visible: { opacity: 1, x: 0 },
//             }}
//             transition={{ delay: 0.6, duration: 0.8 }}
//           >
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">Spending Analysis</h3>
//             <div className="w-full h-48 bg-green-100 rounded-full flex items-center justify-center">
//               {/* Placeholder for Pie Chart */}
//             </div>
//             <ul className="text-gray-600 mt-2 space-y-1">
//               <li><span className="w-3 h-3 bg-green-600 inline-block mr-2 rounded-full"></span>Housing</li>
//               <li><span className="w-3 h-3 bg-green-400 inline-block mr-2 rounded-full"></span>Food</li>
//               <li><span className="w-3 h-3 bg-green-300 inline-block mr-2 rounded-full"></span>Transportation</li>
//               <li><span className="w-3 h-3 bg-green-200 inline-block mr-2 rounded-full"></span>Entertainment</li>
//               <li><span className="w-3 h-3 bg-green-100 inline-block mr-2 rounded-full"></span>Utilities</li>
//               <li><span className="w-3 h-3 bg-gray-300 inline-block mr-2 rounded-full"></span>Others</li>
//             </ul>
//           </motion.div>

//           {/* Savings Goals */}
//           <motion.div
//             className="w-full md:w-1/2 p-4 bg-gray-50 rounded-lg"
//             variants={{
//               hidden: { opacity: 0, x: 50 },
//               visible: { opacity: 1, x: 0 },
//             }}
//             transition={{ delay: 0.8, duration: 0.8 }}
//           >
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">Savings Goals</h3>
//             <div className="space-y-4">
//               <div className="flex justify-between text-sm">
//                 <span>Vacation</span>
//                 <span>NGN 1,200 / NGN 3,000</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2.5">
//                 <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '40%' }}></div>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span>New Laptop</span>
//                 <span>NGN 850 / NGN 1,500</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2.5">
//                 <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '56.67%' }}></div>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span>Emergency Fund</span>
//                 <span>NGN 5,300 / NGN 10,000</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2.5">
//                 <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '53%' }}></div>
//               </div>
//               <button className="w-full bg-green-600 text-white py-2 rounded-lg mt-4 hover:bg-green-700 transition duration-300">
//                 Add New Goal
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default DashboardSection;













import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { APP_NAME } from '../utils/projectName';
import WalletLoadingAnimation from '../../resources/wallet';

const DashboardSection = () => {
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
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <motion.div
        ref={ref}
        className="max-w-5xl w-full bg-white p-6 border-t-2 border-gray-200"
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.8 }}
      >
        {/* Recent Transactions */}
        <motion.div
          className="mb-6"
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0 },
          }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
            <a href="#" className="text-green-600 text-sm">View All</a>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-6 h-6 mr-2">
                  {/* <WalletLoadingAnimation /> */}
                </div>
                <span>Connect Nest Hub</span>
              </div>
              <span className="text-red-600">-NGN 49.99</span>
              <span className="text-gray-500 text-sm">May 15, 2025</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-6 h-6 mr-2">
                  {/* <WalletLoadingAnimation /> */}
                </div>
                <span>Salary Deposit</span>
              </div>
              <span className="text-green-600">+NGN 3,450.00</span>
              <span className="text-gray-500 text-sm">May 12, 2025</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-6 h-6 mr-2">
                  {/* <WalletLoadingAnimation /> */}
                </div>
                <span>Health Insurance</span>
              </div>
              <span className="text-red-600">-NGN 189.50</span>
              <span className="text-gray-500 text-sm">May 10, 2025</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-6 h-6 mr-2">
                
                </div>
                <span>Investment Return</span>
              </div>
              <span className="text-green-600">+NGN 125.32</span>
              <span className="text-gray-500 text-sm">May 8, 2025</span>
            </div>
          </div>
        </motion.div>

        {/* Spending Analysis and Savings Goals */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Spending Analysis */}
          <motion.div
            className="w-full md:w-1/2 p-4 bg-gray-50 rounded-lg"
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Spending Analysis</h3>
            <div className="w-full h-48 bg-green-100 rounded-full flex items-center justify-center">
              <WalletLoadingAnimation />
            </div>
            <ul className="text-gray-600 mt-2 space-y-1">
              <li><span className="w-3 h-3 bg-green-600 inline-block mr-2 rounded-full"></span>Housing</li>
              <li><span className="w-3 h-3 bg-green-400 inline-block mr-2 rounded-full"></span>Food</li>
              <li><span className="w-3 h-3 bg-green-300 inline-block mr-2 rounded-full"></span>Transportation</li>
              <li><span className="w-3 h-3 bg-green-200 inline-block mr-2 rounded-full"></span>Entertainment</li>
              <li><span className="w-3 h-3 bg-green-100 inline-block mr-2 rounded-full"></span>Utilities</li>
              <li><span className="w-3 h-3 bg-gray-300 inline-block mr-2 rounded-full"></span>Others</li>
            </ul>
          </motion.div>

          {/* Savings Goals */}
          <motion.div
            className="w-full md:w-1/2 p-4 bg-gray-50 rounded-lg"
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Savings Goals</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Vacation</span>
                <span>NGN 1,200 / NGN 3,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '40%' }}></div>
              </div>
              <div className="flex justify-between text-sm">
                <span>New Laptop</span>
                <span>NGN 850 / NGN 1,500</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '56.67%' }}></div>
              </div>
              <div className="flex justify-between text-sm">
                <span>Emergency Fund</span>
                <span>NGN 5,300 / NGN 10,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '53%' }}></div>
              </div>
              <button className="w-full bg-green-600 text-white py-2 rounded-lg mt-4 hover:bg-green-700 transition duration-300">
                Add New Goal
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardSection;