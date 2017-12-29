import { all } from 'redux-saga/effects';
import auth from './auth';
import crudFetch from './crudFetch';
import crudResponse from './crudResponse';
import referenceFetch from './referenceFetch';

/**
 * @param {Object} dataProvider A Data Provider function
 * @param {Object} authClient
 * @param {Object} appSettings
 */
export default (dataProvider, authClient, appSettings) =>
    function* crudSaga() {
        yield all([
            auth(authClient, appSettings)(),
            crudFetch(dataProvider)(),
            crudResponse(appSettings)(),
            referenceFetch(),
        ]);
    };
