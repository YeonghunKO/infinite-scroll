let timer;
export const debounce = (cb, delay) => {
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(cb, delay);
};
