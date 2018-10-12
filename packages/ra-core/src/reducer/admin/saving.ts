import { actionTypes } from 'redux-form';
import { LOCATION_CHANGE } from 'react-router-redux';
import {
    CRUD_CREATE,
    CRUD_CREATE_SUCCESS,
    CRUD_CREATE_FAILURE,
    CRUD_UPDATE,
    CRUD_UPDATE_SUCCESS,
    CRUD_UPDATE_FAILURE,
} from '../../actions';

interface Action {
    type: string;
    meta?: any;
    payload?: any;
}

export default (previousState = false, { type, meta }: Action) => {
    switch (type) {
        case CRUD_CREATE:
        case CRUD_UPDATE:
            return {
                redirect: meta.onSuccess && meta.onSuccess.redirectTo,
            };
        case LOCATION_CHANGE:
        case actionTypes.SET_SUBMIT_FAILED:
        case CRUD_CREATE_SUCCESS:
        case CRUD_CREATE_FAILURE:
        case CRUD_UPDATE_SUCCESS:
        case CRUD_UPDATE_FAILURE:
            return false;
        default:
            return previousState;
    }
};
