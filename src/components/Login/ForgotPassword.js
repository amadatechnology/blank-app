import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    try {
      // Update the URL to your API endpoint for password reset
      await axios.post('http://localhost:3001/forgot-password', { email });
      setMessage('Check your email for the password reset link.');
    } catch (error) {
      setError('Failed to send password reset email. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Reset Your Password</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          {message && <div className="text-center text-green-500 text-sm mt-2">{message}</div>}
          {error && <div className="text-center text-red-500 text-sm mt-2">{error}</div>}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Send Reset Link
            </button>
          </div>
        </form>
        <div className="mt-4">
          <Link to="/login" className="flex items-center justify-center font-medium text-indigo-500 hover:text-indigo-600">
            <FiArrowLeft className="mr-2" />Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
