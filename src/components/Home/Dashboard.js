import React from 'react';
import UpcomingEvents from './UpcomingEvents';
import ActivityFeed from './ActivityFeed'; // Adjust the import path as necessary

const Dashboard = () => {
    return (
        <div className="container mx-auto p-4">
            <section className="mb-8">
                <UpcomingEvents />
            </section>
            <section className="mb-8">
                <ActivityFeed />
            </section>
        </div>
    );
};

export default Dashboard;
