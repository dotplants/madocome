import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { resetConfig } from '../utils/config';

const Login = () => {
  const [ready, setReady] = useState(false);

  if (!location.hash) {
    const opts = {
      client_id: process.env.YT_CLIENT_ID,
      redirect_uri: `${location.origin}/login`,
      scope: [
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/youtube.force-ssl'
      ].join(' '),
      response_type: 'token'
    };

    const query = Object.keys(opts).map(
      key => `${key}=${encodeURIComponent(opts[key])}`
    );

    location.href = `https://accounts.google.com/o/oauth2/auth?${query.join(
      '&'
    )}`;
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
      .then(json => {
        if (json.audience !== process.env.YT_CLIENT_ID) {
          return alert(
            'データが改ざんされている可能性があるため使用できません。'
          );
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
