import { Reducer } from 'redux';

import { FETCH_END, REFRESH_VIEW } from '../../../actions';
import meta from './cachedRequests/meta';
interface CachedRequestState {
    meta: object;
}

interface State {
    [key: string]: CachedRequestState;
}

const initialState = {};
const initialSubstate = { meta: {} };

const cachedRequestsReducer: Reducer<State> = (
    previousState = initialState,
    action
) => {
    if (action.type === REFRESH_VIEW) {
        // force refresh
        return initialState;
    }
    if (!action.meta || action.meta.fetchStatus !== FETCH_END) {
        // not a return from the dataProvider
        return previousState;
    }
    if (action.meta.fromCache) {
        // looks like a cached response
        return previousState;
    }
    const requestKey = JSON.stringify(action.requestPayload);
    const previousSubState = previousState[requestKey] || initialSubstate;
    return {
        ...previousState,
        [requestKey]: {
            meta: meta(previousSubState.meta, action),
        },
    };
};

export default cachedRequestsReducer;
