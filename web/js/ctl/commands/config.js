import { resetConfig, KEY } from '../../utils/config';

export const overWriteConfig = (data = {}) =>
  localStorage.setItem(KEY, JSON.stringify(data));

export { resetConfig };
