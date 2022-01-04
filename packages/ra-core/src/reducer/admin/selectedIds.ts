import { Reducer } from 'redux';
import {
    SET_LIST_SELECTED_IDS,
    SetListSelectedIdsAction,
    TOGGLE_LIST_ITEM,
    ToggleListItemAction,
    UNSELECT_LIST_ITEMS,
    UnselectListItemsAction,
} from '../../actions';
import { Identifier } from '../../types';

const initialState = {};

type State = {
    [key: string]: Identifier[];
};

type ActionTypes =
    | SetListSelectedIdsAction
    | ToggleListItemAction
    | UnselectListItemsAction
    | {
          type: 'OTHER_ACTION';
          meta: any;
          payload: any;
      };

export const selectedIds: Reducer<State> = (
    previousState: State = initialState,
    action: ActionTypes
) => {
    if (action.type === SET_LIST_SELECTED_IDS) {
        return {
            ...previousState,
            [action.meta.resource]: action.payload,
        };
    }
    if (action.type === TOGGLE_LIST_ITEM) {
        const previousIds = previousState[action.meta.resource] || [];
        const index = previousIds.indexOf(action.payload);
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
    if (action.type === UNSELECT_LIST_ITEMS) {
        const ids = action.payload;
        if (!ids || ids.length === 0) return previousState;
        const previousIds = previousState[action.meta.resource] || [];
        let newIds = [...previousIds];
        ids.forEach(id => {
            const index = newIds.indexOf(id);
            if (index > -1) {
                newIds = [
                    ...previousIds.slice(0, index),
                    ...previousIds.slice(index + 1),
                ];
            }
        });
        return {
            ...previousState,
            [action.meta.resource]: newIds,
        };
    }

    return previousState;
};
