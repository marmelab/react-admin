import { Reducer } from 'redux';

import { GET_LIST } from '../../../../../core';
import {
    CrudGetListSuccessAction,
    CrudGetMatchingSuccessAction,
} from '../../../../../actions/dataActions';

type ActionTypes =
    | CrudGetListSuccessAction
    | CrudGetMatchingSuccessAction
    | { type: 'OTHER_TYPE'; payload: any; meta: any };

type State = number;

const initialState = null;

const totalReducer: Reducer<State> = (
    previousState = initialState,
    action: ActionTypes
) => {
    if (action.meta && action.meta.fetchResponse === GET_LIST) {
        return action.payload.total;
    }
    return previousState;
};

export default totalReducer;
