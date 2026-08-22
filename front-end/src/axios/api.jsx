import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) 
        window.location.replace('/login');    

    return Promise.reject(error);
  }
);