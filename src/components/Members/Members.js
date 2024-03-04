import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiInstagram } from 'react-icons/fi';

const Members = () => {
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [filterCity, setFilterCity] = useState('All Cities');
    const [sortOption, setSortOption] = useState('dateCreatedAsc');
    const [filterCities, setFilterCities] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMembers = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found, redirecting to login.');
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('http://localhost:3001/members', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const membersData = response.data;
                setMembers(membersData);

                const uniqueCities = Array.from(new Set(membersData.map(member => member.location?.city).filter(Boolean)));
                setFilterCities(['All Cities', ...uniqueCities]);
                setFilteredMembers(membersData);
            } catch (error) {
                console.error('Error fetching members:', error);
                if (error.response?.status === 401) {
                    console.log('Token is unauthorized, redirecting to login.');
                    navigate('/login');
                }
            }
        };

        fetchMembers();
    }, [navigate]);

    const handleCityFilterChange = (e) => {
        const selectedCity = e.target.value;
        setFilterCity(selectedCity);
        filterMembers(selectedCity, sortOption);
    };

    const handleSortChange = (e) => {
        const selectedSortOption = e.target.value;
        setSortOption(selectedSortOption);
        filterMembers(filterCity, selectedSortOption);
    };

    const filterMembers = (city, sortOption) => {
        let filtered = [...members];
        if (city && city !== 'All Cities') {
            filtered = filtered.filter(member => member.location?.city === city);
        }

        // ... (rest of the sorting logic)

        setFilteredMembers(filtered);
    };

    return (
        <div className="bg-black text-white min-h-screen">
            <div className="p-4">
                <h2 className="text-3xl font-bold mb-4">Members</h2>
                <div className="flex flex-col sm:flex-row justify-between mb-4">
                    <div className="mb-4 sm:mb-0">
                        <label htmlFor="cityFilter" className="block text-sm font-medium">Select a City</label>
                        <select value={filterCity} onChange={handleCityFilterChange} className="mt-1 block w-full p-2 border-gray-600 rounded-md bg-black text-white">
                            {filterCities.map((city, index) => (
                                <option key={index} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="sortOption" className="block text-sm font-medium">Newest Members</label>
                        <select value={sortOption} onChange={handleSortChange} className="mt-1 block w-full p-2 border-gray-600 rounded-md bg-black text-white">
                            <option value="dateCreatedAsc">Date Joined Ascending</option>
                            <option value="dateCreatedDesc">Date Joined Descending</option>
                            <option value="nameAsc">Name Ascending</option>
                            <option value="nameDesc">Name Descending</option>
                        </select>
                    </div>
                </div>
                {filteredMembers.map((member) => (
                    <div key={member._id} className="flex justify-between items-center mb-2 border-b border-gray-600 py-2 cursor-pointer" onClick={() => navigate(`/user/${member._id}`)}>
                        <div>
                            <p className="font-bold">{member.firstName} {member.lastName}</p>
                            <p className="text-gray-400">{`${member.location?.city}, ${member.location?.state}`}</p>
                        </div>
                        {member.instagram && (
                            <a href={`https://instagram.com/${member.instagram}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                <FiInstagram size={20} className="text-gray-400" />
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Members;
