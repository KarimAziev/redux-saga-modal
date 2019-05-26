export const modalsStateSelector = (state) => state.modals;
export const modalSelector = (
  name,
  selector = modalsStateSelector
) => (state, props) => {
  const modalsState = selector(state, props);
  return modalsState && modalsState[name];
};