/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-2xl text-gray-600 mt-4">Oops! Transaction Not Found</p>
        <p className="text-gray-500 mt-2">It seems you've wandered into an uncharted account. This page doesn't exist in your wallet system.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
        >
          Back to homepage
        </button>
      </div>
    </div>
  );
};

export default NotFound;