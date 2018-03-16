import { all, put, takeEvery } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { showNotification } from 'react-admin';
import {
    REVIEW_APPROVE_SUCCESS,
    REVIEW_APPROVE_FAILURE,
    REVIEW_REJECT_SUCCESS,
    REVIEW_REJECT_FAILURE,
} from './reviewActions';

export default function* reviewSaga() {
    yield all([
        takeEvery(REVIEW_APPROVE_SUCCESS, function*() {
            yield put(
                showNotification(
                    'resources.Review.notification.approved_success'
                )
            );
            yield put(push('/Review'));
        }),
        takeEvery(REVIEW_APPROVE_FAILURE, function*({ error }) {
            yield put(
                showNotification(
                    'resources.Review.notification.approved_error',
                    'warning'
                )
            );
            console.error(error);
        }),
        takeEvery(REVIEW_REJECT_SUCCESS, function*() {
            yield put(
                showNotification(
                    'resources.Review.notification.rejected_success'
                )
            );
            yield put(push('/Review'));
        }),
        takeEvery(REVIEW_REJECT_FAILURE, function*({ error }) {
            yield put(
                showNotification(
                    'resources.Review.notification.rejected_error',
                    'warning'
                )
            );
            console.error(error);
        }),
    ]);
}
