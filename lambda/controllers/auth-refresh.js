const request = require('request');

module.exports = (req, res) => {
  if (!req.query || !req.query.token)
    return res.status(400).json({ error: 'token is required' });

  request(
    {
      url: 'https://accounts.google.com/o/oauth2/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      json: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        refresh_token: req.query.token,
        grant_type: 'refresh_token'
      }
    },
    async (error, response, body) => {
      if (error || !body.access_token)
        return res.status(400).json({ error: 'return error' });

      body.expires_at = Date.now() / 1000 + body.expires_in;

      return res.json(body);
    }
  );
};
