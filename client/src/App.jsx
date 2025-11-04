


/* eslint-disable no-unused-vars */
import React from 'react';
import Header from './component/Others/Header';
import { motion } from 'framer-motion';
import Home from './pages/Home';
import MobileDevice from './component/home/MobileDevice';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Footer from './component/Others/Footer';
import SignupPage from './pages/auth/Signup';
import LoginPage from './pages/auth/LoginPage';
import VerifyEmailPage from './pages/auth/VerifyEmail';
import Dashboard from './pages/Dashboard/Dashboard';
import NotFound from './resources/NotFound';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import ErrorModal from './component/ErrorModal';

const AppContent = () => {
  const location = useLocation();
   const dispatch = useDispatch();
  const { error } = useSelector((state) => state.transfer);
  const [retryAction, setRetryAction] = useState(null);

  const handleRetry = () => {
    if (retryAction) retryAction();
    setRetryAction(null);
  };

  // Render Header and Footer only for routes other than /dashboard
  const showHeaderFooter = location.pathname !== '/dashboard';

  return (
    <div>
      {showHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verifyemail" element={<VerifyEmailPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showHeaderFooter && <Footer />}

        <ErrorModal
        error={error}
        onRetry={() => {
          handleRetry();
          dispatch({ type: 'transfer/clearError' });
        }}
      />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;




































