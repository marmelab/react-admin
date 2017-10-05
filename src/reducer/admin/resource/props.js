export const initialState = {};

export default (resource = {}) => (state = initialState) => ({
    ...state,
    ...resource,
});
