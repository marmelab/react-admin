import { all, call, put, takeLatest } from 'redux-saga/effects';
import {
    CHANGE_LOCALE,
    changeLocaleSuccess,
    changeLocaleFailure,
} from '../actions';

export default i18nProvider => {
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
