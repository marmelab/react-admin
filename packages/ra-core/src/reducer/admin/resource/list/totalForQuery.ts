import { Reducer } from 'redux';
import {
    CRUD_GET_LIST_SUCCESS,
    CrudGetListSuccessAction,
    CRUD_GET_MATCHING_SUCCESS,
    CrudGetMatchingSuccessAction,
} from '../../../../actions/dataActions';

type ActionTypes =
    | CrudGetListSuccessAction
    | CrudGetMatchingSuccessAction
    | {
          type: 'OTHER_TYPE';
          payload?: { ids: string[] };
          meta?: { optimistic?: boolean; fetch?: string };
      };

type State = { [key: string]: number };

const initialState = {};

const totalReducer: Reducer<State> = (
    previousState = initialState,
    action: ActionTypes
) => {
    if (
        action.type === CRUD_GET_LIST_SUCCESS ||
        action.type === CRUD_GET_MATCHING_SUCCESS
    ) {
        return {
            ...previousState,
            [JSON.stringify(action.requestPayload)]: action.payload.total,
        };
    }
    return previousState;
};

export default totalReducer;
