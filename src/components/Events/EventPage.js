import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../Auth/AuthContext';
import UserModal from './userModal'; // Ensure correct import path
import { IoMdArrowBack } from 'react-icons/io';

const EventPage = () => {
  const [event, setEvent] = useState(null);
  const [isAttending, setIsAttending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const { eventId } = useParams();
  const { currentUser } = useAuth(); // Assuming this provides the current user object
  const navigate = useNavigate();

  useEffect(() => {
    const checkRSVPStatus = () => {
      const currentUserData = JSON.parse(localStorage.getItem('currentUser'));
      return currentUserData?.attending?.includes(eventId);
    };

    const fetchEvent = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvent(response.data);
        setIsAttending(checkRSVPStatus());
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    fetchEvent();
  }, [eventId, navigate]);

  const handleRSVP = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:3001/events/${eventId}/rsvp`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update localStorage and state to reflect new RSVP status
      const updatedCurrentUser = JSON.parse(localStorage.getItem('currentUser'));
      updatedCurrentUser.attending = updatedCurrentUser.attending ? [...updatedCurrentUser.attending, eventId] : [eventId];
      localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
      setIsAttending(true);
    } catch (error) {
      console.error('Error RSVPing to the event:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const handleAttendeeClick = (attendee) => {
    setSelectedAttendee(attendee);
    setShowModal(true);
  };

  const goBackToEvents = () => navigate('/events');

  if (!event) return <div>Loading event details...</div>;

  return (
    <div className="container mx-auto p-4 text-white">
        <button onClick={goBackToEvents} className="text-white text-lg">
        <IoMdArrowBack className="inline mr-2" />
      </button>
      <h1 className="text-3xl font-bold mb-4">{event.eventName}</h1>
      <p>Location: {event.locationName}, {event.venueLocation}</p>
      <p>Date: {formatDate(event.startTime)} - {formatDate(event.endTime)}</p>
      <p>Description: {event.shortDescription}</p>
      <button
        onClick={!isAttending ? handleRSVP : null}
        className={`mt-4 px-4 py-2 rounded ${isAttending ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'}`}
        disabled={isAttending}
      >
        {isAttending ? "You're attending this event" : "RSVP"}
      </button>
      <div className="mt-4">
        <h2 className="text-2xl font-bold mb-2">Attendees:</h2>
        <div className="flex flex-wrap">
          {event.attendees.map((attendee, index) => (
            <div key={index} className="m-2 w-12 h-12 rounded-full bg-blue-500 flex justify-center items-center cursor-pointer" onClick={() => handleAttendeeClick(attendee)}>
              <span>{`${attendee.firstName[0]}${attendee.lastName[0]}`}</span>
            </div>
          ))}
        </div>
      </div>
      {showModal && selectedAttendee && (
        <UserModal attendee={selectedAttendee} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default EventPage;
