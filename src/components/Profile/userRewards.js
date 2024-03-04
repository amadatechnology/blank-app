import React from 'react';

const UserRewards = ({ points = 0, redeemedRewards = [] }) => { // Provide default values
  const nextMilestone = 100; // Example milestone
  // Ensure points is a number to avoid NaN results
  const progress = points ? (points / nextMilestone) * 100 : 0;

  return (
    <div className="user-rewards">
      <h2 className="text-xl font-bold mb-3">Your Rewards</h2>
      <p>You have {points} points.</p>
      <div className="progress-bar bg-gray-300 rounded-full h-2.5 dark:bg-gray-700">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
      </div>
      <p className="mb-4">Next milestone: {nextMilestone} points</p>
      <h3 className="text-lg font-bold">Redeemed Rewards</h3>
      {redeemedRewards.length > 0 ? (
        <ul>
          {redeemedRewards.map((reward, index) => (
            <li key={index}>{reward.description} - Redeemed on {new Date(reward.date).toLocaleDateString()}</li>
          ))}
        </ul>
      ) : (
        <p>No rewards redeemed yet.</p>
      )}
    </div>
  );
};

export default UserRewards;
