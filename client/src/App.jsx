/* eslint-disable no-unused-vars */
import React from 'react';
import Header from './component/Others/Header';
import { motion } from 'framer-motion';
import Home from './pages/Home';
import MobileDevice from './component/home/MobileDevice';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
const App = () => {
  return (
    <div>
      <Router>
        <Header /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mobile" element={<MobileDevice />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;