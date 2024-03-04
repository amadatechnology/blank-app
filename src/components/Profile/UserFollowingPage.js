import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserFollowingPage = () => {
  const [following, setFollowing] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchFollowing = async () => {
      try {
        const response = await axios.get('http://localhost:3001/profile/following', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFollowing(response.data);
      } catch (error) {
        console.error('Error fetching following data:', error);
        navigate('/login');
      }
    };

    fetchFollowing();
  }, [navigate]);

  return (
    <div className="bg-black text-white min-h-screen p-4">
      <h1 className="text-xl font-bold mb-4">Following</h1>
      <div>
        {following.map(user => (
          <div key={user._id} className="mb-4 p-4 bg-gray-800 rounded-lg">
            <h2 className="text-lg font-semibold">{user.firstName} {user.lastName}</h2>
            <p>{user.location?.city}, {user.location?.state}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserFollowingPage;
