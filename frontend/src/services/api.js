import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Ads endpoints
export const adsService = {
  getAds: (params) => api.get('/ads', { params }),
  getAd: (id) => api.get(`/ads/${id}`),
  createAd: (adData) => {
    const formData = new FormData();
    
    // Append non-file fields
    Object.keys(adData).forEach(key => {
      if (key !== 'images') {
        if (typeof adData[key] === 'object' && adData[key] !== null) {
          formData.append(key, JSON.stringify(adData[key]));
        } else {
          formData.append(key, adData[key]);
        }
      }
    });
    
    // Append image files
    if (adData.images && adData.images.length > 0) {
      adData.images.forEach((image) => {
        formData.append('images', image);
      });
    }
    
    return api.post('/ads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updateAd: (id, adData) => {
    const formData = new FormData();
    
    Object.keys(adData).forEach(key => {
      if (key !== 'images') {
        if (typeof adData[key] === 'object' && adData[key] !== null) {
          formData.append(key, JSON.stringify(adData[key]));
        } else {
          formData.append(key, adData[key]);
        }
      }
    });
    
    if (adData.images && adData.images.length > 0) {
      adData.images.forEach((image) => {
        if (image instanceof File) {
          formData.append('images', image);
        }
      });
    }
    
    return api.put(`/ads/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteAd: (id) => api.delete(`/ads/${id}`),
  getUserAds: (params) => api.get('/ads/user/my-ads', { params }),
};

// Categories endpoints
export const categoriesService = {
  getCategories: () => api.get('/categories'),
  getCategory: (slug) => api.get(`/categories/${slug}`),
};

// Locations endpoints
export const locationsService = {
  getCities: () => api.get('/locations/cities'),
  getStates: () => api.get('/locations/states'),
};

// Users endpoints
export const usersService = {
  getUser: (id) => api.get(`/users/${id}`),
};

export default api;