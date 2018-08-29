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

/**
 * Distinct reducer on ids
 *
 * @example
 * addIds([1, 2, 3], { payload: { ids: [3, 4] } })
 *   => [1, 2, 3, 4]
 */
const addIds = (oldIds, { payload: { ids } }) => {
    // Using a Set ensure we only keep distinct values
    const oldIdsSet = new Set(oldIds);
    ids.forEach(id => oldIdsSet.add(id));
    return Array.from(oldIdsSet);
};

const getAccumulatedValue = key => {
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
    const accumulatedValue = getAccumulatedValue(key);

    // For backward compatibility, we pass the key (which may be a resource name) as the first parameter
    const action = actionCreator(key, accumulatedValue);

    yield put(action);
    delete tasks[key];
}

/**
 * Accumulate actions and eventually redispatch an action with the accumulated payload
 *
 * @example
 * accumulate({
 *    type: CRUD_GET_MANY_ACCUMULATE,
 *    payload: { ids: [1, 2, 3], resource: 'posts' },
 *    meta: { accumulate: crudGetMany }
 * });
 * accumulate({
 *    type: CRUD_GET_MANY_ACCUMULATE,
 *    payload: { ids: [4, 5], resource: 'posts' },
 *    meta: { accumulate: crudGetMany }
 * });
 *   => crudGetMany({ ids: [1, 2, 3, 4, 5], resource: 'posts' })
 */
export function* accumulate(action) {
    // For backward compatibility, if no accumulateKey is provided, we fallback to the resource
    const key = action.meta.accumulateKey || action.payload.resource;

    if (tasks[key]) {
        yield cancel(tasks[key]);
    }

    // For backward compatibility, if no accumulateValues function is provided, we fallback to the old
    // addIds function (used by the crudGetManyAccumulate action for example)
    const accumulateValues = action.meta.accumulateValues || addIds;

    // accumulateValues is a reducer function, it receives the previous accumulatedValues for
    // the provided key, and must return the updated accumulatedValues
    accumulations[key] = accumulateValues(accumulations[key], action);

    tasks[key] = yield fork(finalize, key, action.meta.accumulate);
}

export default function*() {
    yield takeEvery(
        action => action.meta && action.meta.accumulate,
        accumulate
    );
}
