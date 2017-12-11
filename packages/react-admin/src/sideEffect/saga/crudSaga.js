import { all } from 'redux-saga/effects';
import auth from './auth';
import crudFetch from './crudFetch';
import crudResponse from './crudResponse';
import referenceFetch from './referenceFetch';

/**
 * @param {Object} dataProvider A Data Provider function
 */
export default (dataProvider, authClient) =>
    function* crudSaga() {
        yield all([
            auth(authClient)(),
            crudFetch(dataProvider)(),
            crudResponse(),
            referenceFetch(),
        ]);
    };
