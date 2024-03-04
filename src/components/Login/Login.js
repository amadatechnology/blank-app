import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../Auth/AuthContext'; // Adjust the path as needed
import Logo from '../../components/Logo'; // Adjust the path as needed for Logo component

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to manage error messages
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard'); // Navigate to the dashboard or home page upon successful login
      } else {
        setError('Invalid login credentials. Please try again.'); // Handle unsuccessful login attempts
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials and try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="w-full flex justify-center"> {/* Ensure Logo component is centered */}
        <Logo />
      </div>
      <div className="max-w-md w-full space-y-8">
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
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
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <div className="text-center text-red-500 text-sm mt-2">{error}</div>}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Sign in
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-white text-sm">
          Don't have an account? 
          <button 
            onClick={() => navigate('/signup')} 
            className="font-medium text-indigo-600 pl-4 hover:text-indigo-500"
          >
            Sign Up
          </button>
        </p>
        <p className="mt-2 text-center text-white text-sm">
            <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
              Forgot Password?
            </Link>
          </p>
      </div>
    </div>
  );
};

export default Login;
