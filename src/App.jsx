import React, { useEffect } from 'react';
import KeycloakService from './keycloakService'; // Import the KeycloakService for initialization
import Header from './Header'; // Import the Header component

const App = () => {
  useEffect(() => {
    // Initialize Keycloak on app load
    KeycloakService.initKeycloak();
  }, []);

  return (
    <div>
      <Header /> {/* Include the Header component */}
      <div>
        <h2>Welcome to the Application!</h2>
        {/* Other components and content for your app */}
      </div>
    </div>
  );
};

export default App;
