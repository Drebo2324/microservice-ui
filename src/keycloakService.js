import Keycloak from 'keycloak-js';

class KeycloakService {
    constructor() {
        this.keycloak = null;
        this.initKeycloak();
    }

    // Initialize Keycloak with OAuth2.0 settings
    initKeycloak() {
        if (this.keycloak) {
            return; // Prevent re-initializing Keycloak if it's already initialized
        }

        this.keycloak = new Keycloak({
            url: 'http://localhost:8181', // Keycloak URL
            realm: 'shop-microservice', // Realm name
            clientId: 'react-client', // Client ID
        });

        this.keycloak
            .init({
                onLoad: 'login-required', // Force login if not authenticated
                redirectUri: window.location.origin, // Set the redirect URI after login
                postLogoutRedirectUri: window.location.origin, // Set the redirect URI after logout
                scope: 'openid profile offline_access', // Scopes for the OAuth2 flow
                responseMode: 'query', // Use query mode for response
                responseType: 'code', // Authorization code flow
                silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html', // Silent check redirect
                silentRenew: true, // Enable silent renew
                useRefreshToken: true, // Use refresh token for silent renew
                renewTimeBeforeTokenExpiresInSeconds: 30, // Renew token 30 seconds before expiry
            })
            .then((authenticated) => {
                if (authenticated) {
                    console.log('Keycloak authenticated');
                    // Automatically refresh the token every 60 seconds
                    setInterval(() => this.refreshToken(), 60000);
                } else {
                    console.error('Keycloak authentication failed');
                }
            })
            .catch((err) => {
                console.error('Keycloak initialization failed', err);
            });
    }

    // Returns true if the user is authenticated
    isAuthenticated() {
        return this.keycloak?.authenticated || false;
    }

    // Get the access token
    getToken() {
        return this.keycloak?.token || null;
    }

    // Logout user
    logout() {
        this.keycloak?.logout();
    }

    // Login user
    login() {
        this.keycloak?.login();
    }

    getUserEmail() {
        return this.keycloak?.tokenParsed?.email;
    }

    async refreshToken() {
        try {
            const refreshed = await this.keycloak.updateToken(60);
            if (refreshed) {
                console.log('Token refreshed');
            } else {
                console.log('Token still valid');
            }
            return this.keycloak.token;
        } catch (err) {
            console.error('Failed to refresh token', err);
            this.login();
        }

    }
}

export default new KeycloakService();



