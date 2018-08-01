import { put, takeEvery } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { resetForm } from '../actions/formActions';

export function* handleLocationChange({ payload: { state } }) {
    if (state && state.skipFormReset) {
        return;
    }

    yield put(resetForm());
}

export default function* recordForm() {
    yield takeEvery(LOCATION_CHANGE, handleLocationChange);
}
