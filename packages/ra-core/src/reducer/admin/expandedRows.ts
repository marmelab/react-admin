import { Reducer } from 'redux';
import {
    ToggleListItemExpandAction,
    TOGGLE_LIST_ITEM_EXPAND,
} from '../../actions/listActions';
import { Identifier } from '../../types';

type State = {
    [key: string]: Identifier[];
};

type ActionTypes =
    | ToggleListItemExpandAction
    | {
          type: 'OTHER_ACTION';
          payload: any;
      };

const initialState = {};

export const expandedRows: Reducer<State> = (
    previousState = initialState,
    action: ActionTypes
) => {
    if (action.type === TOGGLE_LIST_ITEM_EXPAND) {
        const previousIds = previousState[action.meta.resource] || [];
        const index = previousIds.findIndex(el => el == action.payload); // eslint-disable-line eqeqeq
        return {
            ...previousState,
            [action.meta.resource]:
                index > -1
                    ? [
                          ...previousIds.slice(0, index),
                          ...previousIds.slice(index + 1),
                      ]
                    : [...previousIds, action.payload],
        };
    }
    return previousState;
};
