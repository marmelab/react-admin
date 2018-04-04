import { INITIALIZE_FORM } from '../../actions/formActions';
import { LOCATION_CHANGE } from 'react-router-redux';
import set from 'lodash/set';

const initialState = {};

export default (previousState = initialState, { type, payload }) => {
    if (type === LOCATION_CHANGE) {
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
