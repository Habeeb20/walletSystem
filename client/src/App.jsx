/* eslint-disable no-unused-vars */
import React from 'react';
import Header from './component/Others/Header';
import { motion } from 'framer-motion';
import Home from './pages/Home';
import MobileDevice from './component/home/MobileDevice';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Footer from './component/Others/Footer';
import SignupPage from './pages/auth/Signup';
import LoginPage from './pages/auth/LoginPage';
import VerifyEmailPage from './pages/auth/VerifyEmail';
const App = () => {
  return (
    <div>
      <Router>
        <Header /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/login' element={<LoginPage/>} />
          <Route path='/verifyemail' element={<VerifyEmailPage/>} />
          {/* <Route path="/mobile" element={<MobileDevice />} /> */}
        </Routes>
        <Footer/>
      </Router>
    </div>
  );
};

export default App;