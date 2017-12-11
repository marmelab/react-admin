import { all, call, put, takeLatest } from 'redux-saga/effects';
import {
    CHANGE_LOCALE,
    changeLocaleSuccess,
    changeLocaleFailure,
} from '../../actions';
import { GET_LOCALE_MESSAGES } from '../../i18n/i18nActions';

export default messagesProvider => {
    function* loadMessages(action) {
        const locale = action.payload;
        try {
            const messages = yield call(
                messagesProvider,
                GET_LOCALE_MESSAGES,
                locale
            );
            yield put(changeLocaleSuccess(locale, messages));
        } catch (err) {
            yield put(changeLocaleFailure(locale, err));
        }
    }
    return function*() {
        yield all([takeLatest(CHANGE_LOCALE, loadMessages)]);
    };
};
