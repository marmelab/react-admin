import { Reducer } from 'redux';
import {
    SET_LIST_SELECTED_IDS,
    SetListSelectedIdsAction,
    TOGGLE_LIST_ITEM,
    ToggleListItemAction,
    CRUD_DELETE_SUCCESS,
    CrudDeleteSuccessAction,
} from '../../../../actions';
import { DELETE, DELETE_MANY } from '../../../../core';
import { Identifier } from '../../../../types';

const initialState = [];

type State = Identifier[];

type ActionTypes =
    | SetListSelectedIdsAction
    | ToggleListItemAction
    | CrudDeleteSuccessAction
    | {
          type: 'DELETE_ACTION';
          meta: { optimistic: true; fetch: string };
          payload: any;
      }
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
    if (action.type === CRUD_DELETE_SUCCESS) {
        const index = previousState.indexOf(action.payload.data.id);
        if (index > -1) {
            return [
                ...previousState.slice(0, index),
                ...previousState.slice(index + 1),
            ];
        }
    }

    if (action.meta && action.meta.optimistic) {
        if (action.meta.fetch === DELETE) {
            const index = previousState.indexOf(action.payload.id);
            if (index === -1) {
                return previousState;
            }
            return [
                ...previousState.slice(0, index),
                ...previousState.slice(index + 1),
            ];
        }
        if (action.meta.fetch === DELETE_MANY) {
            return previousState.filter(id => !action.payload.ids.includes(id));
        }
    }

    return action.meta && action.meta.unselectAll
        ? initialState
        : previousState;
};

export default selectedIdsReducer;
