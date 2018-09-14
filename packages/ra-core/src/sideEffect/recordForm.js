import { put, takeEvery } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { destroy } from 'redux-form';
import isEqual from 'lodash/isEqual';

import { resetForm } from '../actions/formActions';
import { REDUX_FORM_NAME } from '../form/constants';

let previousLocation;

export function* handleLocationChange({ payload }) {
    if (payload.state && payload.state.skipFormReset) {
        return;
    }

    if (isEqual(payload, previousLocation)) {
        return;
    }

    previousLocation = payload;

    yield put(resetForm());
    yield put(destroy(REDUX_FORM_NAME));
}

export default function* recordForm() {
    yield takeEvery(LOCATION_CHANGE, handleLocationChange);
}
