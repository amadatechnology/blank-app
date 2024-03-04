import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserActivity = () => {
  const [attendingEvents, setAttendingEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendingEvents = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3001/user/events/attending', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttendingEvents(response.data);
      } catch (error) {
        console.error('Error fetching attending events:', error);
        // Handle errors, e.g., redirect to login if unauthorized
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchAttendingEvents();
  }, [navigate]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Events You're Attending</h2>
      {attendingEvents.length > 0 ? (
        <ul>
          {attendingEvents.map((event) => (
            <li key={event._id} className="mb-2 p-2 border border-gray-600 rounded" onClick={() => navigate(`/events/${event._id}`)}>
              <p className="font-bold">{event.eventName}</p>
              <p className="text-sm text-gray-300">{new Date(event.startTime).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>You are not attending any events.</p>
      )}
    </div>
  );
};

export default UserActivity;
