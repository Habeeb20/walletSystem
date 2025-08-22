import { useEffect } from 'react';
import { motion } from 'framer-motion';
import MobileDevice from './MobileDevice';
import im from "./../../assets/Rich 💰 Mindset.jpg";

const HeroSection = () => {
  useEffect(() => {
    const handleScroll = () => {
      const phone = document.querySelector('.phone');
      if (phone) {
        const rect = phone.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight) {
          phone.classList.add('fadeIn');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
        duration: 1.2,
        ease: 'easeOut',
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: 'easeOut' } },
  };

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{
        background: `linear-gradient(to bottom, rgba(10, 48, 33, 0.7), rgba(20, 120, 70, 0.7)), url(${im}) no-repeat center center/cover`,
      }}
    >
      <div className="text-white min-h-screen flex flex-col md:flex-row items-center justify-between p-6 md:p-12">
        {/* Text on the Left */}
        <motion.div
          className="w-full md:w-1/2 text-center md:text-left pr-0 md:pr-8 mb-8 md:mb-0 mt-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={childVariants}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Automated Savings, Smarter Wallet
          </motion.h1>
          <motion.p
            variants={childVariants}
            className="text-base md:text-xl mb-6"
          >
            Directly From Your Bank Account
          </motion.p>
          <motion.p
            variants={childVariants}
            className="text-sm md:text-base mb-6"
          >
            Never run out of funds again. Save automatically, spend smartly, and manage your money effortlessly with bank-level security.
          </motion.p>
          <motion.div
            variants={childVariants}
            className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4"
          >
            <button className="bg-white text-green-700 px-6 py-3 rounded mb-6 hover:bg-gray-200">
              Get Started
            </button>
            <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded mb-6 hover:bg-white hover:text-green-700">
              Link Bank Account
            </button>
          </motion.div>
        </motion.div>
        {/* Mobile Device on the Right */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end pr-0 md:pr-40">
          <motion.div
            className="phone fadeIn"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <MobileDevice />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;