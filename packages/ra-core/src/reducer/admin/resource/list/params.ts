import { Reducer } from 'redux';
import {
    ChangeListParamsAction,
    CRUD_CHANGE_LIST_PARAMS,
} from '../../../../actions';

const defaultState = {
    sort: null,
    order: null,
    page: 1,
    perPage: null,
    filter: {},
};

export interface ParamsState {
    sort: string;
    order: string;
    page: number;
    perPage: number;
    filter: any;
}

type ActionTypes =
    | ChangeListParamsAction
    | { type: 'OTHER_ACTION'; payload: any };

const paramsReducer: Reducer<ParamsState> = (
    previousState = defaultState,
    action: ActionTypes
) => {
    switch (action.type) {
        case CRUD_CHANGE_LIST_PARAMS:
            return action.payload;
        default:
            return previousState;
    }
};

export default paramsReducer;
