import { getConfig } from './config';
import queryBuilder from './query-builder';

const api = ({ path, method = 'GET', data = {}, useToken = true }) =>
  new Promise((resolve, reject) => {
    const token = getConfig('access_token', 'live_token');

    let params = '';
    if (method === 'GET' && data !== {}) {
      params = `?${queryBuilder(data)}`;
    }

    fetch(`https://www.googleapis.com/${path}${params}`, {
      method,
      body: method === 'POST' ? JSON.stringify(data) : null,
      headers: {
        Authorization: token && useToken && `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => (res.ok ? res.json() : reject(res)))
      .then(resolve);
  });

export default api;
