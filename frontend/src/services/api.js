import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: false, // Mode token Bearer — pas de cookies de session
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Injecte le token Bearer depuis le localStorage avant chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gestion globale des erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide — nettoyer le localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      // Rediriger vers login si pas déjà sur la page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
