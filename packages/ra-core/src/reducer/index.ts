import { combineReducers, Reducer } from 'redux';

import { ReduxState } from '../types';

interface CustomReducers {
    [key: string]: Reducer;
}

export default (customReducers: CustomReducers) =>
    combineReducers({
        // FIXME: to be removed when we remove the provider
        admin: (state = null) => state,
        ...customReducers,
    }) as Reducer<ReduxState>;
