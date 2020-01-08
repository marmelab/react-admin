import { Reducer } from 'redux';
import uniq from 'lodash/uniq';
import {
    CRUD_GET_LIST_SUCCESS,
    CrudGetListSuccessAction,
    CrudGetOneSuccessAction,
    CRUD_CREATE_SUCCESS,
    CrudCreateSuccessAction,
} from '../../../../actions';
import { DELETE, DELETE_MANY } from '../../../../core';
import { Identifier } from '../../../../types';

type IdentifierArray = Identifier[];

type ActionTypes =
    | CrudGetListSuccessAction
    | CrudGetOneSuccessAction
    | CrudCreateSuccessAction
    | {
          type: 'OTHER_ACTION';
          payload: any;
          meta: any;
      };

const idsReducer: Reducer<IdentifierArray> = (
    previousState = [],
    action: ActionTypes
) => {
    if (action.meta && action.meta.optimistic) {
        if (action.meta.fetch === DELETE) {
            const index = previousState
                .map(el => el === action.payload.id) // eslint-disable-line eqeqeq
                .indexOf(true);
            if (index === -1) {
                return previousState;
            }
            return [
                ...previousState.slice(0, index),
                ...previousState.slice(index + 1),
            ];
        }
        if (action.meta.fetch === DELETE_MANY) {
            const newState = previousState.filter(
                el => !action.payload.ids.includes(el)
            );

            return newState;
        }
    }

    switch (action.type) {
        case CRUD_GET_LIST_SUCCESS:
            return action.payload.data.map(({ id }) => id);
        case CRUD_CREATE_SUCCESS:
            return uniq([action.payload.data.id, ...previousState]);
        default:
            return previousState;
    }
};

export default idsReducer;

export const getIds = state => state;
