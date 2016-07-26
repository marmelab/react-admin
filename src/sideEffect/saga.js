import { fork } from 'redux-saga/effects';
import crudFetch from './crudFetch';
import referenceFetch from './referenceFetch';

export default (restFlavor) => function *rootSaga() {
    yield fork(crudFetch(restFlavor));
    yield fork(referenceFetch);
};
