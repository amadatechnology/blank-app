import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Purchase = ({ selectedTier }) => {
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  // useEffect to calculate the total when the selectedTier changes
  useEffect(() => {
    // Perform any calculations based on the selectedTier (for simplicity, let's assume $10 per tier)
    const tierPrice = 10; // Adjust this based on your actual pricing logic
    const calculatedTotal = selectedTier * tierPrice;
    setTotal(calculatedTotal);
  }, [selectedTier]);

  const handleCheckout = () => {
    // Implement your checkout logic here (e.g., redirect to a payment gateway, etc.)
    // For now, let's just navigate to a success page
    navigate('/purchase-success');
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-8 bg-black text-white">
      <h2 className="text-4xl font-bold mb-4">Checkout</h2>
      <div className="mb-4">
        <p className="text-lg font-semibold">Selected Membership Tier:</p>
        <p className="text-xl">{selectedTier} Tier</p>
      </div>
      <div className="mb-4">
        <p className="text-lg font-semibold">Total Amount:</p>
        <p className="text-xl">${total}</p>
      </div>
      <button
        onClick={handleCheckout}
        className="w-full py-2 bg-white text-black font-semibold hover:bg-black hover:text-white transition duration-300"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Purchase;
