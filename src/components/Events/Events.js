import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Auth/AuthContext'; // Adjust the import path as needed

const Events = () => {
    const [events, setEvents] = useState([]);
    const { currentUser } = useAuth(); // Use currentUser from AuthContext
    

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Include Authorization header if your endpoint requires authentication
                const config = currentUser ? { 
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                } : {};
                
                const { data } = await axios.get('http://localhost:3001/events', config);
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error.response?.data?.message || error.message);
            }
        };

        fetchEvents();
    }, [currentUser]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-4 text-white">Events</h2>
            <div className="space-y-4">
                {events.map(event => (
                    <div key={event._id} className="border border-gray-300 rounded-lg p-4 text-white">
                        <Link to={`/events/${event._id}`}>
                            <h3 className="text-3xl font-semibold">{event.eventName}</h3>
                        </Link>
                        <p>Location: {event.locationName}, {event.venueLocation}</p>
                        <p>Date: {formatDate(event.startTime)} to {formatDate(event.endTime)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Events;
