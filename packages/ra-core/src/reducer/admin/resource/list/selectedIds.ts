import { Reducer } from 'redux';
import {
    SET_LIST_SELECTED_IDS,
    SetListSelectedIdsAction,
    TOGGLE_LIST_ITEM,
    ToggleListItemAction,
    UNSELECT_LIST_ITEMS,
    UnselectListItemsAction,
} from '../../../../actions';
import { Identifier } from '../../../../types';

const initialState = [];

type State = Identifier[];

type ActionTypes =
    | SetListSelectedIdsAction
    | ToggleListItemAction
    | UnselectListItemsAction
    | {
          type: 'OTHER_ACTION';
          meta: any;
          payload: any;
      };

const selectedIdsReducer: Reducer<State> = (
    previousState: State = initialState,
    action: ActionTypes
) => {
    if (action.type === SET_LIST_SELECTED_IDS) {
        return action.payload;
    }
    if (action.type === TOGGLE_LIST_ITEM) {
        const index = previousState.indexOf(action.payload);
        if (index > -1) {
            return [
                ...previousState.slice(0, index),
                ...previousState.slice(index + 1),
            ];
        } else {
            return [...previousState, action.payload];
        }
    }
    if (action.type === UNSELECT_LIST_ITEMS) {
        const ids = action.payload;
        if (!ids || ids.length === 0) return previousState;
        let newState = [...previousState];
        ids.forEach(id => {
            const index = newState.indexOf(id);
            if (index > -1) {
                newState = [
                    ...previousState.slice(0, index),
                    ...previousState.slice(index + 1),
                ];
            }
        });
        return newState;
    }

    return action.meta && action.meta.unselectAll
        ? initialState
        : previousState;
};

export default selectedIdsReducer;
