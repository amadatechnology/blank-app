import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const dealsData = [
  {
    id: 1,
    title: 'Deal 1',
    description: 'This is the description for Deal 1. Click to see more details.',
    details: 'More details about Deal 1...',
  },
  {
    id: 2,
    title: 'Deal 2',
    description: 'This is the description for Deal 2. Click to see more details.',
    details: 'More details about Deal 2...',
  },
  {
    id: 3,
    title: 'Deal 3',
    description: 'This is the description for Deal 3. Click to see more details.',
    details: 'More details about Deal 3...',
  },
  // Add more deals as needed
];

const Deals = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % dealsData.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + dealsData.length) % dealsData.length);
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-8">
      <div className="relative overflow-hidden h-1/2">
        <AnimatePresence initial={false} exitBeforeEnter={false}>
          <motion.div
            key={currentIndex}
            className="flex transition-transform duration-300 ease-in-out"
            initial={{ x: `-${currentIndex * 100}%` }}
            animate={{ x: `-${currentIndex * 100}%` }}
            exit={{ x: `-${currentIndex * 100}%` }}
            transition={{ type: 'tween', ease: 'easeInOut' }}
          >
            {dealsData.map((deal) => (
              <div key={deal.id} className="w-full">
                <div className="mb-4 bg-white p-4 border border-gray-300 rounded">
                  <h3 className="text-xl font-semibold">{deal.title}</h3>
                  <p className="text-gray-600">{deal.description}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-between mt-4">
        <button onClick={handlePrev}>&lt; Prev</button>
        <button onClick={handleNext}>Next &gt;</button>
      </div>
    </div>
  );
};

export default Deals;
