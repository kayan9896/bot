import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from "react-router-dom";

const Auth0ProviderWithHistory = ({ children }) => {
    const domain = process.env.REACT_APP_AUTH0_DOMAIN;
    const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
    const redirectUri = window.location.origin;
  
    return (
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        redirectUri={redirectUri}
        audience={process.env.REACT_APP_AUTH0_AUDIENCE}
        scope="openid profile email"
      >
        {children}
      </Auth0Provider>
    );
  };

export default Auth0ProviderWithHistory;