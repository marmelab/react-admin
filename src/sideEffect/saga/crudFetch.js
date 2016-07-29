import { takeLatest, delay } from 'redux-saga';
import { put, call, cancelled } from 'redux-saga/effects';
import {
    FETCH_START,
    FETCH_END,
    FETCH_ERROR,
    FETCH_CANCEL,
} from '../../actions/fetchActions';

const crudFetch = (restClient, successSideEffects = () => [], failureSideEffects = () => []) => {
    function *handleFetch(action) {
        const { type, payload, meta } = action;
        delete meta.fetch;
        yield [
            put({ type: `${type}_LOADING`, payload, meta }),
            put({ type: FETCH_START }),
        ];
        let response;
        try {
            yield call(delay, 1000); // FIXME simulate response delay
            response = yield call(restClient, type, meta.resource, payload);
        } catch (error) {
            const sideEffects = failureSideEffects(type, meta.resource, payload, error);
            yield [
                ...sideEffects.map(a => put(a)),
                put({ type: `${type}_FAILURE`, error, meta }),
                put({ type: FETCH_ERROR }),
            ];
            return;
        } finally {
            if (yield cancelled()) {
                yield put({ type: FETCH_CANCEL });
                return; /* eslint no-unsafe-finally:0 */
            }
        }
        const sideEffects = successSideEffects(type, meta.resource, payload, response);
        yield [
            ...sideEffects.map(a => put(a)),
            put({ type: `${type}_SUCCESS`, payload: response, meta }),
            put({ type: FETCH_END }),
        ];
    }

    return function *watchCrudFetch() {
        yield* takeLatest(action => action.meta && action.meta.fetch, handleFetch);
    };
};


export default crudFetch;
