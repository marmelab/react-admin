import { all, call, put, takeLatest } from 'redux-saga/effects';
import {
    CHANGE_LOCALE,
    changeLocaleSuccess,
    changeLocaleFailure,
} from '../actions';

export type I18nProvider = (locale: string) => object | Promise<object>;

/**
 * The i18n side effect reacts to the CHANGE_LOCALE actions, calls
 * the i18nProvider (which may be asynchronous) with the requested locale,
 * and dispatches changeLocaleSuccess or changeLocaleFailure with the result.
 */
export default (i18nProvider: I18nProvider) => {
    function* loadMessages(action) {
        const locale = action.payload;

        try {
            const messages = yield call(i18nProvider, locale);
            yield put(changeLocaleSuccess(locale, messages));
        } catch (err) {
            yield put(changeLocaleFailure(action.payload.locale, err));
        }
    }
    return function*() {
        yield all([takeLatest(CHANGE_LOCALE, loadMessages)]);
    };
};
