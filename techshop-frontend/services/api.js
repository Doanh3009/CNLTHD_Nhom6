import axios from 'axios';

const API_URL = 'http://localhost:8181/api/auth';

export const loginUser = async (credentials) => {
  return axios.post(`${API_URL}/login`, credentials);
};

export const registerUser = async (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};
