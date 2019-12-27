import queryBuilder from '../utils/query-builder';

module.exports = (req, res) => {
  const protocol = req.headers['x-forwarded-proto'];
  const host = req.headers.host;
  const opts = {
    client_id: process.env.CLIENT_ID,
    redirect_uri: `${protocol}://${host}/api/auth-callback`,
    scope: [
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtube.force-ssl'
    ].join(' '),
    response_type: 'code',
    access_type: 'offline'
  };
  const query = queryBuilder(opts);

  res.statusCode = 307;
  res.setHeader(
    'Location',
    `https://accounts.google.com/o/oauth2/auth?${query}`
  );
  res.end();
};
