export const GET_LIST = 'GET_LIST';
export const GET_ONE = 'GET_ONE';
export const GET_MANY = 'GET_MANY';
export const GET_MANY_REFERENCE = 'GET_MANY_REFERENCE';
export const CREATE = 'CREATE';
export const UPDATE = 'UPDATE';
export const UPDATE_MANY = 'UPDATE_MANY';
export const DELETE = 'DELETE';
export const DELETE_MANY = 'DELETE_MANY';

export const fetchActionsWithRecordResponse = ['getOne', 'create', 'update'];
export const fetchActionsWithArrayOfIdentifiedRecordsResponse = [
    'getList',
    'getMany',
    'getManyReference',
];
export const fetchActionsWithArrayOfRecordsResponse = [
    ...fetchActionsWithArrayOfIdentifiedRecordsResponse,
    'updateMany',
    'deleteMany',
];
export const fetchActionsWithTotalResponse = ['getList', 'getManyReference'];

export const reactAdminFetchActions = [
    ...fetchActionsWithRecordResponse,
    ...fetchActionsWithArrayOfRecordsResponse,
];

export const sanitizeFetchType = (fetchType: string) => {
    switch (fetchType) {
        case GET_LIST:
            return 'getList';
        case GET_ONE:
            return 'getOne';
        case GET_MANY:
            return 'getMany';
        case GET_MANY_REFERENCE:
            return 'getManyReference';
        case CREATE:
            return 'create';
        case UPDATE:
            return 'update';
        case UPDATE_MANY:
            return 'updateMany';
        case DELETE:
            return 'delete';
        case DELETE_MANY:
            return 'deleteMany';
        default:
            return fetchType;
    }
};
