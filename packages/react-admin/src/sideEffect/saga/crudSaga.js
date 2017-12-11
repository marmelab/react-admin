import { all } from 'redux-saga/effects';
import auth from './auth';
import crudFetch from './crudFetch';
import crudResponse from './crudResponse';
import referenceFetch from './referenceFetch';
import i18n from './i18n';

/**
 * @param {Object} dataProvider A Data Provider function
 */
export default (dataProvider, authClient, messagesProvider) =>
    function* crudSaga() {
        yield all([
            i18n(messagesProvider)(),
            auth(authClient)(),
            crudFetch(dataProvider)(),
            crudResponse(),
            referenceFetch(),
        ]);
    };
