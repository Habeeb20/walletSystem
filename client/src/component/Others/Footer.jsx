import React from 'react';
import {APP_NAME} from "../utils/projectName.js"
const Footer = () => {
  return (
    <footer className="bg-green-900 text-white py-6 px-4 md:px-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {/* Logo and Tagline */}
        <div className="flex flex-col items-start">
          <div className="flex items-center mb-2">
            <span className="text-2xl font-bold text-green-200">{APP_NAME}</span>
          </div>
          <p className="text-sm text-green-300">Start spending the smart way</p>
        </div>

        {/* Resources Section */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-green-200 mb-2">Resources</h3>
          <ul className="space-y-1 text-sm text-green-300">
            <li><a href="/contact" className="hover:text-green-100">Contact Us</a></li>
            <li><a href="/login" className="hover:text-green-100">Login</a></li>

          </ul>
        </div>

        {/* App Download Section */}
       
      </div>

      {/* Bottom Section */}
      <div className="mt-6 pt-4 border-t border-green-700 text-center md:text-left">
        <p className="text-xs text-green-400">© 2025.  All rights reserved.</p>
        {/* <div className="flex justify-center md:justify-end mt-2 space-x-4">
          <a href="#twitter" className="text-green-400 hover:text-green-200"><span className="sr-only">Twitter</span>🐦</a>
          <a href="#linkedin" className="text-green-400 hover:text-green-200"><span className="sr-only">LinkedIn</span>⬇️</a>
          <a href="#facebook" className="text-green-400 hover:text-green-200"><span className="sr-only">Facebook</span>👍</a>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;