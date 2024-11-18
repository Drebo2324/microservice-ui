import './index.css'
import React, { useEffect, useState } from 'react';
import keycloakService from './keycloakService';
import Header from './Header';

const App = () => {
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        // Initialize Keycloak on component mount
        keycloakService.initKeycloak();

        // Listen for Keycloak authentication status
        const interval = setInterval(() => {
            setAuthenticated(keycloakService.isAuthenticated());
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    if (!authenticated) {
        return <div><Header /></div>;
    }

    return <div>Authenticated</div>;
};

export default App;

