export const setRatio = length => {
  switch (length) {
    case 0:
    case 1:
      return 1.2;
    case 2:
    case 3:
    case 4:
      return 2.0;
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
      return 3.0;
    case 10:
    case 11:
    case 12:
      return 4.0;
    default:
      return 5.0;
  }
};

export const youtubeRegExp = /(.*?)(^|\/|v=)([a-z0-9_-]{11})(.*)?/im;
