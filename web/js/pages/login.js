import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { resetConfig } from '../utils/config';
import autoRefreshToken from '../utils/refresh-token';

const Login = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const query = JSON.parse(decodeURIComponent(location.search.slice(1)));
    if (!query.access_token) {
      return alert('Error: cannot get access token');
    }

    fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${query.access_token}`
    )
      .then(response => response.json())
      .then(({ error }) => {
        if (error) {
          return prompt('Error', JSON.stringify(error));
        }

        resetConfig(query, 'live_token');
        autoRefreshToken();
        setReady(true);
      });
  }, []);

  if (ready) {
    return <Redirect to="/" />;
  }

  return <div>ちょっと待っててね</div>;
};

export default Login;
