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
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <motion.div
        ref={ref}
        className="max-w-6xl w-full bg-white rounded-lg shadow-lg p-6"
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="text-center mb-6"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h2 className="text-xl font-semibold text-gray-700">Make every penny count</h2>
          <p className="text-gray-600">
            Spend smarter, lower your bills, get cashback on everything you buy, and unlock credit to grow your business.
          </p>
        </motion.div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <motion.div
            className="bg-blue-100 p-6 rounded-lg w-full md:w-1/2"
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Pay with {APP_NAME}, quick, simple and easy</h3>
            <p className="text-blue-600">
              Paying your bills on {APP_NAME} has never been easier. Whether you are paying for electricity or internet, Habeeb gets it done within seconds.
            </p>
          </motion.div>
          <motion.div
            className="flex items-center justify-center w-full md:w-1/3"
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: { opacity: 1, scale: 1 },
            }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <MobileSection />
          </motion.div>
          <motion.div
            className="bg-purple-100 p-6 rounded-lg w-full md:w-1/3"
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="flex items-center justify-center mb-2">
              <span className="text-purple-800 text-2xl">✔</span>
            </div>
            <h3 className="text-lg font-semibold text-purple-800 mb-2">Bank level security</h3>
            <p className="text-purple-600">
              Your money is 100% safe and secure on {APP_NAME}. No hassles, no glitches, get access to your money anytime.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PromoSection;