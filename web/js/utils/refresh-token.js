import { getConfig, resetConfig } from './config';

const autoRefreshToken = () => {
  const token = getConfig('refresh_token', 'live_token');
  const expiresAt = getConfig('expires_at', 'live_token');
  if (!token || !expiresAt) return;

  const timeout = expiresAt * 1000 - Date.now();
  console.log(`will refresh at: ${timeout} (about: ${timeout / 1000}s)`);
  setTimeout(() => {
    fetch(`/api/auth-refresh?token=${token}`)
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          console.error(json.error);
          return;
        }
        if (!json.refresh_token) json.refresh_token = token;
        resetConfig(json, 'live_token');
        autoRefreshToken();
        console.log('Token refreshed!!');
      });
  }, timeout);
};

export default autoRefreshToken;
