import { all } from 'redux-saga/effects';
import auth from './auth';
import cancelSaga from './cancelSaga';
import crudFetch from './crudFetch';
import crudResponse from './crudResponse';
import notificationSaga from './notificationSaga';
import redirectionSaga from './redirectionSaga';
import referenceFetch from './referenceFetch';
import i18n from './i18n';

/**
 * @param {Object} dataProvider A Data Provider function
 */
export default (dataProvider, authProvider, i18nProvider) =>
    function* crudSaga() {
        yield all([
            i18n(i18nProvider)(),
            auth(authProvider)(),
            cancelSaga(),
            crudFetch(dataProvider)(),
            crudResponse(),
            referenceFetch(),
            redirectionSaga(),
            notificationSaga(),
        ]);
    };
