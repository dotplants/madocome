const classNames = (...args) => {
  const filtered = args.filter(item => item !== false && item !== undefined);
  return filtered.join(' ');
};

export default classNames;
