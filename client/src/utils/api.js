import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

// Create axios instance with default config
const api = axios.create({
	baseURL: API_ENDPOINTS.base,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor to add auth token
api.interceptors.request.use(
	(config) => {
		const userInfo = localStorage.getItem('userInfo');
		if (userInfo) {
			const { token } = JSON.parse(userInfo);
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem('userInfo');
			window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);

export default api;

// Utility functions for common API calls
export const apiHelpers = {
	// Auth
	login: (credentials) => api.post('/api/auth/login', credentials),
	register: (userData) => api.post('/api/auth/register', userData),
	getProfile: () => api.get('/api/auth/profile'),

	// Teams
	getTeams: () => api.get('/api/teams'),
	createTeam: (teamData) => api.post('/api/teams', teamData),
	deleteTeam: (teamId) => api.delete(`/api/teams/${teamId}`),

	// Workspaces
	getWorkspaces: () => api.get('/api/workspaces'),
	createWorkspace: (workspaceData) => api.post('/api/workspaces', workspaceData),
	deleteWorkspace: (workspaceId) => api.delete(`/api/workspaces/${workspaceId}`),
	updateWorkspace: (workspaceId, data) => api.put(`/api/workspaces/${workspaceId}`, data),

	// Projects
	getProjects: () => api.get('/api/projects'),
	getProject: (projectId) => api.get(`/api/projects/${projectId}`),
	createProject: (projectData) => api.post('/api/projects', projectData),

	// Tasks
	getMyTasks: () => api.get('/api/tasks/my-tasks'),

	// Files
	getFiles: () => api.get('/api/files'),
	deleteFile: (fileId) => api.delete(`/api/files/${fileId}`),

	// Favorites
	getFavorites: () => api.get('/api/favorites'),
	toggleFavorite: (data) => api.post('/api/favorites/toggle', data),

	// Documents
	getDocument: (workspaceId, projectId) => {
		let url = `/api/documents/${workspaceId}`;
		if (projectId) url += `?projectId=${projectId}`;
		return api.get(url);
	}
};