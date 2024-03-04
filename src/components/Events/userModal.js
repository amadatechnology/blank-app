import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserModal = ({ attendee, onClose }) => {
  const navigate = useNavigate();

  const navigateToUserProfile = () => {
    navigate(`/user/${attendee._id}`);
    onClose(); // Close the modal after navigating
  };

  // Use optional chaining when accessing city and state
  const city = attendee.location?.city || 'City not available';
  const state = attendee.location?.state || 'State not available';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full" id="userModal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{`${attendee.firstName} ${attendee.lastName}`}</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              {city}, {state}
            </p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              id="ok-btn"
              className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none"
              onClick={navigateToUserProfile}
            >
              View Profile
            </button>
          </div>
          <div className="items-center px-4 py-3">
            <button
              id="close-btn"
              className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700 focus:outline-none"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
