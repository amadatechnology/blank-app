// src/api/axiosConfig.js
import axios from 'axios';

axios.defaults.withCredentials = true;

// Optional: Set up base URL and other global settings
axios.defaults.baseURL = 'http://localhost:3001';

export default axios;
