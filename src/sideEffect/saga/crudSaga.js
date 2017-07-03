import { all } from 'redux-saga/effects';
import auth from './auth';
import crudFetch from './crudFetch';
import crudResponse from './crudResponse';
import referenceFetch from './referenceFetch';

/**
 * @param {Object} restClient A REST object with two methods: fetch() and convertResponse()
 */
export default (restClient, authClient) =>
    function* crudSaga() {
        yield all([
            auth(authClient)(),
            crudFetch(restClient)(),
            crudResponse(),
            referenceFetch(),
        ]);
    };
