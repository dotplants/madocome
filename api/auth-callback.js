const request = require('request');

module.exports = (req, res) => {
  if (!req.query || !req.query.code)
    return res.status(400).json({ error: 'code is required' });

  const protocol = req.headers['x-forwarded-proto'];
  const host = req.headers.host;
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
        code: req.query.code,
        redirect_uri: `${protocol}://${host}/api/auth-callback`,
        grant_type: 'authorization_code'
      }
    },
    async (error, response, body) => {
      if (error || !body.access_token)
        return res.status(400).json({ error: 'return error' });

      body.expires_at = Date.now() / 1000 + body.expires_in;

      res.statusCode = 307;
      res.setHeader(
        'Location',
        protocol +
          '://' +
          host +
          '/login?' +
          encodeURIComponent(JSON.stringify(body))
      );
      res.end();
    }
  );
};
