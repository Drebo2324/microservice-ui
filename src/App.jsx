import { useEffect } from 'react';
import KeycloakService from './keycloakService';
import Header from './Header';
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
