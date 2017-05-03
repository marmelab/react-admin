import { actionTypes } from 'redux-form';
import { LOCATION_CHANGE } from 'react-router-redux';
import { CRUD_CREATE_FAILURE, CRUD_UPDATE_FAILURE } from '../actions';

export default (previousState = false, { type }) => {
    switch (type) {
    case actionTypes.TOUCH:
        return true;
    case LOCATION_CHANGE:
    case actionTypes.SET_SUBMIT_FAILED:
    case CRUD_CREATE_FAILURE:
    case CRUD_UPDATE_FAILURE:
        return false;
    default:
        return previousState;
    }
};
