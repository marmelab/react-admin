import { put, takeEvery } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { resetForm } from '../actions/formActions';

let lastLocationPathName = undefined;

export function* handleLocationChange({ payload: { pathname } }) {
    if (!lastLocationPathName) {
        lastLocationPathName = pathname;
        return;
    }

    if (
        !lastLocationPathName.startsWith(pathname) &&
        !pathname.startsWith(lastLocationPathName)
    ) {
        yield put(resetForm());
    }
}

export default function* recordForm() {
    yield takeEvery(LOCATION_CHANGE, handleLocationChange);
}
