import { Reducer } from 'redux';
import {
    CRUD_CHANGE_LIST_PARAMS,
    ChangeListParamsAction,
} from '../../actions/listActions';

const defaultState = {};

export interface State {
    [key: string]: {
        sort: string;
        order: string;
        page: number;
        perPage: number;
        filter: any;
        displayedFilters: any;
    };
}

type ActionTypes =
    | ChangeListParamsAction
    | { type: 'OTHER_ACTION'; payload: any };

export const listParams: Reducer<State> = (
    previousState = defaultState,
    action: ActionTypes
) => {
    switch (action.type) {
        case CRUD_CHANGE_LIST_PARAMS:
            return {
                ...previousState,
                [action.meta.resource]: action.payload,
            };
        default:
            return previousState;
    }
};
