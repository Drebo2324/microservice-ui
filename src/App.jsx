import { useEffect } from 'react';
import KeycloakService from './keycloakService';
import HomePage from './HomePage';

const App = () => {
  useEffect(() => {
    KeycloakService.initKeycloak();
  }, []);

  return (
    <div>
      <HomePage />
    </div>
  );
};

export default App;
