const KEY = 'live_viewer_config';

const defaultConfig = {
  version: 1
};

export const getStringData = () => localStorage.getItem(KEY);

export const getConfig = key => {
  try {
    const data = JSON.parse(getStringData() || JSON.stringify(defaultConfig));
    return data[key];
  } catch (e) {
    console.error(e);
    alert(
      'Error: configが壊れています。ローカルストレージを消去してください。 (get)'
    );
  }
};

export const setConfig = (key, value) => {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || '{}');
    data[key] = value;

    return localStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    console.error(e);
    alert(
      'Error: configが壊れています。ローカルストレージを消去してください。 (set)'
    );
  }
};
