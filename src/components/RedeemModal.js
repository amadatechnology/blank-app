// src/components/RedeemModal.js
import React from 'react';
import { motion } from 'framer-motion';

const RedeemModal = ({ offer, onClose }) => {
  const { redemptionCode, redemptionInstructions } = offer;

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gradient-to-r from-white to-gray-200 border-white border-2 p-6 rounded-md"
        initial={{ y: '-100vh' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold mb-4">Redeem Offer</h3>
        <p className="text-lg font-bold mb-2">Partner: {offer.partnerName}</p>
        <p className="text-sm mb-4">{offer.partnerDescription}</p>

        <p className="text-3xl font-bold mb-2">$ {offer.offerAmount} {offer.offerName}</p>
        <p className="text-sm mb-2">{offer.offerDescription}</p>

        <p className="text-lg font-bold mb-2">Redemption Code:</p>
        <p className="text-xl mb-4">{redemptionCode}</p>

        <p className="text-lg font-bold mb-2">Redemption Instructions:</p>
        <p className="text-sm mb-4">{redemptionInstructions}</p>

        <motion.button
          className="bg-black text-white py-2 px-4 rounded-md hover:bg-white hover:text-black transition duration-300"
          onClick={onClose}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        >
          Close
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default RedeemModal;
