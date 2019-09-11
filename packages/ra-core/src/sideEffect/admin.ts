import { DataProvider, AuthProvider, I18nProvider } from '../types';
import { all } from 'redux-saga/effects';
import auth from './auth';
import callback from './callback';
import fetch from './fetch';
import error from './error';
import notification from './notification';
import redirection from './redirection';
import accumulate from './accumulate';
import refresh from './refresh';
import undo from './undo';
import unload from './unload';

/**
 * @param {Object} dataProvider A Data Provider function
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
            error(),
            accumulate(),
            redirection(),
            refresh(),
            notification(),
            callback(),
            unload(),
        ]);
    };
