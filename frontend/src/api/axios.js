import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // to keep the code cleaner, we set the base URL here
  withCredentials: true // sends HttpOnly cookie
});

export default api;
