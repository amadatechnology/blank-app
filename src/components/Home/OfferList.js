// src/components/OfferList.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import RedeemModal from '../RedeemModal';

const OfferList = () => {
  const [partners, setPartners] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const partnersQuery = query(collection(db, 'partners'));
        const partnersSnapshot = await getDocs(partnersQuery);

        const partnersData = await Promise.all(partnersSnapshot.docs.map(async (partnerDoc) => {
          const partnerData = partnerDoc.data();

          // Use collection function to reference the subcollection
          const offersCollection = collection(partnerDoc.ref, 'offers');
          const offersSnapshot = await getDocs(offersCollection);

          const offersData = offersSnapshot.docs.map((offerDoc) => ({
            offerId: offerDoc.id,
            ...offerDoc.data(),
          }));

          return {
            partnerId: partnerDoc.id,
            ...partnerData,
            offers: offersData,
          };
        }));

        console.log('Fetched partners:', partnersData);
        setPartners(partnersData);
      } catch (error) {
        console.error('Error fetching partners:', error.message);
      }
    };

    fetchPartners();
  }, []);

  const handleRedeemClick = (offer) => {
    setSelectedOffer(offer);
  };

  return (
    <div className="max-w-full overflow-x-scroll p-4 bg-black text-black rounded-lg shadow-lg">
      <h2 className="text-4xl text-white font-bold mb-4">Offers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {partners.map((partner) => (
          <motion.div
            key={partner.partnerId}
            className="bg-gradient-to-r from-white to-gray-200 border-white border-2 p-6 rounded-md mb-8"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-2">{partner.partnerName}</h3>
            <p className="text-sm mb-4">{partner.partnerDescription}</p>

            {partner.offers && partner.offers.length > 0 && (
              <>
                {partner.offers.map((offer) => (
                  <motion.div
                    key={offer.offerId}
                    className=" rounded-md p-4 mb-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h4 className="text-3xl font-bold mb-2">$ {offer.offerAmount} {offer.offerName}</h4>
                    <p className="text-sm mb-2">{offer.offerDescription}</p>
                    <motion.button
                      className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-black hover:text-white transition duration-300"
                      onClick={() => handleRedeemClick(offer)}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                    >
                      Redeem Code
                    </motion.button>
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>
        ))}
      </div>

      {selectedOffer && (
        <RedeemModal
          offer={selectedOffer}
          onClose={() => setSelectedOffer(null)}
        />
      )}
    </div>
  );
};

export default OfferList;
