import axios from 'axios';
import keycloakService from './keycloakService';

// Create Axios instance
const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api', // Your API base URL
});

// Request interceptor to add token to Authorization header
apiClient.interceptors.request.use(
    async (config) => {
        const token = keycloakService.getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// response interceptor to handle token expiration (401 responses)
apiClient.interceptors.response.use(
    response => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            // Handle token expiration (e.g., refresh token and retry request)
            if (keycloakService.isAuthenticated()) {
                await keycloakService.refreshToken();
                const token = keycloakService.getToken();
                if (token) {
                    error.config.headers['Authorization'] = `Bearer ${token}`;
                    return axios(error.config); // Retry the failed request with new token
                }
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;

