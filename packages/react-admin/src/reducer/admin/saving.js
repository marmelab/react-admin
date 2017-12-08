import { actionTypes } from 'redux-form';
import { LOCATION_CHANGE } from 'react-router-redux';
import { crudCreate, crudUpdate } from '../../actions';

export default (previousState = false, { type, payload }) => {
    switch (type) {
        case crudCreate.REQUEST:
        case crudUpdate.REQUEST:
            return { redirect: payload.redirectTo };
        case LOCATION_CHANGE:
        case actionTypes.SET_SUBMIT_FAILED:
        case crudCreate.SUCCESS:
        case crudCreate.FAILURE:
        case crudUpdate.SUCCESS:
        case crudUpdate.FAILURE:
            return false;
        default:
            return previousState;
    }
};
