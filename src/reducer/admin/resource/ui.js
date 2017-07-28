import { DECLARE_RESOURCE } from '../../../actions';

export default resource => (previousState = {}, { type, payload, meta }) => {
    if (!meta || meta.resource !== resource) {
        return previousState;
    }

    if (type === DECLARE_RESOURCE) {
        return payload;
    }

    return previousState;
};
