import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboards = () => {
    const [leaders, setLeaders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaders = async () => {
            try {
                const { data } = await axios.get('http://localhost:3001/leaderboard'); // Replace with your actual endpoint
                setLeaders(data);
            } catch (error) {
                console.error('Error fetching leaderboard:', error.response?.data?.message || error.message);
                setError(error.response?.data?.message || error.message);
            }
        };

        fetchLeaders();
    }, []);

    if (error) {
        return <div className="text-white">Error fetching leaderboard: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4 text-white">
            <h2 className="text-3xl font-bold mb-4">Leaderboard</h2>
            <div className="bg-gray-800 p-4 rounded-lg">
                <table className="w-full">
                    <thead>
                        <tr className="text-left">
                            <th className="pb-2 border-b-2 border-gray-600">Member</th>
                            <th className="pb-2 border-b-2 border-gray-600">City, State</th>
                            <th className="pb-2 border-b-2 border-gray-600">Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaders.map((leader, index) => (
                            <tr key={index}>
                                <td className="py-2">{leader.name}</td>
                                <td className="py-2">{leader.location.city}, {leader.location.state}</td>
                                <td className="py-2">{leader.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {leaders.length === 0 && <p>No leaders to display.</p>}
            </div>
            <button className="mt-4 text-indigo-500 hover:text-indigo-300">View All Activity</button>
        </div>
    );
};

export default Leaderboards;
