import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UpcomingEvents = () => {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
    
    // Retrieve the user's city from the currentUser object in localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userCity = currentUser?.location?.city?.toLowerCase().trim();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                };
                const { data } = await axios.get('http://localhost:3001/events', config);
                // Filter events right after fetching based on the city
                const filteredData = userCity 
                    ? data.filter(event => event.location && event.location.city?.toLowerCase().trim() === userCity) 
                    : [];
                setEvents(filteredData);
            } catch (error) {
                console.error('Error fetching events:', error.response?.data?.message || error.message);
                setError(error.response?.data?.message || error.message);
            }
        };

        fetchEvents();
    }, [userCity]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    if (error) {
        return <div className="text-white">Error fetching events: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4 text-white">
            <h2 className="text-3xl font-bold mb-4">Upcoming Events{userCity ? ` in ${currentUser.location.city}` : ''}</h2>
            <div className="flex flex-wrap -mx-4">
                {events.length > 0 ? (
                    events.map(event => (
                        <div key={event._id} className="md:w-1/3 px-4 mb-8">
                            <div className="bg-gray-800 rounded-lg p-4 h-full flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">{event.eventName}</h3>
                                    <p className="text-gray-400 text-sm">{event.locationName}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-2">
                                        {formatDate(event.startTime)} - {formatDate(event.endTime)}
                                    </p>
                                    <Link to={`/events/${event._id}`} className="text-indigo-500 hover:text-indigo-300">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>We will be adding events{userCity ? ` for ${currentUser.location.city}` : ' soon'}! Check back soon.</p>
                )}
            </div>
        </div>
    );
};

export default UpcomingEvents;
