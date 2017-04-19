export const TOGGLE_FIELD = 'TOGGLE_FIELD';

export default resource => (previousState = [], { type, payload, meta }) => {
    if (!meta || meta.resource !== resource) {
        return previousState;
    }
    switch (type) {
    case TOGGLE_FIELD:
        return previousState.indexOf(payload) !== -1
                    ? previousState.filter(field => field !== payload)
                    : [...previousState, payload];
    default:
        return previousState;
    }
};
