import {
    CREATE,
    DELETE,
    DELETE_MANY,
    GET_LIST,
    GET_MANY,
    GET_MANY_REFERENCE,
    GET_ONE,
    UPDATE,
    UPDATE_MANY,
} from '../dataFetchActions';

/**
 * Get a fetch type for a data provider verb.
 *
 * The fetch type is used in reducers.
 *
 * @example getFetchType('getMany'); // 'GET_MANY'
 */
export default actionType => {
    switch (actionType) {
        case 'create':
            return CREATE;
        case 'delete':
            return DELETE;
        case 'deleteMany':
            return DELETE_MANY;
        case 'getList':
            return GET_LIST;
        case 'getMany':
            return GET_MANY;
        case 'getManyReference':
            return GET_MANY_REFERENCE;
        case 'getOne':
            return GET_ONE;
        case 'update':
            return UPDATE;
        case 'updateMany':
            return UPDATE_MANY;

        default:
            return actionType;
    }
};
