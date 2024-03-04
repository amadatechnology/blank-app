// AuthContext.js
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('currentUser')));
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [authError, setAuthError] = useState(null);

  const setAuthToken = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const clearAuthToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expires');
    localStorage.removeItem('userId');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  const checkSession = async () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      try {
        // Fetch current user data
        const response = await axios.get('http://localhost:3001/current-user');
        const userData = response.data;
        updateCurrentUser(userData);
      } catch (error) {
        console.error('Error fetching current user data:', error);
      }
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const updateCurrentUser = useCallback(async (userData, callback) => {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('userId', userData.id);  // Save userId to localStorage
    setCurrentUser(userData);

    // Execute the callback if provided
    if (callback && typeof callback === 'function') {
      callback();
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.post('http://localhost:3001/refresh-token', {
        refreshToken: localStorage.getItem('refreshToken'),
      });

      const { accessToken } = response.data;

      if (accessToken) {
        setAuthToken(accessToken);
      } else {
        console.error('Refresh token failed with unexpected server response:', response.data);
        clearAuthToken();
        navigate('/login');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      clearAuthToken();
      navigate('/login');
    }
  }, [navigate]);

  const logout = useCallback(() => {
    clearAuthToken();
    navigate('/login');
  }, [navigate]);

  const login = useCallback(async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3001/login', { email, password });
      const { accessToken, refreshToken, tokenExpires, user } = response.data;

      if (accessToken && user) {
        setAuthToken(accessToken);

        // Save refreshToken to localStorage
        localStorage.setItem('refreshToken', refreshToken);

        // Include user information in the response
        updateCurrentUser({
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          emailVerified: user.emailVerified,
          profileComplete: user.profileComplete,
          role: user.role,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
          followers: user.followers.length,
          following: user.following.length,
          ips: user.ips,
          interests: user.interests,
          attending: user.attending,
          location: user.location
          // Include other necessary user data
        });

        if (user.emailVerified) {
          if (user.profileComplete) {
            navigate('/');
          } else {
            navigate('/create-profile');
          }
        } else {
          navigate('/verify-email');
        }
      } else {
        console.error('Login failed with unexpected server response:', response.data);
      }
    } catch (error) {
      // If the error is related to an expired token, try refreshing the token
      if (error.response && error.response.status === 403) {
        refreshToken();
      } else {
        console.error('Login Error:', error);
        clearAuthToken();
        navigate('/login');
      }
    }
  }, [navigate, updateCurrentUser, refreshToken]);

  const register = useCallback(async (email, password, verifyPassword) => {
    try {
      if (password !== verifyPassword) {
        setAuthError('Passwords do not match.');
        return false;
      }
  
      const normalizedEmail = email.toLowerCase();
  
      const response = await axios.post('http://localhost:3001/register', { email: normalizedEmail, password });
      const data = response.data;
  
      if (data.accessToken && data.user) {
        localStorage.setItem('email', normalizedEmail);
        setAuthToken(data.accessToken);
  
        // Save refreshToken to localStorage during registration
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
  
        // Include user information in the response
        updateCurrentUser({
          id: data.user.id,
          email: normalizedEmail,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          phone: data.user.phone,
          emailVerified: data.user.emailVerified,
          profileComplete: data.user.profileComplete,
          role: data.user.role,
          createdAt: data.user.createdAt,
          lastLogin: data.user.lastLogin,
          followers: data.user.followers.length,
          following: data.user.following.length,
          ips: data.user.ips,
          interests: data.user.interests,
          attending: data.user.attending,
          location: data.user.location
          // Include other necessary user data
        });
  
        // Navigate based on registration status
        if (!data.user.emailVerified) {
          navigate('/verify-email');
        } else if (!data.user.profileComplete) {
          navigate('/create-profile');
        } else {
          navigate('/');
        }
  
        return true;
      } else {
        console.error('Registration succeeded but did not receive expected data:', data);
        setAuthError('Failed to register. Unexpected server response.');
        return false;
      }
    } catch (error) {
      console.error('Registration Error:', error);
      setAuthError(`Failed to register. Please try again. ${error.message || ''}`);
      return false;
    }
  }, [navigate, updateCurrentUser, setAuthError, setAuthToken]);

  return (
    <AuthContext.Provider value={{ currentUser, token, login, logout, register, authError, setAuthError, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};
