/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { APP_NAME } from '../utils/projectName';
import m1 from "../../assets/Image.png"
import m2 from "../../assets/Rectangle 4519.png"
import m3 from "../../assets/Rectangle 4521.png"
import m4 from "../../assets/Rectangle 4525.png"
import m5 from "../../assets/Rectangle 4522.png"
import m6 from "../../assets/Rectangle 4532.png"
import m7 from "../../assets/Rectangle 4536.png"
const ExchangeSection = () => {
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
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <motion.div
        ref={ref}
        className="max-w-7xl w-full bg-white rounded-lg shadow-lg p-6 border-4 "
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Panel */}
          <motion.div
            className="bg-orange-100 p-6 rounded-lg w-full h-[400px] md:w-1/3 flex items-center justify-center"
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-400 rounded-full mb-2 flex items-center justify-center">
                {/* Placeholder for Cost Reduction Icon */}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Cost reduction</h3>
              <p className="text-gray-600">
                {APP_NAME} reduced payments maintenance and processing fees. No hidden fees
              </p>
            </div>
          </motion.div>

          {/* Right Panel */}
          <motion.div
            className="bg-gray-100 p-6 h-[400px] rounded-lg w-full md:w-2/3 flex items-center"
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="text-center w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Send, receive and Exchange money</h3>
              <p className="text-blue-600 mb-4 text-2xl">
                Transfers, payments all work on {APP_NAME}. Get your alert message immediately after a completed transaction.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {m2 && <img src={m2} alt="Bank 1" className="w-15 h-15 object-contain" />}
                <div className="w-10 h-10 bg-gray-300 rounded flex items-center justify-center">
      {m3 && <img src={m3} alt="Bank 1" className="w-15 h-15 object-contain" />}
                </div>
                <div className="w-10 h-10 bg-gray-300 rounded flex items-center justify-center">
                    {m4 && <img src={m4} alt="Bank 1" className="w-15 h-15 object-contain" />}
                </div>
                <div className="w-10 h-10 bg-gray-300 rounded flex items-center justify-center">
                    {m5 && <img src={m5} alt="Bank 1" className="w-15 h-15 object-contain" />}
                </div>
                <div className="w-10 h-10 bg-gray-300 rounded flex items-center justify-center">
      {m6 && <img src={m6} alt="Bank 1" className="w-15 h-15 object-contain" />}
                </div>
                <div className="w-10 h-10 bg-gray-300 rounded flex items-center justify-center">
                    {m7 && <img src={m7} alt="Bank 1" className="w-15 h-15 object-contain" />}
                </div>
              </div>
              <div className="mt-4 text-right text-blue-600">
                stripe <span className="font-bold">74.42 x 74.42</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExchangeSection;