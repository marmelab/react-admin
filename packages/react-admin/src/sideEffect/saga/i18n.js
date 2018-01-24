import { all, call, put, takeLatest } from 'redux-saga/effects';
import {
    CHANGE_LOCALE,
    changeLocaleSuccess,
    changeLocaleFailure,
} from '../../actions';

export default i18nProvider => {
    function* loadMessages(action) {
        try {
            const { locale, messages } = yield call(
                i18nProvider,
                action.payload
            );
            yield put(changeLocaleSuccess(locale, messages));
        } catch (err) {
            yield put(changeLocaleFailure(action.payload.locale, err));
        }
    }
    return function*() {
        yield all([takeLatest(CHANGE_LOCALE, loadMessages)]);
    };
};
