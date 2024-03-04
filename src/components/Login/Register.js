import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Auth/AuthContext'; // Adjust import path as needed
import Logo from '../../components/Logo'; // Ensure the Logo component's path is correct

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext); // Assuming there is a register function in AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(''); // Reset error before attempting to register

    try {
      const success = await register(email, password, confirmPassword);
      if (success) {
        navigate('/verify-email'); // Navigate to verify-email on successful registration
      } else {
        setError('Failed to register. Please try again.');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Failed to register. Please try again.');
      } else if (err.request) {
        setError('The server did not respond. Please check your internet connection and try again.');
      } else {
        setError('An error occurred during registration. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <Logo /> {/* Ensure Logo is properly centered and styled */}
      <div className="max-w-md w-full space-y-8">
        <div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
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
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Register
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-white text-sm">
          Already have an account? 
          <button 
            onClick={() => navigate('/login')} 
            className="font-medium pl-4 text-indigo-600 hover:text-indigo-500"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
