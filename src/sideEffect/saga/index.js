import { fork } from 'redux-saga/effects';
import crudFetch from './crudFetch';
import referenceFetch from './referenceFetch';
import defaultSuccessSideEffect from './success';
import defaultFailureSideEffect from './failure';

/**
 * @param {Object} restFlavor A REST object with two methods: fetch() and convertResponse()
 * @param {function} successSideEffects A function returning an array of side effects to yield by saga
 * @param {function} failureSideEffects A function returning an array of side effects to yield by saga
 */
export default (restFlavor, successSideEffects = defaultSuccessSideEffect, failureSideEffects = defaultFailureSideEffect) => function *rootSaga() {
    yield fork(crudFetch(restFlavor, successSideEffects, failureSideEffects));
    yield fork(referenceFetch);
};
