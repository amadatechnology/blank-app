import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useParams(); // Assuming your route parameter is named 'token'

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setMessage('');
    setError('');
    try {
      // Update the URL to your API endpoint for password resetting
      await axios.post('http://localhost:3001/reset-password', { token, newPassword: password });
      setMessage('Your password has been reset successfully.');
      setTimeout(() => navigate('/login'), 3000); // Navigate back to login after a short delay
    } catch (error) {
      setError('Failed to reset password. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Reset Your Password</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="password" className="sr-only">New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              Reset Password
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

export default ResetPassword;
