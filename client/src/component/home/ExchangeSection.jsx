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
  
    <section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-6 text-center">
    <h2 className="text-4xl font-bold text-gray-900 mb-12">Get Started in Minutes</h2>
    
     <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
      {/* Step 1 */}
      <div className=" bg-white border border-gray-100 rounded-3xl p-10 shadow-xl hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-500">
        <div className="">
          {/* Number Circle – now inside card, no overlap risk */}
          <div className="w-16 h-16 bg-[#09a353] text-white text-3xl font-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            1
          </div>

          {/* Icon */}
          <div className="w-12 h-12 mx-auto mb-6 text-[#09a353]">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            Sign Up Instantly
          </h3>
          <p className="text-gray-600 text-base leading-relaxed">
            It’s completely <span className="font-semibold text-[#09a353]">free, fast, and reliable</span>. Just enter your phone number and verify with BVN/NIN.
          </p>
        </div>
      </div>

      {/* Step 2 */}
      <div className=" bg-white border border-gray-100 rounded-3xl p-10 shadow-xl hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-500">
        <div className="">
          <div className="w-16 h-16 bg-[#09a353] text-white text-3xl font-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            2
          </div>

          <div className="w-12 h-12 mx-auto mb-6 text-[#09a353]">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            Complete Your Profile
          </h3>
          <p className="text-gray-600 text-base leading-relaxed">
            Add your address, gender, date of birth, and upload a valid ID — takes less than 2 minutes.
          </p>
        </div>
      </div>

      {/* Step 3 */}
      <div className=" bg-white border border-gray-100 rounded-3xl p-10 shadow-xl hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-500">
        <div className="">
          <div className="w-16 h-16 bg-[#09a353] text-white text-3xl font-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            3
          </div>

          <div className="w-12 h-12 mx-auto mb-6 text-[#09a353]">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            Start Transacting
          </h3>
          <p className="text-gray-600 text-base leading-relaxed">
            Fund your account and enjoy <span className="font-semibold text-[#09a353]">seamless banking</span> — transfers, bills, savings, and more!
          </p>
        </div>
      </div>
    </div>

  </div>
   <div className="mt-16 flex justify-center">
  <a
    href="/signup"
    className="relative z-10 inline-flex items-center gap-3 px-8 py-4 bg-[#09a353] text-white text-lg font-bold rounded-full shadow-xl hover:shadow-2xl hover:bg-[#08b058] transform hover:scale-105 transition-all duration-300"
  >
    Open Your Account Now
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  </a>
</div>
</section>
  );
};

export default ExchangeSection;


































<section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 via-white to-gray-50">
  {/* Subtle background decoration */}
  <div className="absolute inset-0">
    <div className="top-20 left-10 w-96 h-96 bg-[#09a353]/5 rounded-full blur-3xl"></div>
    <div className="bottom-20 right-10 w-80 h-80 bg-[#09a353]/10 rounded-full blur-3xl"></div>
  </div>

  <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
    {/* Section Header – reduced sizes */}
    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
      Get Started in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#09a353] to-[#0ca959]">Minutes</span>
    </h2>
    <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto font-light">
      Open your account in 3 simple steps — no paperwork, no stress.
    </p>

    {/* Step Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
      {/* Step 1 */}
      <div className=" bg-white border border-gray-100 rounded-3xl p-10 shadow-xl hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-500">
        <div className="">
          {/* Number Circle – now inside card, no overlap risk */}
          <div className="w-16 h-16 bg-[#09a353] text-white text-3xl font-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            1
          </div>

          {/* Icon */}
          <div className="w-12 h-12 mx-auto mb-6 text-[#09a353]">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            Sign Up Instantly
          </h3>
          <p className="text-gray-600 text-base leading-relaxed">
            It’s completely <span className="font-semibold text-[#09a353]">free, fast, and reliable</span>. Just enter your phone number and verify with BVN/NIN.
          </p>
        </div>
      </div>

      {/* Step 2 */}
      <div className=" bg-white border border-gray-100 rounded-3xl p-10 shadow-xl hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-500">
        <div className="">
          <div className="w-16 h-16 bg-[#09a353] text-white text-3xl font-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            2
          </div>

          <div className="w-12 h-12 mx-auto mb-6 text-[#09a353]">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            Complete Your Profile
          </h3>
          <p className="text-gray-600 text-base leading-relaxed">
            Add your address, gender, date of birth, and upload a valid ID — takes less than 2 minutes.
          </p>
        </div>
      </div>

      {/* Step 3 */}
      <div className=" bg-white border border-gray-100 rounded-3xl p-10 shadow-xl hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-500">
        <div className="">
          <div className="w-16 h-16 bg-[#09a353] text-white text-3xl font-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            3
          </div>

          <div className="w-12 h-12 mx-auto mb-6 text-[#09a353]">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            Start Transacting
          </h3>
          <p className="text-gray-600 text-base leading-relaxed">
            Fund your account and enjoy <span className="font-semibold text-[#09a353]">seamless banking</span> — transfers, bills, savings, and more!
          </p>
        </div>
      </div>
    </div>

    {/* Final CTA – slightly smaller */}
    <div className="mt-16">
      <a
        href="/signup"
        className="inline-flex items-center gap-3 px-8 py-4 bg-[#09a353] text-white text-lg font-bold rounded-full shadow-xl hover:shadow-2xl hover:bg-[#08b058] transform hover:scale-105 transition-all duration-300"
      >
        Open Your Account Now
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </a>
    </div>
  </div>
</section>