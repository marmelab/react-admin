import { Reducer } from 'redux';
import {
    SET_LIST_SELECTED_IDS,
    SetListLelectedIdsAction,
    TOGGLE_LIST_ITEM,
    ToggleListItemAction,
} from '../../../../actions/listActions';
import { CRUD_DELETE_OPTIMISTIC } from '../../../../actions/dataActions';

const initialState = [];

type State = any[];

type ActionTypes =
    | SetListLelectedIdsAction
    | ToggleListItemAction
    | { type: typeof CRUD_DELETE_OPTIMISTIC; payload: { id: string } } // FIXME use type from action creator
    | { type: 'OTHER_ACTION'; meta?: any };

const selectedIdsReducer: Reducer<State> = (
    previousState: State = initialState,
    action: ActionTypes
) => {
    switch (action.type) {
        case SET_LIST_SELECTED_IDS:
            return action.payload;
        case TOGGLE_LIST_ITEM: {
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
        case CRUD_DELETE_OPTIMISTIC: {
            const index = previousState.indexOf(action.payload.id);
            if (index === -1) {
                return previousState;
            }
            return [
                ...previousState.slice(0, index),
                ...previousState.slice(index + 1),
            ];
        }
        default:
            return action.meta && action.meta.unselectAll
                ? initialState
                : previousState;
    }
};

export default selectedIdsReducer;
