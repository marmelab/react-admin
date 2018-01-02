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
        yield call(resolve, {
            response: winner.success.payload,
            request: winner.success.requestPayload,
        });
    } else {
        yield call(reject, {
            error: winner.fail.error,
            request: winner.fail.requestPayload,
        });
    }
}

export default function* formActionSaga() {
    yield takeEvery(PROMISE, handlePromiseSaga);
}
