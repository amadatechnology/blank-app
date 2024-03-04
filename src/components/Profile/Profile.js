import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserActivity from '../Profile/userActivity';
import UserReward from '../Profile/userRewards';
import Settings from '../Profile/Settings'; // This should now be the Info component

const Profile = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Rewards');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const profileResponse = await axios.get('http://localhost:3001/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(profileResponse.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  const locationString = user.location ? `${user.location.city}, ${user.location.state}` : 'Location not set';

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Activity':
        return <UserActivity />;
      case 'Rewards':
        return <UserReward points={user.points} redeemedRewards={user.redeemedRewards} />;
      case 'Settings':
        return <Settings userInfo={user} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold">{user.firstName} {user.lastName}</h1>
        <p className="text-xl mb-2">{locationString}</p>
        <div className="bg-yellow-400 text-black px-3 py-1 inline-block rounded-full mb-4">Gold Member</div>
        <div className="flex justify-center gap-8 mb-4 cursor-pointer">
          <div onClick={() => navigate(`/profile/${user._id}/following`)}>
            <span className="block font-bold text-xl">{user.following?.length || 0}</span>
            <span>Following</span>
          </div>
          <div onClick={() => navigate(`/profile/${user._id}/followers`)}>
            <span className="block font-bold text-xl">{user.followers?.length || 0}</span>
            <span>Followers</span>
          </div>
        </div>
        <button
          className="border border-white text-white py-2 px-4 rounded-full mb-4 "
          onClick={() => navigate('/edit-profile')}
        >
          Edit Profile
        </button>
        <hr className="border-t border-white my-4" />
        <div className="flex justify-around text-center mb-4">
          <button
            className={`px-4 py-2 rounded-full ${activeTab === 'Rewards' ? 'bg-gray-600' : 'bg-gray-800'}`}
            onClick={() => handleTabClick('Rewards')}
          >
            Rewards
          </button>
          <button
            className={`px-4 py-2 rounded-full ${activeTab === 'Activity' ? 'bg-gray-600' : 'bg-gray-800'}`}
            onClick={() => handleTabClick('Activity')}
          >
            Activity
          </button>
          <button
            className={`px-4 py-2 rounded-full ${activeTab === 'Settings' ? 'bg-gray-600' : 'bg-gray-800'}`}
            onClick={() => handleTabClick('Settings')}
          >
            Settings
          </button>
        </div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Profile;
