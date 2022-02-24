import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    UPDATE_MANY,
    DELETE,
    DELETE_MANY,
} from './dataFetchActions';

/**
 * Get a fetch type for a data provider verb.
 *
 * The fetch type is used in reducers.
 *
 * @example getFetchType('getMany'); // 'GET_MANY'
 */
export default actionType => {
    switch (actionType) {
        case 'getList':
            return GET_LIST;
        case 'getOne':
            return GET_ONE;
        case 'getMany':
            return GET_MANY;
        case 'getManyReference':
            return GET_MANY_REFERENCE;
        case 'create':
            return CREATE;
        case 'update':
            return UPDATE;
        case 'updateMany':
            return UPDATE_MANY;
        case 'delete':
            return DELETE;
        case 'deleteMany':
            return DELETE_MANY;
        default:
            return actionType;
    }
};
