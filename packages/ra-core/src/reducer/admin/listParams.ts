import { Reducer } from 'redux';

import {
    CRUD_CHANGE_LIST_PARAMS,
    ChangeListParamsAction,
} from '../../actions/listActions';
import { FilterItem } from '../../types';

const defaultState = {};

export interface State {
    [key: string]: {
        sort: string;
        order: string;
        page: number;
        perPage: number;
        filters: FilterItem[];
        displayedFilters: { [key: string]: boolean };
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
