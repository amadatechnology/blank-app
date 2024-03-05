import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './Auth/AuthContext'; // Adjust the import path as needed
import Header from './components/Header';
import Dashboard from './components/Home/Dashboard';
import ActivityFeed from './components/Home/Leaderboards';
import Login from './components/Login/Login';
import Register from './components/Login/Register';
import ForgotPassword from './components/Login/ForgotPassword';
import Profile from './components/Profile/Profile';
import Members from './components/Members/Members';
import Events from './components/Events/Events';
import EventPage from './components/Events/EventPage';
import CreateProfile from './components/Onboarding/CreateProfile';
import Membership from './components/Onboarding/Membership';
import UserPage from './components/Members/UserPage';
import UserFollowingPage from './components/Profile/UserFollowingPage';
import UserFollowerPage from './components/Profile/UserFollowerPage';
import EditProfile from './components/Profile/EditProfile'; // Import the EditProfile component
import ResetPassword from './components/Login/ResetPassword'; // Adjust the import path as needed
import Notifications from './components/Notifications';
import VerifyEmail from './components/Login/VerifyEmail';
import Checkout from './components/Checkout'; // Import the Checkout component

const App = () => {
  const { currentUser } = useAuth();

  console.log("process.env:", process.env);
  console.log("process.env.REACT_APP_NODE_ENV:", process.env.REACT_APP_NODE_ENV);
  console.log("process.env.REACT_APP_SERVER_BASE_URL:", process.env.REACT_APP_SERVER_BASE_URL);
  const base_url = process.env.REACT_APP_NODE_ENV === 'development' ? process.env.REACT_APP_LOCAL_BASE_URL : process.env.REACT_APP_SERVER_BASE_URL;

  return (
    <>
      {currentUser && <Header />}
      <Routes>
        <Route path="/" element={currentUser ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/activityfeed" element={currentUser ? <ActivityFeed /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/profile" element={currentUser ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/notifications" element={currentUser ? <Notifications /> : <Navigate to="/login" />} />
        <Route path="/members" element={currentUser ? <Members /> : <Navigate to="/login" />} />
        <Route path="/events" element={currentUser ? <Events /> : <Navigate to="/login" />} />
        <Route path="/events/:eventId" element={currentUser ? <EventPage /> : <Navigate to="/login" />} />
        <Route path="/create-profile" element={currentUser ? <CreateProfile /> : <Navigate to="/login" />} />
        <Route path="/user/:userId" element={currentUser ? <UserPage /> : <Navigate to="/login" />} />
        <Route path="/profile/:userID/followers" element={currentUser ? <UserFollowerPage /> : <Navigate to="/login" />} />
        <Route path="/profile/:userID/following" element={currentUser ? <UserFollowingPage /> : <Navigate to="/login" />} />
        <Route path="/edit-profile" element={currentUser ? <EditProfile /> : <Navigate to="/login" />} />
        <Route path="/checkout" element={currentUser ? <Checkout /> : <Navigate to="/login" />} /> {/* Checkout route */}
      </Routes>
    </>
  );
};

export default App;
