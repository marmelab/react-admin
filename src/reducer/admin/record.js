import { INITIALIZE_FORM } from '../../actions/formActions';
import { LOCATION_CHANGE } from 'react-router-redux';

const initialState = {};

export default (previousState = initialState, { type, payload }) => {
    if (type !== INITIALIZE_FORM) {
        return previousState;
    }

    if (type === LOCATION_CHANGE) {
        return initialState;
    }

    return { ...previousState, ...payload };
};
