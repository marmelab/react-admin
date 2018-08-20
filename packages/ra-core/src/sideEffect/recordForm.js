import { put, takeEvery } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { destroy } from 'redux-form';
import { resetForm } from '../actions/formActions';
import { REDUX_FORM_NAME } from '../form/constants';

export function* handleLocationChange({ payload: { state } }) {
    if (state && state.skipFormReset) {
        return;
    }

    yield put(destroy(REDUX_FORM_NAME));
    yield put(resetForm());
}

export default function* recordForm() {
    yield takeEvery(LOCATION_CHANGE, handleLocationChange);
}
