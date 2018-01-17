import React from 'react';
import PropTypes from 'prop-types';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createHashHistory';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import withContext from 'recompose/withContext';

import { USER_LOGOUT } from './actions/authActions';

import createAppReducer from './reducer';
import { crudSaga } from './sideEffect/saga';
import TranslationProvider from './i18n/TranslationProvider';

const identity = a => a;

const AdminConfig = ({
    authClient,
    children,
    customReducers = {},
    customSagas = [],
    customMiddleware = identity,
    history,
    locale,
    messages = {},
    dataProvider,
    initialState,
}) => {
    const appReducer = createAppReducer(customReducers, locale);
    const resettableAppReducer = (state, action) =>
        appReducer(action.type !== USER_LOGOUT ? state : undefined, action);
    const saga = function* rootSaga() {
        yield all(
            [crudSaga(dataProvider, authClient), ...customSagas].map(fork)
        );
    };
    const sagaMiddleware = createSagaMiddleware();
    const routerHistory = history || createHistory();
    const store = createStore(
        resettableAppReducer,
        initialState,
        compose(
            applyMiddleware(
                customMiddleware(
                    sagaMiddleware,
                    routerMiddleware(routerHistory)
                )
            ),
            typeof window !== 'undefined' && window.devToolsExtension
                ? window.devToolsExtension()
                : f => f
        )
    );
    sagaMiddleware.run(saga);

    return (
        <Provider store={store}>
            <TranslationProvider messages={messages}>
                <ConnectedRouter history={routerHistory}>
                    {children}
                </ConnectedRouter>
            </TranslationProvider>
        </Provider>
    );
};

AdminConfig.propTypes = {
    authClient: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    customSagas: PropTypes.array,
    customReducers: PropTypes.object,
    customMiddleware: PropTypes.func,
    history: PropTypes.object.isRequired,
    dataProvider: PropTypes.func.isRequired,
    locale: PropTypes.string,
    messages: PropTypes.object,
    initialState: PropTypes.object,
};

export default withContext(
    {
        authClient: PropTypes.func,
    },
    ({ authClient }) => ({ authClient })
)(AdminConfig);
