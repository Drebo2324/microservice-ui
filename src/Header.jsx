import React, { useState, useEffect } from 'react';
import KeycloakService from './keycloakService'; // Assuming KeycloakService handles authentication

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  // Fetch authentication state and user data on initial load
  useEffect(() => {
    const keycloak = KeycloakService.keycloak; // Use the keycloak instance

    if (keycloak) {
      // Initialize the authentication status
      const checkAuthStatus = () => {
        setIsAuthenticated(keycloak.authenticated);
        setUsername(keycloak.tokenParsed?.preferred_username || '');
      };

      // Monitor token changes or state changes
      keycloak.onTokenExpired = () => {
        checkAuthStatus();
      };

      keycloak.onAuthSuccess = () => {
        checkAuthStatus();
      };

      keycloak.onAuthLogout = () => {
        setIsAuthenticated(false);
        setUsername('');
      };

    } else {
      console.error('Keycloak not initialized');
    }

    return () => {
      // Clean up Keycloak event listeners
      const keycloak = KeycloakService.keycloak;
      if (keycloak) {
        keycloak.onTokenExpired = null;
        keycloak.onAuthSuccess = null;
        keycloak.onAuthLogout = null;
      }
    };
  }, []);

  const login = () => {
    const keycloak = KeycloakService.keycloak;
    if (keycloak) {
      keycloak.login();
    }
  };

  const logout = () => {
    const keycloak = KeycloakService.keycloak;
    if (keycloak) {
      keycloak.logout();
    }
  };

  return (
    <div>
      <h1>Welcome{isAuthenticated ? `, ${username}` : ''}</h1>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>
  );
};

export default Header;
