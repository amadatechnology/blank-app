// VerifyEmail.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../Logo';
import { useAuth } from '../../Auth/AuthContext';
import axios from 'axios';

const VerifyEmail = () => {
  const { currentUser, logout } = useAuth();
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [displayedEmail, setDisplayedEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Assuming currentUser contains an email property
    const email = currentUser?.email;

    if (!email) {
      console.error("Email not found in currentUser");
      // You might want to handle this case, perhaps redirect to another page
      navigate('/login');
      return;
    }

    setDisplayedEmail(email);

    // Do not automatically send verification code on component mount
  }, [currentUser, navigate]);

  const handleSendVerificationCode = async () => {
    try {
      const email = displayedEmail;
      if (!email) {
        console.error("Email not found in currentUser");
        return;
      }

      const response = await axios.post('http://localhost:3001/verify-email', { email });

      console.log("Verification code sent successfully", response.data);
      setIsCodeSent(true);
    } catch (error) {
      console.error("Error sending verification code:", error.message);
      setIsCodeSent(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await axios.post('http://localhost:3001/verify-code', {
        email: displayedEmail,
        code: verificationCode,
      });

      console.log("Verification successful", response.data);
      navigate('/create-profile');
    } catch (error) {
      console.error("Verification error:", error.message);
      setError("Invalid verification code");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center bg-black text-white"
    >
      <Logo />
      <div className="max-w-md w-full space-y-8">
        <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleVerifyCode(); }}>
          <div>
            <p className="text-sm text-gray-400">A verification code has been sent to: {displayedEmail}</p>
          </div>
          <div>
            <label htmlFor="verificationCode" className="block text-sm font-medium text-white">
              Verification Code
            </label>
            <input
              type="text"
              id="verificationCode"
              name="verificationCode"
              autoComplete="verification-code"
              required
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="mt-1 p-2 w-full text-black border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <button
              type="button"
              onClick={handleSendVerificationCode}
              disabled={isCodeSent}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              {isCodeSent ? 'Resend Verification Code' : 'Send Verification Code'}
            </button>
          </div>
          <div>
            <button
              type="submit"
              disabled={!isCodeSent}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Verify Code
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2">
              {error}
            </p>
          )}
        </form>
      </div>
      <Link to="/login" className="mt-8 text-lg underline" onClick={logout}>
        Go to Login
      </Link>
    </motion.div>
  );
};

export default VerifyEmail;
