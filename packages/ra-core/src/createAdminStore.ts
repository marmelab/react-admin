import { createStore, compose, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

import { USER_LOGOUT } from './actions/authActions';
import createAppReducer from './reducer';
import { adminSaga } from './sideEffect';
import { defaultI18nProvider } from './i18n';
import formMiddleware from './form/formMiddleware';

interface Window {
    devToolsExtension?: () => () => void;
}

export default ({
    authProvider,
    customReducers = {},
    customSagas = [],
    dataProvider,
    i18nProvider = defaultI18nProvider,
    history,
    initialState,
    locale = 'en',
}) => {
    const messages = i18nProvider(locale);
    const appReducer = createAppReducer(customReducers, locale, messages);

    const resettableAppReducer = (state, action) =>
        appReducer(action.type !== USER_LOGOUT ? state : undefined, action);
    const saga = function* rootSaga() {
        yield all(
            [
                adminSaga(dataProvider, authProvider, i18nProvider),
                ...customSagas,
            ].map(fork)
        );
    };
    const sagaMiddleware = createSagaMiddleware();
    const typedWindow = window as Window;

    const store = createStore(
        resettableAppReducer,
        initialState,
        compose(
            applyMiddleware(
                sagaMiddleware,
                formMiddleware,
                routerMiddleware(history)
            ),
            typeof typedWindow !== 'undefined' && typedWindow.devToolsExtension
                ? typedWindow.devToolsExtension()
                : f => f
        )
    );
    sagaMiddleware.run(saga);
    return store;
};
