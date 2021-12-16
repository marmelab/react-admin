import { Reducer } from 'redux';

import { Identifier } from '../../../../types';
import { FETCH_END } from '../../../../actions';
import {
    GET_LIST,
    CREATE,
    DELETE,
    DELETE_MANY,
    UPDATE,
    UPDATE_MANY,
} from '../../../../core';
import total from './cachedRequests/total';
import validity from './cachedRequests/validity';

interface CachedRequestState {
    ids: Identifier[];
    total: number;
    validity: Date;
}

interface State {
    [key: string]: CachedRequestState;
}

const initialState = {};
const initialSubstate = { total: null, validity: null };

const cachedRequestsReducer: Reducer<State> = (
    previousState = initialState,
    action
) => {
    if (action.meta && action.meta.optimistic) {
        if (
            action.meta.fetch === CREATE ||
            action.meta.fetch === DELETE ||
            action.meta.fetch === DELETE_MANY ||
            action.meta.fetch === UPDATE ||
            action.meta.fetch === UPDATE_MANY
        ) {
            // force refresh of all lists because we don't know where the
            // new/deleted/updated record(s) will appear in the list
            return initialState;
        }
    }
    if (!action.meta || action.meta.fetchStatus !== FETCH_END) {
        // not a return from the dataProvider
        return previousState;
    }
    if (
        action.meta.fetchResponse === CREATE ||
        action.meta.fetchResponse === DELETE ||
        action.meta.fetchResponse === DELETE_MANY ||
        action.meta.fetchResponse === UPDATE ||
        action.meta.fetchResponse === UPDATE_MANY
    ) {
        // force refresh of all lists because we don't know where the
        // new/deleted/updated record(s) will appear in the list
        return initialState;
    }
    if (action.meta.fetchResponse !== GET_LIST || action.meta.fromCache) {
        // looks like a GET_MANY, a GET_ONE, or a cached response
        return previousState;
    }
    const requestKey = JSON.stringify(action.requestPayload);
    const previousSubState = previousState[requestKey] || initialSubstate;
    return {
        ...previousState,
        [requestKey]: {
            total: total(previousSubState.total, action),
            validity: validity(previousSubState.validity, action),
        },
    };
};

export default cachedRequestsReducer;
