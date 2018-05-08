import { all, takeEvery } from 'redux-saga/effects';
import { REVIEW_APPROVE_FAILURE, REVIEW_REJECT_FAILURE } from './reviewActions';

export default function* reviewSaga() {
    yield all([
        takeEvery(REVIEW_APPROVE_FAILURE, function*({ error }) {
            console.error(error);
            yield all([]);
        }),
        takeEvery(REVIEW_REJECT_FAILURE, function*({ error }) {
            console.error(error);
            yield all([]);
        }),
    ]);
}
