import { combineReducers, Reducer } from 'redux';

import { ReduxState } from '../types';

export default () =>
    combineReducers({
        // FIXME: to be removed when we remove the provider
        admin: (state = null) => state,
    }) as Reducer<ReduxState>;
