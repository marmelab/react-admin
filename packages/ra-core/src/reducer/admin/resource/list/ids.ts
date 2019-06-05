import { Reducer } from 'redux';
import uniq from 'lodash/uniq';
import {
    CRUD_GET_LIST_SUCCESS,
    CrudGetListSuccessAction,
    CRUD_GET_MANY_SUCCESS,
    CrudGetManySuccessAction,
    CRUD_GET_MANY_REFERENCE_SUCCESS,
    CrudGetManyReferenceSuccessAction,
    CRUD_GET_ONE_SUCCESS,
    CrudGetOneSuccessAction,
    CRUD_CREATE_SUCCESS,
    CrudCreateSuccessAction,
    CRUD_UPDATE_SUCCESS,
    CrudUpdateSuccessAction,
} from '../../../../actions/dataActions';
import getFetchedAt from '../../../../util/getFetchedAt';
import { DELETE, DELETE_MANY } from '../../../../dataFetchActions';
import { Identifier } from '../../../../types';

type IdentifierArray = Identifier[];

export interface IdentifierArrayWithDate extends IdentifierArray {
    fetchedAt?: Date;
}

type State = IdentifierArrayWithDate;

export const addRecordIdsFactory = getFetchedAtCallback => (
    newRecordIds: IdentifierArrayWithDate = [],
    oldRecordIds: IdentifierArrayWithDate
): IdentifierArrayWithDate => {
    const newFetchedAt = getFetchedAtCallback(newRecordIds, oldRecordIds.fetchedAt);
    const recordIds = uniq(oldRecordIds.filter(id => !!newFetchedAt[id]).concat(newRecordIds));

    Object.defineProperty(recordIds, 'fetchedAt', {
        value: newFetchedAt,
    }); // non enumerable by default
    return recordIds;
};

const addRecordIds = addRecordIdsFactory(getFetchedAt);

type ActionTypes =
    | CrudGetListSuccessAction
    | CrudGetManySuccessAction
    | CrudGetManyReferenceSuccessAction
    | CrudGetOneSuccessAction
    | CrudCreateSuccessAction
    | CrudUpdateSuccessAction
    | {
          type: 'OTHER_ACTION';
          payload: any;
          meta: any;
      };

const idsReducer: Reducer<State> = (previousState = [], action: ActionTypes) => {
    if (action.meta && action.meta.optimistic) {
        if (action.meta.fetch === DELETE) {
            const index = previousState
                .map(el => el === action.payload.id) // eslint-disable-line eqeqeq
                .indexOf(true);
            if (index === -1) {
                return previousState;
            }
            const newState = [...previousState.slice(0, index), ...previousState.slice(index + 1)];

            Object.defineProperty(newState, 'fetchedAt', {
                value: previousState.fetchedAt,
            });

            return newState;
        }
        if (action.meta.fetch === DELETE_MANY) {
            const newState = previousState.filter(el => !action.payload.ids.includes(el));
            Object.defineProperty(newState, 'fetchedAt', {
                value: previousState.fetchedAt,
            });

            return newState;
        }
    }

    switch (action.type) {
        case CRUD_GET_LIST_SUCCESS:
            return addRecordIds(action.payload.data.map(({ id }) => id), []);
        case CRUD_GET_MANY_SUCCESS:
        case CRUD_GET_MANY_REFERENCE_SUCCESS:
            return addRecordIds(
                action.payload.data.map(({ id }) => id).filter(id => previousState.indexOf(id) !== -1),
                previousState
            );
        case CRUD_GET_ONE_SUCCESS:
        case CRUD_CREATE_SUCCESS:
        case CRUD_UPDATE_SUCCESS:
            return addRecordIds([action.payload.data.id], previousState);
        default:
            return previousState;
    }
};

export default idsReducer;

export const getIds = state => state;
