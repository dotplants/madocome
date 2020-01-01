import { getConfig, resetConfig } from './config';

const autoRefreshToken = (isFirst = false) => {
  const token = getConfig('refresh_token', 'live_token');
  const expiresAt = getConfig('expires_at', 'live_token');
  if (!token || !expiresAt) return;

  const timeout = (expiresAt - 10) * 1000 - Date.now();
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

        // 初回読み込み、ページ読み込み時点で切れていれば再発行
        if (isFirst && timeout < 0) {
          location.reload();
        }
      });
  }, timeout);
};

export default autoRefreshToken;
