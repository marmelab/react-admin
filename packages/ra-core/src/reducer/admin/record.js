import { INITIALIZE_FORM, RESET_FORM } from '../../actions/formActions';
import set from 'lodash/set';

const initialState = {};

export default (previousState = initialState, { type, payload }) => {
    if (type === RESET_FORM) {
        return initialState;
    }

    if (type !== INITIALIZE_FORM) {
        return previousState;
    }

    return Object.keys(payload).reduce(
        (acc, key) => {
            // Ensure we correctly set default values for path with dot notation
            set(acc, key, payload[key]);
            return acc;
        },
        { ...previousState }
    );
};
