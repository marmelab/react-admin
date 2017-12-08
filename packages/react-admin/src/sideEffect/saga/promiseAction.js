import { take, takeEvery, race, put, call, all } from 'redux-saga/effects';
import { PROMISE } from '../../util/promisingActionCreator';
function* handlePromiseSaga({ payload }) {
    const { request, defer, types } = payload;
    const { resolve, reject } = defer;
    const [SUCCESS, FAIL] = types;

    const [winner] = yield all([
        race({
            success: take(SUCCESS),
            fail: take(FAIL),
        }),
        put(request),
    ]);

    if (winner.success) {
        yield call(
            resolve,
            winner.success && winner.success.payload
                ? winner.success.payload
                : winner.success
        );
    } else {
        yield call(
            reject,
            winner.fail && winner.fail.payload
                ? winner.fail.payload
                : winner.fail
        );
    }
}

export default function* formActionSaga() {
    yield takeEvery(PROMISE, handlePromiseSaga);
}
