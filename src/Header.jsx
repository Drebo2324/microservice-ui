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
      <header className='bg-white p-4 shadow-md flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Welcome{isAuthenticated ? `, ${username}` : ''}</h1>
        <nav>
          <ul className='flex space-x-4'>
            {isAuthenticated && (
              <>
              <li>
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={toggleAddProduct}>
                  {showAddProduct ? 'Return' : 'Add Product'}
                </button>
              </li>
              <li>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"

                onClick={toggleDeleteProduct}>
                  {showDeleteProduct ? 'Return' : 'Delete Product'}
                </button>
              </li>
              </>
            )}
          </ul>
        </nav>
        {isAuthenticated ? (
          <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={logout}>Logout</button>
        ) : (
          <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={login}>Login</button>
        )}
      </header>
      <main className='container mx-auto p-4'>    
        {showAddProduct && <AddProduct />}
        {showDeleteProduct && <DeleteProduct />}
      </main>
    </div>
  );
};

export default Header;
