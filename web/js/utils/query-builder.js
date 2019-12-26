const queryBuilder = opts =>
  Object.keys(opts)
    .map(key => `${key}=${encodeURIComponent(opts[key])}`)
    .join('&');

export default queryBuilder;
