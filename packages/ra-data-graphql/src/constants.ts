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
} from 'ra-core';

export const QUERY_TYPES = [GET_LIST, GET_MANY, GET_MANY_REFERENCE, GET_ONE];
export const MUTATION_TYPES = [
    CREATE,
    UPDATE,
    DELETE,
    UPDATE_MANY,
    DELETE_MANY,
];
export const ALL_TYPES = QUERY_TYPES.concat(MUTATION_TYPES);
