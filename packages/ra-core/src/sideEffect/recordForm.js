import { put, takeEvery } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { resetForm } from '../actions/formActions';

export const handleLocationChangeFactory = (
    initialLocationPathname = undefined
) => {
    let lastLocationPathname = initialLocationPathname;

    function* handleLocationChange({ payload: { pathname } }) {
        // We don't want to reset the form when switching tabs in TabbedForm
        // so we store the current location. If it was the first location change,
        // we have nothing left to do
        if (!lastLocationPathname) {
            lastLocationPathname = pathname;
            return;
        }

        // We check wether we are changing from a tab path to the form root path
        // or vice-versa
        if (
            !lastLocationPathname.startsWith(pathname) &&
            !pathname.startsWith(lastLocationPathname)
        ) {
            lastLocationPathname = pathname;
            yield put(resetForm());
        }
    }

    return handleLocationChange;
};

const handleLocationChange = handleLocationChangeFactory();
export default function* recordForm() {
    yield takeEvery(LOCATION_CHANGE, handleLocationChange);
}
