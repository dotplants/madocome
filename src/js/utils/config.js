const KEY = 'live_viewer_config';

export const getConfig = key => {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || '{}');
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
