import { Reducer } from 'redux';
import {
    CRUD_GET_LIST_SUCCESS,
    CrudGetListSuccessAction,
} from '../../../../actions/dataActions';

type ActionTypes =
    | CrudGetListSuccessAction
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
    if (action.type === CRUD_GET_LIST_SUCCESS) {
        return {
            ...previousState,
            [JSON.stringify(action.requestPayload)]: action.payload.total,
        };
    }
    return previousState;
};

export default totalReducer;
