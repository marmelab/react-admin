import { DataProvider, AuthProvider } from '../types';
import { all } from 'redux-saga/effects';
import auth from './auth';
import callback from './callback';
import fetch from './fetch';
import notification from './notification';
import redirection from './redirection';
import accumulate from './accumulate';
import refresh from './refresh';
import undo from './undo';

/**
 * @param {Object} dataProvider A Data Provider function
 * @param {Function} authProvider An Authentication Provider object
 */
export default (
    dataProvider: DataProvider,
    authProvider: AuthProvider | null
) =>
    function* admin() {
        yield all([
            auth(authProvider)(),
            undo(),
            fetch(dataProvider)(),
            accumulate(),
            redirection(),
            refresh(),
            notification(),
            callback(),
        ]);
    };
