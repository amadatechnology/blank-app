import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Placeholder for fetching notifications
        // In a real app, you would fetch this data from your backend
        const fetchNotifications = async () => {
            // Example static data
            const notificationsData = [
                { id: 1, text: "New follower: John Doe", link: "/profile/johndoe" },
                { id: 2, text: "Event reminder: Community Meetup", link: "/events/123" },
                // Add more notifications as needed
            ];
            setNotifications(notificationsData);
        };
        
        fetchNotifications();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center bg-black text-white">
            <div className="max-w-md w-full space-y-8">
            <div className="mt-4">
                    <Link to="/" className="flex items-center font-medium text-indigo-500 hover:text-indigo-600">
                        <FiArrowLeft className="mr-2" />Back to Home
                    </Link>
                </div>
                <h2 className="mt-6 text-2xl font-extrabold">Notifications</h2>
                <div className="bg-white text-black rounded-lg p-4">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div key={notification.id} className="p-2 hover:bg-gray-100">
                                <Link to={notification.link} className="flex items-center">
                                    {notification.text}
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>No new notifications.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
