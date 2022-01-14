import { combineReducers, Reducer } from 'redux';

import admin from './admin';
import { ReduxState } from '../types';

interface CustomReducers {
    [key: string]: Reducer;
}

export default (customReducers: CustomReducers) =>
    combineReducers({
        admin,
        ...customReducers,
    }) as Reducer<ReduxState>;
