import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For making API calls
import { Switch } from '@headlessui/react';

const Settings = () => {
  const [userSettings, setUserSettings] = useState({
    email: '',
    phone: '',
    publicProfile: false,
    hideFromGuestLists: false,
    showEventsAttending: false,
    optInForSMSUpdates: false,
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [initialSettings, setInitialSettings] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const userData = storedUser ? JSON.parse(storedUser) : {};
    setUserSettings(userData);
    setInitialSettings(userData);
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setUserSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setHasChanges(true);
  };

  const handleToggleChange = (name) => {
    // Lock privacy settings to prevent toggling
    if (["publicProfile", "hideFromGuestLists", "showEventsAttending", "optInForSMSUpdates"].includes(name)) {
      return; // Do nothing for locked settings
    }
    setUserSettings((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
    setHasChanges(true);
  };

  const updateBackend = async (section) => {
    // Define the base URL for your backend server
    const baseUrl = 'http://localhost:3001';
  
    try {
      if (section === 'general') {
        await axios.put(`${baseUrl}/profile/settings/general`, {
          email: userSettings.email,
          phone: userSettings.phone
        });
      } else if (section === 'security') {
        await axios.put(`${baseUrl}/profile/settings/security`, {
          currentPassword: userSettings.currentPassword,
          newPassword: userSettings.newPassword
        });
      }
      // Update local storage with the latest user settings
      localStorage.setItem('currentUser', JSON.stringify(userSettings));
      setHasChanges(false);
    } catch (error) {
      console.error(`Error updating ${section} settings:`, error.response ? error.response.data : error.message);
    }
  };
  

  const handleSubmit = (event, section) => {
    event.preventDefault();
    updateBackend(section);
  };

  const handleCancel = () => {
    setUserSettings(initialSettings);
    setHasChanges(false);
  };

  return (
    <div className="bg-black text-white p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold my-6">Account Settings</h1>

      {/* General Settings */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold">General Settings</h2>
        <form onSubmit={(e) => handleSubmit(e, 'general')} className="space-y-4">
          <InputField
            label="Email"
            type="email"
            name="email"
            value={userSettings.email}
            handleChange={handleChange}
          />
          <InputField
            label="Phone"
            type="tel"
            name="phone"
            value={userSettings.phone}
            handleChange={handleChange}
          />
          <SaveButton isDisabled={!hasChanges} />
          {hasChanges && <CancelButton handleCancel={handleCancel} />}
        </form>
      </section>

      {/* Privacy Settings */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Privacy Settings</h2>
        <form onSubmit={(e) => handleSubmit(e, 'privacy')} className="space-y-4">
          {/* Privacy settings locked, not allowing changes */}
        </form>
      </section>

      {/* Account Security */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Account Security</h2>
        <form onSubmit={(e) => handleSubmit(e, 'security')} className="space-y-4">
          <InputField
            label="Current Password"
            type="password"
            name="currentPassword"
            value={userSettings.currentPassword}
            handleChange={handleChange}
          />
          <InputField
            label="New Password"
            type="password"
            name="newPassword"
            value={userSettings.newPassword}
            handleChange={handleChange}
          />
          <InputField
            label="Confirm New Password"
            type="password"
            name="confirmNewPassword"
            value={userSettings.confirmNewPassword}
            handleChange={handleChange}
          />
          <SaveButton isDisabled={!hasChanges} />
          {hasChanges && <CancelButton handleCancel={handleCancel} />}
        </form>
      </section>
    </div>
  );
};

const InputField = ({ label, type, name, value, handleChange }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium">{label}</label>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={handleChange}
      className="w-full bg-gray-800 p-2 rounded-md"
    />
  </div>
);

const SaveButton = ({ isDisabled }) => (
  <button
    type="submit"
    disabled={isDisabled}
    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
  >
    Save Changes
  </button>
);

const CancelButton = ({ handleCancel }) => (
  <button
    onClick={handleCancel}
    className="w-full mt-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
  >
    Cancel
  </button>
);

export default Settings;
