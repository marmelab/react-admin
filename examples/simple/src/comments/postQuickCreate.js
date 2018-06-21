import { put, race, take, takeLatest } from 'redux-saga/effects';
import { CRUD_CREATE_SUCCESS, REDUX_FORM_NAME } from 'react-admin';
import { change } from 'redux-form';

export const SHOW_POST_QUICK_CREATE = 'SHOW_POST_QUICK_CREATE';
export const HIDE_POST_QUICK_CREATE = 'HIDE_POST_QUICK_CREATE';
export const POST_QUICK_CREATE_SUCCESS = 'POST_QUICK_CREATE_SUCCESS';

export const showPostQuickCreate = () => ({
    type: SHOW_POST_QUICK_CREATE,
});

export const hidePostQuickCreate = () => ({
    type: HIDE_POST_QUICK_CREATE,
});

export const postQuickCreateSuccess = () => ({
    type: POST_QUICK_CREATE_SUCCESS,
});

export const postQuickCreateReducer = (
    state = { showDialog: false },
    { type }
) => {
    if (type === SHOW_POST_QUICK_CREATE) {
        return { ...state, showDialog: true };
    }

    if (type === HIDE_POST_QUICK_CREATE) {
        return { ...state, showDialog: false };
    }

    if (type === POST_QUICK_CREATE_SUCCESS) {
        return { ...state, showDialog: false };
    }

    return state;
};

function* handlePostQuickCreateSaga() {
    const { successfull } = yield race({
        cancelled: take(HIDE_POST_QUICK_CREATE),
        successfull: take(CRUD_CREATE_SUCCESS),
    });

    if (successfull) {
        yield put(postQuickCreateSuccess());
        yield put(
            change(REDUX_FORM_NAME, 'post_id', successfull.payload.data.id)
        );
    }
}

export function* postQuickCreateSaga() {
    yield takeLatest(SHOW_POST_QUICK_CREATE, handlePostQuickCreateSaga);
}
