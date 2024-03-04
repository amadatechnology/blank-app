// src/components/WelcomeModal.js
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { auth } from '../firebase';

const WelcomeModal = ({ closeModal }) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Fetch the user's display name from Firebase Authentication
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName);
    }
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-blur">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black p-8 rounded-md shadow-md text-white"
      >
        <button
          onClick={closeModal}
          className="text-white text-2xl font-bold absolute top-2 right-2 cursor-pointer"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">
          Welcome to Blank Locations, {userName}!
        </h2>
        <p className="mb-4">
          Thank you for joining our community. We're excited to have you on board.
        </p>
      </motion.div>
    </div>
  );
};

export default WelcomeModal;
