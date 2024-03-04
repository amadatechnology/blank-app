import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { IoMdArrowBack, IoIosStar, IoLogoInstagram } from 'react-icons/io';

const UserPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('Activity');

  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserDetails(response.data);
        setIsFollowing(response.data.followers.includes(currentUser?.id));
      } catch (error) {
        console.error('Error fetching user details:', error);
        navigate('/login');
      }
    };

    fetchUserDetails();
  }, [userId, navigate, token, currentUser?.id]);

  const handleFollowUnfollow = async () => {
    const action = isFollowing ? 'unfollow' : 'follow';
    const endpoint = `http://localhost:3001/user/${userId}/${action}`;

    if (userId === currentUser?.id) return;

    try {
      await axios.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFollowing(!isFollowing);
      setUserDetails(prevDetails => ({
        ...prevDetails,
        followersCount: isFollowing ? prevDetails.followersCount - 1 : prevDetails.followersCount + 1,
      }));
    } catch (error) {
      console.error(`Error ${action} user:`, error);
    }
  };

  const goBack = () => navigate('/members');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Activity':
  return (
    <div>
      {/* Check if userDetails and eventsAttending are not null or undefined before mapping */}
      {userDetails?.eventsAttending && userDetails.eventsAttending.map(event => (
        <div key={event.id}>
          <p>{event.name}</p>
          {/* Add more event details as needed */}
        </div>
      ))}
    </div>
  );
      case 'Info':
        return (
          <div className="text-left">
            <div className="flex items-center">
              <IoLogoInstagram className="text-gray-500 mr-2" />
              <p><strong>Instagram:</strong> {userDetails?.instagram || 'N/A'}</p>
            </div>
            <p><strong>Bio:</strong> {userDetails?.bio || 'N/A'}</p>
            <p><strong>Interests:</strong> {userDetails?.interests?.join(', ') || 'N/A'}</p>
            {/* Add more info fields as needed */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-4">
      <button onClick={goBack} className="text-white">
        <IoMdArrowBack className="text-2xl" />
      </button>
      <div className="flex flex-col items-center mt-4">
        <div className="profile-pic-placeholder w-24 h-24 bg-gray-400 rounded-full" />
        <h1 className="text-3xl font-bold mt-2">{userDetails?.firstName} {userDetails?.lastName}</h1>
        <div className="location-info">
          <p>{userDetails?.location.city}, {userDetails?.location.state}, {userDetails?.location.country}</p>
        </div>
        <div className="flex items-center mt-2">
          <IoIosStar className="text-yellow-400" />
          <span className="ml-1">Gold Member</span>
        </div>
        <p className="text-sm text-gray-300 mt-1">Joined: {new Date(userDetails?.joinDate).toLocaleDateString()}</p>
        <div className="flex w-full justify-evenly mt-4">
          <div>
            <span className="font-bold text-lg">{userDetails?.followingCount}</span>
            <p>Following</p>
          </div>
          <div>
            <span className="font-bold text-lg">{userDetails?.followersCount}</span>
            <p>Followers</p>
          </div>
        </div>
        <button
          onClick={handleFollowUnfollow}
          className={`mt-4 w-full py-2 rounded-full text-lg ${isFollowing ? 'bg-red-600' : 'bg-blue-500'}`}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
        <div className="flex border-t border-gray-600 w-full justify-center mt-4">
          <button
            onClick={() => setActiveTab('Activity')}
            className={`w-full py-3 ${activeTab === 'Activity' ? 'text-blue-400 border-b-4 border-blue-400' : 'text-gray-400'}`}
          >
            Activity
          </button>
          <button
            onClick={() => setActiveTab('Info')}
            className={`w-full py-3 ${activeTab === 'Info' ? 'text-blue-400 border-b-4 border-blue-400' : 'text-gray-400'}`}
          >
            Info
          </button>
        </div>
        <div className="tab-content mt-4 w-full">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
