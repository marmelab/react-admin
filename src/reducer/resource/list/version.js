import { CRUD_REFRESH_LIST } from '../../../actions/listActions';

export default resource => (previousState = 0, { type, meta }) => {
    if (!meta || meta.resource !== resource) {
        return previousState;
    }

    switch (type) {
        case CRUD_REFRESH_LIST:
            return previousState + 1;
        default:
            return previousState;
    }
};
