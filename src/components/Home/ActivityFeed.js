import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../Auth/AuthContext'; // Adjust the import path as necessary

const ActivityFeed = () => {
  const { currentUser } = useAuth();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('http://localhost:3001/current-user', {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });

        const userData = response.data;
        setActivities(userData.activities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
  }, [currentUser.token]);

  return (
    <div>
      <h2>Activity Feed</h2>
      <ul>
        {activities.map((activity) => (
          <li key={activity._id}>{activity.type}</li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeed;



