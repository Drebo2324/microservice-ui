import axios from 'axios';
import keycloakService from './keycloakService';

// Create Axios instance
const apiClient = axios.create({
    baseURL: 'http://localhost:9000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token to Authorization header
apiClient.interceptors.request.use(
    async (config) => {
        console.log('keycloak isAuthenticated(): ', keycloakService.isAuthenticated())

        //wait until keycloak init to add header
        if (!keycloakService.isAuthenticated()) {
            console.log('keycloak not authenticated. Waiting initialization...');
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        if (keycloakService.isAuthenticated()) {
            console.log('keycloak is authenticated')
            const token = keycloakService.getToken();
            console.log('auth token: ', token)

            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
                console.log("Adding auth header:", config.headers['Authorization']);

            }
        }

        return config;
    },

    (error) => Promise.reject(error)
);

// response interceptor to handle token expiration (401 responses)
apiClient.interceptors.response.use(
    response => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            // Handle token expiration (e.g., refresh token and retry request)
            if (keycloakService.isAuthenticated()) {
                try {
                    await keycloakService.refreshToken();
                    const token = keycloakService.getToken();

                    if (token) {
                        error.config.headers['Authorization'] = `Bearer ${token}`;
                        console.log('Retrying request with new token:', token);
                        return axios(error.config); // Retry the failed request with new token
                    }
                } catch (refreshError) {
                    console.error('token refresh failed: ', refreshError)
                }
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;

