// CreateProfile.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Auth/AuthContext';
import Logo from '../../components/Logo';

const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT","DC", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN",
  "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

const popularCountries = ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "Japan", "Other"];

const CreateProfile = () => {
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    location: {
      city: '',
      state: '',
      country: '',
      otherCountry: ''
    },
    birthday: '',
    instagram: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const { refreshToken } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['city', 'state', 'country'].includes(name)) {
      setProfileData(prevData => ({
        ...prevData,
        location: {
          ...prevData.location,
          [name]: value
        }
      }));
    } else if (name === 'otherCountry') {
      setProfileData(prevData => ({
        ...prevData,
        location: {
          ...prevData.location,
          otherCountry: value
        }
      }));
    } else {
      setProfileData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = {
      ...profileData,
      location: {
        ...profileData.location,
        country: profileData.location.country === 'Other' ? profileData.location.otherCountry : profileData.location.country
      }
    };
    try {
      await refreshToken();
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/create-profile', submissionData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/');
    } catch (error) {
      setError('Failed to update profile. Please try again.');
    }
  };

  const renderFormPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <>
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-sm font-medium text-white">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={profileData.firstName}
                onChange={handleChange}
                required
                className="mt-1 p-2 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lastName" className="block text-sm font-medium text-white">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={profileData.lastName}
                onChange={handleChange}
                required
                className="mt-1 p-2 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              />
            </div>
            <div className="flex justify-between">
              <button onClick={() => setCurrentPage(currentPage + 1)} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Next
              </button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="mb-4">
              <label htmlFor="city" className="block text-sm font-medium text-white">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={profileData.location.city}
                onChange={handleChange}
                className="mt-1 p-2 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="state" className="block text-sm font-medium text-white">State</label>
              <select
                id="state"
                name="state"
                value={profileData.location.state}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              >
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="country" className="block text-sm font-medium text-white">Country</label>
              <select
                id="country"
                name="country"
                value={profileData.location.country}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              >
                {popularCountries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            {profileData.location.country === 'Other' && (
              <div className="mb-4">
                <label htmlFor="otherCountry" className="block text-sm font-medium text-white">Other Country</label>
                <input
                  type="text"
                  id="otherCountry"
                  name="otherCountry"
                  value={profileData.location.otherCountry}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                />
              </div>
            )}
            <div className="flex justify-between">
              <button onClick={() => setCurrentPage(currentPage - 1)} className="px-4 py-2 bg-black text-white border border-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                Back
              </button>
              <button onClick={() => setCurrentPage(currentPage + 1)} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Next
              </button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="mb-4">
              <label htmlFor="birthday" className="block text-sm font-medium text-white">Birthday</label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={profileData.birthday}
                onChange={handleChange}
                className="mt-1 p-2 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              />
            </div>
            <div className="flex justify-between">
              <button onClick={() => setCurrentPage(currentPage - 1)} className="px-4 py-2 bg-black text-white border border-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                Back
              </button>
              <button onClick={() => setCurrentPage(currentPage + 1)} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Next
              </button>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <div className="mb-4">
              <label htmlFor="instagram" className="block text-sm font-medium text-white">Instagram</label>
              <input
                type="text"
                id="instagram"
                name="instagram"
                value={profileData.instagram}
                onChange={handleChange}
                className="mt-1 p-2 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              />
            </div>
            <div className="flex justify-between">
              <button onClick={() => setCurrentPage(currentPage - 1)} className="px-4 py-2 bg-black text-white border border-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                Back
              </button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Submit
              </button>
            </div>
          </>
        );
      default:
        return <></>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Logo />
      <div className="max-w-md w-full space-y-8 p-6 rounded-md shadow-md">
        <h2 className="text-center text-2xl font-extrabold text-white mb-4">Complete Your Profile</h2>
        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          {renderFormPage()}
          {error && <div className="text-center text-red-500 text-sm">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;
