import { call, take, takeEvery, put, all } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';
import warning from 'warning';

import {
    FETCH_CANCEL,
    FETCH_END,
    FETCH_ERROR_VALIDATION,
} from '../../actions/fetchActions';
import { FORM_SUBMIT } from '../../actions/formActions';
import {
    FETCH_ERROR_UNHANDLED,
    FETCH_ERROR_HANDLED,
    CRUD_CREATE_LOADING,
    CRUD_UPDATE_LOADING,
} from '../../actions';

const submits = {};
function* handleFormSubmit({ payload: { resolve, reject } }) {
    const action = yield take([CRUD_CREATE_LOADING, CRUD_UPDATE_LOADING]);
    submits[action] = { resolve, reject };
}

function* handleFetchErrorValidation({ type, error, meta: { id } }) {
    const formSubmit = submits[id];
    if (formSubmit) {
        const { resolve, reject } = formSubmit;
        switch (type) {
            case FETCH_CANCEL:
            case FETCH_ERROR_VALIDATION:
                try {
                    yield call(reject, error);
                } catch (err) {
                    warning('Error handling reject of form promise', err);
                }
                if (error instanceof SubmissionError) {
                    yield put({
                        type: FETCH_ERROR_HANDLED,
                        meta: { id },
                    });
                } else {
                    yield put({
                        type: FETCH_ERROR_UNHANDLED,
                        meta: { id },
                    });
                }
                break;
            default:
                try {
                    yield call(resolve);
                } catch (err) {
                    warning('Error handling resolve of form promise', err);
                }
                yield put({
                    type: FETCH_ERROR_UNHANDLED,
                    meta: { id },
                });
        }
    } else {
        yield put({
            type: FETCH_ERROR_UNHANDLED,
            meta: { id },
        });
    }
}

export default function* watchFormSubmission() {
    yield all([
        takeEvery(FORM_SUBMIT, handleFormSubmit),
        takeEvery(
            [FETCH_END, FETCH_ERROR_VALIDATION, FETCH_CANCEL],
            handleFetchErrorValidation
        ),
    ]);
}
