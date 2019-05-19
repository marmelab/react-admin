import { Reducer } from 'redux';
import {
    FETCH_START,
    FETCH_END,
    FETCH_ERROR,
    FETCH_CANCEL,
} from '../../actions/fetchActions';

export interface State {
    [key: string]: {
        loaded?: boolean;
        loading?: boolean;
        error?: string;
    };
}

const requestsReducer: Reducer<State> = (
    previousState = {},
    { payload, requestPayload, error, meta }
) => {
    if (!meta || !meta.fetchStatus) {
        return previousState;
    }
    const key = JSON.stringify({
        type: meta.fetchResponse,
        payload: requestPayload || payload,
    });
    const previousStatus = previousState[key];
    switch (meta.fetchStatus) {
        case FETCH_START:
            return {
                ...previousState,
                [key]:
                    previousStatus && previousStatus.loaded
                        ? { loaded: true, loading: true } // reloading: do not reset loaded
                        : { loaded: false, loading: true },
            };
        case FETCH_END:
            return {
                ...previousState,
                [key]: { loaded: true, loading: false },
            };
        case FETCH_ERROR:
            return {
                ...previousState,
                [key]: { error, loaded: false, loading: false },
            };
        case FETCH_CANCEL:
            return {
                ...previousState,
                [key]: { loaded: false, loading: false },
            };
        default:
            return previousState;
    }
};

export default requestsReducer;
