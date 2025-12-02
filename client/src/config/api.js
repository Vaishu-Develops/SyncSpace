// API Configuration for different environments
const PRODUCTION_API_URL = 'https://syncspace-fbys.onrender.com';

const API_BASE_URL = (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim()) || 
  (import.meta.env.PROD ? PRODUCTION_API_URL : 'http://localhost:5000');

export const API_ENDPOINTS = {
  base: API_BASE_URL,
  auth: `${API_BASE_URL}/api/auth`,
  teams: `${API_BASE_URL}/api/teams`,
  workspaces: `${API_BASE_URL}/api/workspaces`,
  projects: `${API_BASE_URL}/api/projects`,
  tasks: `${API_BASE_URL}/api/tasks`,
  documents: `${API_BASE_URL}/api/documents`,
  files: `${API_BASE_URL}/api/files`,
  messages: `${API_BASE_URL}/api/messages`,
  notifications: `${API_BASE_URL}/api/notifications`,
  favorites: `${API_BASE_URL}/api/favorites`
};

export const SOCKET_URL = (import.meta.env.VITE_SOCKET_URL && import.meta.env.VITE_SOCKET_URL.trim()) ||
  (import.meta.env.PROD ? PRODUCTION_API_URL : 'http://localhost:5000');

export default API_BASE_URL;