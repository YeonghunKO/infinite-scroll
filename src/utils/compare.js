export const isChanged = (original, highlight) => {
  const { stringify } = JSON;
  if (stringify(original.innerHTML) !== stringify(highlight)) {
    return true;
  }
  return false;
};
