import axios from 'axios'
const BASE_URL = import.meta.env.VITE_SERVER_URL;

let AccessToken = null;

export const setAccessToken = (token) => {
  AccessToken = token;
}

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,

})


api.interceptors.request.use(
  (config) => {
    const token = AccessToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
}
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;  
    
    try {
      const { data } = await api.get('/auth/refresh', { withCredentials: true });
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
      originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
      setAccessToken(data.accessToken);
      return api(originalRequest);
    } catch (err) {
      return Promise.reject(err);
    }
  }
    return Promise.reject(error);
  }
);

export default api;