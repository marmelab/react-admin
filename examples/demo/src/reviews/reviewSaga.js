import { all, put, takeEvery } from 'redux-saga/effects';
import { showNotification } from 'react-admin';
import { REVIEW_APPROVE_FAILURE, REVIEW_REJECT_FAILURE } from './reviewActions';

export default function* reviewSaga() {
    yield all([
        takeEvery(REVIEW_APPROVE_FAILURE, function*({ error }) {
            yield put(
                showNotification(
                    'resources.reviews.notification.approved_error',
                    'warning'
                )
            );
            console.error(error);
        }),
        takeEvery(REVIEW_REJECT_FAILURE, function*({ error }) {
            yield put(
                showNotification(
                    'resources.reviews.notification.rejected_error',
                    'warning'
                )
            );
            console.error(error);
        }),
    ]);
}
