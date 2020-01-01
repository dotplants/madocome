const ObjectFlatten = obj => run(obj);

const run = (obj, currentKey = '') => {
  const newObj = {};

  Object.keys(obj).forEach(key => {
    const value = obj[key];

    const newKey = currentKey ? `${currentKey}.${key}` : key;

    if (typeof value === 'object') {
      Object.assign(newObj, run(value, newKey));
      return;
    }

    newObj[newKey] = value;
  });

  return newObj;
};

export default ObjectFlatten;
