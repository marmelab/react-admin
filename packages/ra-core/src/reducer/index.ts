import { combineReducers, Reducer } from 'redux';
import admin from './admin';
export { getNotification } from './admin/notifications';

interface CustomReducers {
    [key: string]: Reducer;
}

export default (customReducers: CustomReducers) =>
    combineReducers({
        admin,
        ...customReducers,
    });
