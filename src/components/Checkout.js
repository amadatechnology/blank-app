import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Checkout = ({ userEmail, paymentMethod }) => {
  const { tier } = useParams();
  const navigate = useNavigate();
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      // Fetch or create a customer on your server
      try {
        const response = await fetch('/create-customer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: userEmail, payment_method: paymentMethod }),
        });

        const data = await response.json();
        setCustomerId(data.customer_id);
      } catch (error) {
        console.error('Error creating customer:', error.message);
        // Handle the error or redirect the user to an error page
      }
    };

    fetchCustomer();
  }, [userEmail, paymentMethod]);

  const handleCheckout = async () => {
    if (!customerId) {
      console.error('Customer ID not available');
      // Handle the error or redirect the user to an error page
      return;
    }

    // Fetch or create a checkout session on your server
    try {
      const response = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customer_id: customerId, tier }),
      });

      const data = await response.json();

      // Load Stripe library dynamically if not available
      const stripe = window.Stripe && window.Stripe('pk_test_51NXD3kAtxVrFPacKqXpUy4sCzumRiE8JKQJE9BHLXNCxX7bIZ9STrmEAF8mNF0Qpfdeq81OtJmPgHHqHHsecZwxC00MJ2llk23'); // Replace with your actual publishable key

      if (!stripe) {
        console.error('Stripe is not available');
        // Handle the error or redirect the user to an error page
        return;
      }

      // Redirect the user to the Stripe Checkout page
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.session_id,
      });

      if (error) {
        console.error('Error redirecting to checkout:', error.message);
        // Handle the error or redirect the user to an error page
      }
    } catch (error) {
      console.error('Error creating checkout session:', error.message);
      // Handle the error or redirect the user to an error page
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <p>Selected Tier: {tier}</p>
      <button onClick={handleCheckout}>Proceed to Checkout</button>
    </div>
  );
};

export default Checkout;
