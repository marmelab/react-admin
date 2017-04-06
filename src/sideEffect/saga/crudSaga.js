import auth from './auth';
import crudFetch from './crudFetch';
import crudResponse from './crudResponse';
import referenceFetch from './referenceFetch';

/**
 * @param {Object} restClient A REST object with two methods: fetch() and convertResponse()
 */
export default (restClient, authClient) => function* crudSaga() {
    yield [
        auth(authClient)(),
        crudFetch(restClient)(),
        crudResponse(),
        referenceFetch(),
    ];
};
