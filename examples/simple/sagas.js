import { parse } from 'query-string';
import { getLocale, changeLocale } from 'react-admin';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

const localeParam = 'locale';

function* handleChangeLocaleAction({ payload: { search } }) {
    if (search) {
        try {
            const params = yield call(parse, search);
            if (params[localeParam]) {
                const currentLocale = yield select(getLocale);
                if (currentLocale !== params[localeParam]) {
                    yield put(changeLocale(params[localeParam]));
                }
            }
        } catch (err) {
            // Ignore parse errors
        }
    }
}

function* watchQueryParamLocaleChange() {
    yield takeLatest(LOCATION_CHANGE, handleChangeLocaleAction);
}

export default [watchQueryParamLocaleChange];
