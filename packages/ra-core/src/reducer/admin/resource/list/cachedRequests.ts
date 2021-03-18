import { Reducer } from 'redux';

import { Identifier } from '../../../../types';
import { FETCH_END, REFRESH_VIEW } from '../../../../actions';
import {
    GET_LIST,
    CREATE,
    DELETE,
    DELETE_MANY,
    UPDATE,
    UPDATE_MANY,
} from '../../../../core';
import ids from './cachedRequests/ids';
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
const initialSubstate = { ids: [], total: null, validity: null };

const cachedRequestsReducer: Reducer<State> = (
    previousState = initialState,
    action
) => {
    if (action.type === REFRESH_VIEW) {
        if (action.payload?.hard) {
            // force refresh
            return initialState;
        } else {
            // remove validity only
            const newState = {};
            Object.keys(previousState).forEach(key => {
                newState[key] = {
                    ...previousState[key],
                    validity: undefined,
                };
            });
            return newState;
        }
    }
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
            ids: ids(previousSubState.ids, action),
            total: total(previousSubState.total, action),
            validity: validity(previousSubState.validity, action),
        },
    };
};

export default cachedRequestsReducer;
