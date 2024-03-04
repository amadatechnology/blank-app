import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserFollowerPage = () => {
  const [followers, setFollowers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchFollowers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/profile/followers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFollowers(response.data);
      } catch (error) {
        console.error('Error fetching followers data:', error);
        navigate('/login');
      }
    };

    fetchFollowers();
  }, [navigate]);

  return (
    <div className="bg-black text-white min-h-screen p-4">
      <h1 className="text-xl font-bold mb-4">Followers</h1>
      <div>
        {followers.map(user => (
          <div key={user._id} className="mb-4 p-4 bg-gray-800 rounded-lg">
            <h2 className="text-lg font-semibold">{user.firstName} {user.lastName}</h2>
            <p>{user.location?.city}, {user.location?.state}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserFollowerPage;
