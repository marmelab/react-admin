import { createStore, compose, applyMiddleware } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import { History } from 'history';

import { AuthProvider, DataProvider, I18nProvider } from './types';
import createAppReducer from './reducer';
import { adminSaga } from './sideEffect';
import { defaultI18nProvider } from './i18n';
import { CLEAR_STATE } from './actions/clearActions';

interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: (traceOptions: object) => Function;
}

export type InitialState = object | (() => object);

interface Params {
    dataProvider: DataProvider;
    history: History;
    authProvider?: AuthProvider;
    customReducers?: any;
    customSagas?: any[];
    i18nProvider?: I18nProvider;
    initialState?: InitialState;
    locale?: string;
    devToolsTrace?: boolean;
}

export default ({
    dataProvider,
    history,
    customReducers = {},
    authProvider = null,
    customSagas = [],
    i18nProvider = defaultI18nProvider,
    initialState,
    locale = 'en',
    devToolsTrace = false,
}: Params) => {
    const messages = i18nProvider(locale);
    const appReducer = createAppReducer(
        customReducers,
        locale,
        messages,
        history
    );

    const resettableAppReducer = (state, action) =>
        appReducer(
            action.type !== CLEAR_STATE
                ? state
                : typeof initialState === 'function'
                ? initialState()
                : initialState,
            action
        );
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
    
    const composeEnhancers = typeof typedWindow !== 'undefined' &&
      typedWindow.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
      typedWindow.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          trace: devToolsTrace,
          traceLimit: 25
      }) || compose;

    const store = createStore(
        resettableAppReducer,
        typeof initialState === 'function' ? initialState() : initialState,
        composeEnhancers(
            applyMiddleware(sagaMiddleware, routerMiddleware(history))
        )
    );
    sagaMiddleware.run(saga);
    return store;
};
