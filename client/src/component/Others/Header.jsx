/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { APP_NAME } from '../utils/projectName';


import im from "../../assets/wallet2.png"
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-green-900 to-green-700 text-white p-3 flex justify-between items-center fixed w-full z-10 shadow-lg transition-all duration-300">
      <a href='/'>

<img 
className="h-12 font-bold tracking-wide text-green-200"
  src={im}
/>
               {/* <div className="text-3xl font-bold tracking-wide text-green-200">{APP_NAME}</div> */}
      </a>
 
      <nav className="hidden md:flex space-x-6">
        <a href="/" className="hover:text-green-300 transition-colors duration-200">Home</a>
        <a href="/contact" className="hover:text-green-300 transition-colors duration-200">Contact us</a>
        <a href="/login" className="hover:text-green-300 transition-colors duration-200">Login</a>
        <a href='/signup'>
                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200">Sign Up</button>
        </a>

      </nav>
      <div className="md:hidden flex items-center">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden absolute top-16 right-4 bg-green-800 p-4 rounded-lg shadow-lg flex flex-col space-y-4 w-40">
          <a href="/" className="hover:text-green-300 transition-colors duration-200">Home</a>
          <a href="/contact" className="hover:text-green-300 transition-colors duration-200">Contact us</a>
          <a href="/login" className="hover:text-green-300 transition-colors duration-200">Login</a>
          <a href='/signup'>
             <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200">Sign Up</button>
          </a>

        </div>
      )}
    </header>
  );
};

export default Header;