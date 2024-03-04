import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaInstagram, FaTwitter, FaLink, FaChevronLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const EditProfile = () => {
  const [profile, setProfile] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    biography: '',
    instagramUsername: '',
    twitterUsername: '',
    websiteURL: '',
    organizationProfileURL: '',
    displayNumberOfAttendees: false,
  });
  const [initialProfile, setInitialProfile] = useState({});
  const [isChanged, setIsChanged] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUserData = JSON.parse(localStorage.getItem('currentUser')) || {};
    setProfile({
      ...profile,
      ...currentUserData,
    });
    setInitialProfile({ ...currentUserData });
  }, []);

  useEffect(() => {
    setIsChanged(JSON.stringify(profile) !== JSON.stringify(initialProfile));
  }, [profile, initialProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem('currentUser', JSON.stringify(profile));
    try {
      const response = await axios.put('/api/profile', profile);
      console.log(response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-12">
      <div className="container mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-white mb-4"
        >
          <FaChevronLeft className="mr-2" /> Back to Profile
        </button>
        <div className="mb-4 text-center">
          <div className="w-24 h-24 md:w-40 md:h-40 rounded-full border-4 border-gray-600 overflow-hidden mx-auto">
            <img
              src="/path-to-profile-image.jpg"
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </div>
          <button
            className="text-sm bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-full mt-4"
            onClick={() => navigate(`/user/${profile.id}`)}
          >
            View Profile
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-bold mb-2">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
              className="w-full bg-gray-800 rounded-md border border-gray-700 text-white p-2"
              placeholder="First Name"
              maxLength="16"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-bold mb-2">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
              className="w-full bg-gray-800 rounded-md border border-gray-700 text-white p-2"
              placeholder="Last Name"
              maxLength="16"
            />
          </div>
          <div>
            <label htmlFor="biography" className="block text-sm font-bold mb-2">Biography</label>
            <textarea
              id="biography"
              name="biography"
              value={profile.biography}
              onChange={handleChange}
              className="w-full bg-gray-800 rounded-md border border-gray-700 text-white p-2 h-32"
              placeholder="Tell us a little about yourself"
              maxLength="300"
            />
          </div>
          <div className="flex items-center space-x-2">
            <FaInstagram />
            <input
              type="text"
              id="instagramUsername"
              name="instagramUsername"
              value={profile.instagramUsername}
              onChange={handleChange}
              className="w-full bg-gray-800 rounded-md border border-gray-700 text-white p-2"
              placeholder="@instagramUsername"
              maxLength="16"
            />
          </div>
          <div className="flex items-center space-x-2">
            <FaTwitter />
            <input
              type="text"
              id="twitterUsername"
              name="twitterUsername"
              value={profile.twitterUsername}
              onChange={handleChange}
              className="w-full bg-gray-800 rounded-md border border-gray-700 text-white p-2"
              placeholder="@twitterUsername"
              maxLength="16"
            />
          </div>
          <div className="flex items-center space-x-2">
            <FaLink />
            <input
              type="text"
              id="websiteURL"
              name="websiteURL"
              value={profile.websiteURL}
              onChange={handleChange}
              className="w-full bg-gray-800 rounded-md border border-gray-700 text-white p-2"
              placeholder="www.example.com"
              maxLength="100"
            />
          </div>
          <button
            type="submit"
            className={`w-full ${isChanged ? 'bg-blue-500 hover:bg-blue-700' : 'bg-blue-300'} text-white font-bold py-2 px-4 rounded-lg`}
            disabled={!isChanged}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
