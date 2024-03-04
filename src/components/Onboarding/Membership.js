// Membership.js
import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Logo from '../Logo';
import { AuthContext } from '../../Auth/AuthContext';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const Membership = () => {
  const [selectedTier, setSelectedTier] = useState(null);
  const { currentUser, token, updateCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const membershipTiers = [
    {
      id: 'free',
      name: 'Free',
      description: 'Limited access to events and basic features.',
      price: 'Free',
      benefits: [
        'Limited access to events each month',
        'Basic profile and messaging',
        'Browse upcoming events with limited details',
      ],
    },
    {
      id: 'silver',
      name: 'Silver',
      description: 'Priority access, exclusive discounts, and more.',
      price: '$15/month',
      benefits: [
        'All Free Tier benefits, plus:',
        'Priority access to events',
        'Exclusive discounts on event tickets, drinks, and merchandise',
        'Member directory access',
        'Attend monthly networking events',
      ],
    },
    {
      id: 'gold',
      name: 'Gold',
      description: 'VIP access, concierge service, and exclusive perks.',
      price: '$30/month',
      benefits: [
        'All Silver Tier benefits, plus:',
        'VIP access to exclusive events',
        'Fast track RSVP for all events',
        'Concierge service for personalized recommendations',
        'Member spotlight opportunities',
        'Exclusive member lounge access',
      ],
    },
  ];

  useEffect(() => {
    if (!currentUser && token) {
      // Fetch user information if not available in context
      updateCurrentUser();
    }
  }, [currentUser, token, updateCurrentUser]);

  const handleTierSelect = (tierId) => {
    setSelectedTier(tierId);
  };

  const handleContinue = async () => {
    if (selectedTier && currentUser && currentUser.id && token && updateCurrentUser) {
      try {
        // Send a request to your back-end to create a checkout session
        const response = await axios.post('http://localhost:3001/create-checkout-session', {
          customer_id: currentUser.stripeCustomerId, // Assuming you store the Stripe Customer ID in the user data
          tier: selectedTier,
        });

        // Handle the response and redirect the user to the Stripe checkout page
        const { sessionId } = response.data;
        const stripe = await loadStripe('pk_test_51NXD3kAtxVrFPacKqXpUy4sCzumRiE8JKQJE9BHLXNCxX7bIZ9STrmEAF8mNF0Qpfdeq81OtJmPgHHqHHsecZwxC00MJ2llk23'); // Replace with your actual Stripe publishable key
        await stripe.redirectToCheckout({ sessionId });
      } catch (error) {
        console.error('Error creating checkout session:', error);
      }
    }
  };

  return (
    <div className="max-w-screen-md mx-auto mt-8 p-8 text-white rounded-lg shadow-lg">
      <Logo />
      <h2 className="text-2xl font-bold mb-4">Select a Tier</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {membershipTiers.map((tier) => (
          <motion.div
            key={tier.id}
            className={`p-6 rounded-md cursor-pointer border ${
              selectedTier === tier.id
                ? 'border-purple-500 shadow-md'
                : 'border-gray-300'
            } transition-all`}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleTierSelect(tier.id)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-2">{tier.name}</h3>
            <p className="text-sm mb-2">{tier.description}</p>
            <p className="text-sm font-bold">{tier.price}</p>
            {selectedTier === tier.id && (
              <>
                <h4 className="text-md font-semibold mt-4 mb-2">Tier Benefits</h4>
                <ul className="list-disc list-inside">
                  {tier.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </>
            )}
          </motion.div>
        ))}
      </div>
      {selectedTier && (
        <button
          onClick={handleContinue}
          className="mt-8 bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300"
        >
          Continue
        </button>
      )}
    </div>
  );
};

export default Membership;
