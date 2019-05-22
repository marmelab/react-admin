import { Reducer } from 'redux';

export interface State {
    [key: string]: any;
}

const customQueriesReducer: Reducer<State> = (
    previousState = {},
    { type, requestPayload, payload, meta }
) => {
    if (type !== 'CUSTOM_QUERY_SUCCESS') {
        return previousState;
    }
    const key = JSON.stringify({
        type: meta.fetchResponse,
        resource: meta.resource,
        payload: requestPayload,
    });
    return {
        ...previousState,
        [key]: payload,
    };
};

export default customQueriesReducer;
