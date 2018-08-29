import { delay } from 'redux-saga';
import { call, cancel, fork, put, takeEvery } from 'redux-saga/effects';

/**
 * Example
 *
 * let accumulations = {
 *   posts: { 4: true, 7: true, 345: true },
 *   authors: { 23: true, 47: true, 78: true },
 * }
 */
let accumulations = {};

const addIds = (accumulations, { payload: { ids } }) => {
    // Using a Set ensure we only keep distinct values
    const accumulatedValue = new Set(accumulations) || new Set();
    ids.forEach(id => accumulatedValue.add(id));
    return Array.from(accumulatedValue);
};

const getAccumuledValue = key => {
    const accumulatedValue = accumulations[key];
    delete accumulations[key];
    return accumulatedValue;
};

const tasks = {};

/**
 * Fetch the accumulated value after a delay
 *
 * As this gets canceled by subsequent calls to accumulate(), only the last
 * call to finalize() will not be canceled. The delay acts as a
 * debounce.
 *
 * @see https://redux-saga.js.org/docs/recipes/#debouncing
 */
export function* finalize(key, actionCreator) {
    // combined with cancel(), this debounces the calls
    yield call(delay, 50);

    // Get the latest accumulated value for the provided key
    const accumulatedValue = getAccumuledValue(key);

    // For backward compatibility, we passes the key (which may be a resource name) as the first parameter
    const action = actionCreator(key, accumulatedValue);

    yield put(action);
    delete tasks[key];
}

/**
 * Cancel call to finalize, accumulate values, and call finalize
 *
 * @example
 * accumulate({ type: CRUD_GET_MANY_ACCUMULATE, payload: { ids: [1, 3, 5], resource: 'posts' } })
 */
export function* accumulate(action) {
    // For backward compatibility, if no accumulateKey is provided, we fallback to the resource
    const key = action.meta.accumulateKey || action.payload.resource;

    if (tasks[key]) {
        yield cancel(tasks[key]);
    }

    // For backward compatibility, if no accumulateValues function is provided, we fallback to the old
    // addIds function (used by the crudGetManyAccumulate action for example)
    const accumulatedValues = action.meta.accumulateValues || addIds;

    // accumulateValues is a reducer function, it receives the previous accumulatedValues for
    // the provided key and must returned the updated accumulatedValues
    accumulations[key] = accumulatedValues(accumulations[key], action);

    tasks[key] = yield fork(finalize, key, action.meta.accumulate);
}

export default function*() {
    yield takeEvery(
        action => action.meta && action.meta.accumulate,
        accumulate
    );
}
