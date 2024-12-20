import { useState, useEffect } from 'react';
import KeycloakService from './keycloakService';
import AddProduct from './AddProduct';
import DeleteProduct from './DeleteProduct';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showDeleteProduct, setShowDeleteProduct] = useState(false);

  // Fetch authentication state and user data on initial load
  useEffect(() => {
    const keycloak = KeycloakService.keycloak;

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

  const toggleAddProduct = () => {
    setShowAddProduct((prev) => !prev);
  }
  const toggleDeleteProduct = () => {
    setShowDeleteProduct((prev) => !prev);
  }

  return (
    <div>
      <h1>Welcome{isAuthenticated ? `, ${username}` : ''}</h1>
      <nav>
        <ul>
          {isAuthenticated && (
            <li>
              <button onClick={toggleAddProduct}>
                {showAddProduct ? 'Return' : 'Add Product'}
              </button>
              <button onClick={toggleDeleteProduct}>
                {showDeleteProduct ? 'Return' : 'Delete Product'}
              </button>
            </li>
          )}
        </ul>
      </nav>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={login}>Login</button>
      )}
      
      {showAddProduct && <AddProduct />}

      {showDeleteProduct && <DeleteProduct />}
    </div>
  );
};

export default Header;
