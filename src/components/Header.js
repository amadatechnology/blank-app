// Header.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiMapPin, FiHome, FiUsers, FiBell, FiLogOut, FiUser } from 'react-icons/fi';
import Logo from './Logo'; // Confirm this component's existence and correct export
import { useAuth } from '../Auth/AuthContext'; // Adjust the import path as needed

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent click from propagating to document
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    await logout(); // Assuming logout is an asynchronous operation
    navigate('/login');
  };

  useEffect(() => {
    // Close the menu if clicking outside of it
    const closeMenu = (e) => {
      if (menuOpen) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, [menuOpen]);

  return (
    <header className="bg-black text-white relative">
      {currentUser && currentUser.profileComplete && (
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-xl font-bold">
              <Logo />
            </Link>
          </div>
          <nav className="hidden md:flex justify-center flex-grow">
            <Link to="/" className="px-4 py-2 mx-2 flex items-center text-sm md:text-md">
              <FiHome className="mr-2" /> Home
            </Link>
            <Link to="/events" className="px-4 py-2 mx-2 flex items-center text-sm md:text-md">
              <FiMapPin className="mr-2" /> Events
            </Link>
            <Link to="/members" className="px-4 py-2 mx-2 flex items-center text-sm md:text-md">
              <FiUsers className="mr-2" /> Members
            </Link>
          </nav>
          <div className="flex items-center">
            <Link to="/notifications" className="p-2">
              <FiBell size={24} />
            </Link>
            <Link to="/profile" className="p-2 border-2 border-white rounded-full">
              <FiUser size={24} />
            </Link>
            <button onClick={toggleMenu} className="ml-4 md:hidden">
              <FiMenu size={24} />
            </button>
          </div>
          {menuOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-md z-50 flex flex-col items-center justify-center md:hidden">
              <FiX className="absolute top-4 right-4 text-white text-3xl" onClick={toggleMenu} />
              <nav className="text-center">
                <Link to="/" className="block text-lg py-2 hover:underline" onClick={toggleMenu}>
                  <FiHome className="mr-2" /> Home
                </Link>
                <Link to="/events" className="block text-lg py-2 hover:underline" onClick={toggleMenu}>
                  <FiMapPin className="mr-2" /> Events
                </Link>
                <Link to="/members" className="block text-lg py-2 hover:underline" onClick={toggleMenu}>
                  <FiUsers className="mr-2" /> Members
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-lg py-2 hover:underline flex items-center justify-center w-full"
                >
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </nav>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
