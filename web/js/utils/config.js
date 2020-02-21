export const KEY = 'live_viewer_config';

const defaultConfig = {
  version: 1
};

export const getStringData = (key = KEY) => localStorage.getItem(key);

export const getConfig = (key, itemKey = KEY) => {
  try {
    const data = JSON.parse(
      getStringData(itemKey) || JSON.stringify(defaultConfig)
    );
    return data[key];
  } catch (e) {
    console.error(e);
    alert(
      'Error: configが壊れています。ローカルストレージを消去してください。 (get)'
    );
  }
};

export const resetConfig = (data = {}, itemKey = KEY) => {
  try {
    return localStorage.setItem(itemKey, JSON.stringify(data));
  } catch (e) {
    console.error(e);
    alert(
      'Error: configが壊れています。ローカルストレージを消去してください。 (set)'
    );
  }
};

export const setConfig = (key, value, itemKey = KEY) => {
  try {
    const data = JSON.parse(
      getStringData(itemKey) || JSON.stringify(defaultConfig)
    );
    data[key] = value;

    return localStorage.setItem(itemKey, JSON.stringify(data));
  } catch (e) {
    console.error(e);
    alert(
      'Error: configが壊れています。ローカルストレージを消去してください。 (set)'
    );
  }
};
