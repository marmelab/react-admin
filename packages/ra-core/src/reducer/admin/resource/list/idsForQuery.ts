import { Reducer } from 'redux';
import without from 'lodash/without';
import mapValues from 'lodash/mapValues';
import {
    CRUD_GET_LIST_SUCCESS,
    CrudGetListSuccessAction,
    CRUD_GET_MATCHING_SUCCESS,
    CrudGetMatchingSuccessAction,
} from '../../../../actions';
import { DELETE, DELETE_MANY } from '../../../../core';
import { Identifier } from '../../../../types';

type IdentifierArray = Identifier[];

interface State {
    [key: string]: IdentifierArray;
}

type ActionTypes =
    | CrudGetListSuccessAction
    | CrudGetMatchingSuccessAction
    | {
          type: 'OTHER_ACTION';
          payload: any;
          meta: any;
      };

const initialState = {};

const idsForQueryReducer: Reducer<State> = (
    previousState = initialState,
    action: ActionTypes
) => {
    if (action.meta && action.meta.optimistic) {
        if (action.meta.fetch === DELETE) {
            return mapValues(previousState, ids =>
                without(ids, action.payload.id)
            );
        }
        if (action.meta.fetch === DELETE_MANY) {
            return mapValues(previousState, ids =>
                without(ids, ...action.payload.ids)
            );
        }
    }

    switch (action.type) {
        case CRUD_GET_LIST_SUCCESS:
        case CRUD_GET_MATCHING_SUCCESS:
            return {
                ...previousState,
                [JSON.stringify(
                    action.requestPayload
                )]: action.payload.data.map(({ id }) => id),
            };
        default:
            return previousState;
    }
};

export default idsForQueryReducer;
