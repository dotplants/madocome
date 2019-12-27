import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { resetConfig } from '../utils/config';
import queryBuilder from '../utils/query-builder';

const Login = () => {
  const [ready, setReady] = useState(false);

  if (!location.hash) {
    const client_id = location.search.slice(1);
    if (!client_id) {
      return alert('unknown id');
    }

    const opts = {
      client_id,
      redirect_uri: `${location.origin}/login`,
      scope: [
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/youtube.force-ssl'
      ].join(' '),
      response_type: 'token'
    };
    const query = queryBuilder(opts);

    location.href = `https://accounts.google.com/o/oauth2/auth?${query}`;
    return;
  }

  useEffect(() => {
    const query = {};
    location.hash
      .slice(1)
      .split('&')
      .forEach(q => {
        const splited = q.split('=');
        query[splited[0]] = splited[1];
      });

    if (!query.access_token) {
      return alert('アクセストークンが取得できませんでした。');
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
        setReady(true);
      });
  }, []);

  if (ready) {
    return <Redirect to="/" />;
  }

  return <div>ちょっと待っててね</div>;
};

export default Login;
