export const GET_LIST = 'GET_LIST';
export const GET_ONE = 'GET_ONE';
export const GET_MANY = 'GET_MANY';
export const GET_MANY_REFERENCE = 'GET_MANY_REFERENCE';
export const CREATE = 'CREATE';
export const UPDATE = 'UPDATE';
export const UPDATE_MANY = 'UPDATE_MANY';
export const DELETE = 'DELETE';
export const DELETE_MANY = 'DELETE_MANY';

export const fetchActionsWithRecordResponse = [GET_ONE, CREATE, UPDATE, DELETE];
export const fetchActionsWithArrayOfRecordsResponse = [
    GET_LIST,
    GET_MANY,
    GET_MANY_REFERENCE,
    UPDATE_MANY,
    DELETE_MANY,
];
export const fetchActionsWithTotalResponse = [GET_LIST, GET_MANY_REFERENCE];
