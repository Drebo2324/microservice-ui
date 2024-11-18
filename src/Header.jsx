import React, { useState, useEffect } from 'react';
import KeycloakService from './keycloakService'; // Assuming KeycloakService handles authentication

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  // Fetch the authentication state and user data on initial load
  useEffect(() => {
    const keycloak = KeycloakService.initKeycloak;

    if (keycloak) {
      // Set initial authentication status and username
      setIsAuthenticated(keycloak.isAuthenticated);
      setUsername(keycloak.tokenParsed?.preferred_username || '');
      
      // Listen to Keycloak events (auth success, logout)
      keycloak.onAuthSuccess = () => {
        setIsAuthenticated(true);
        setUsername(keycloak.tokenParsed?.preferred_username || '');
      };

      keycloak.onAuthLogout = () => {
        setIsAuthenticated(false);
        setUsername('');
      };
    }
    
    return () => {
      // Clean up Keycloak event listeners
      if (keycloak) {
        keycloak.onAuthSuccess = null;
        keycloak.onAuthLogout = null;
      }
    };
  }, []);

  const login = () => {
    const keycloak = KeycloakService.initKeycloak();
    if (keycloak) {
      keycloak.login();
    }
  };

  const logout = () => {
    const keycloak = KeycloakService.initKeycloak();
    if (keycloak) {
      keycloak.logout();
    }
  };

  return (
    <nav className="bg-white border border-gray-200 dark:border-gray-700 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-800 shadow">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <a href="/" className="flex items-center">
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Spring Boot Microservices Shop
          </span>
        </a>

        <div className="flex items-center">
          <button
            id="menu-toggle"
            type="button"
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
          >
            <span className="sr-only">Open main menu</span>
            {/* Hamburger icon */}
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        <div className="w-full md:block md:w-auto hidden" id="mobile-menu">
          <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
            <li>
              {isAuthenticated ? (
                <>
                  <p className="text-white">Hi {username}</p>
                  <a
                    onClick={logout}
                    className="block py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    Logout
                  </a>
                </>
              ) : (
                <a
                  onClick={login}
                  className="block py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Login
                </a>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
