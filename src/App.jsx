import { useEffect } from 'react';
import KeycloakService from './keycloakService'; // Import the KeycloakService for initialization
import Header from './Header'; // Import the Header component
import HomePage from './HomePage';

const App = () => {
  useEffect(() => {
    KeycloakService.initKeycloak();
  }, []);

  return (
    <div>
      <Header />
      <div>
        <HomePage />
      </div>
    </div>
  );
};

export default App;
