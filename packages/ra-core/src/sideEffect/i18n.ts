import { all, call, put, takeLatest } from 'redux-saga/effects';
import { I18nProvider } from '../types';
import {
    CHANGE_LOCALE,
    changeLocaleSuccess,
    changeLocaleFailure,
    fetchStart,
    fetchEnd,
} from '../actions';

/**
 * The i18n side effect reacts to the CHANGE_LOCALE actions, calls
 * the i18nProvider (which may be asynchronous) with the requested locale,
 * and dispatches changeLocaleSuccess or changeLocaleFailure with the result.
 */
export default (i18nProvider: I18nProvider) => {
    function* loadMessages(action) {
        const locale = action.payload;

        yield put(fetchStart());

        try {
            const messages = yield call(i18nProvider, locale);
            yield put(changeLocaleSuccess(locale, messages));
        } catch (err) {
            yield put(changeLocaleFailure(action.payload.locale, err));
        }
        yield put(fetchEnd());
    }
    return function*() {
        yield all([takeLatest(CHANGE_LOCALE, loadMessages)]);
    };
};
