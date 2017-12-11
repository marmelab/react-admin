import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createHashHistory';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import withContext from 'recompose/withContext';

import { USER_LOGOUT } from './actions/authActions';

import createAppReducer from './reducer';
import { crudSaga } from './sideEffect/saga';
import DefaultLayout from './mui/layout/Layout';
import Menu from './mui/layout/Menu';
import Login from './mui/auth/Login';
import Logout from './mui/auth/Logout';
import {
    TranslationProvider,
    defaultMessagesProvider,
    GET_DEFAULT_MESSAGES,
} from './i18n';

const Admin = ({
    appLayout,
    authClient,
    children,
    customReducers = {},
    customSagas = [],
    customRoutes = [],
    dashboard,
    history,
    locale,
    menu = Menu,
    catchAll,
    dataProvider,
    messagesProvider = defaultMessagesProvider,
    theme,
    title = 'React Admin',
    loginPage,
    logoutButton,
    initialState,
}) => {
    const defaultMessages = messagesProvider(GET_DEFAULT_MESSAGES, locale);
    const appReducer = createAppReducer(
        customReducers,
        locale,
        defaultMessages
    );

    const resettableAppReducer = (state, action) =>
        appReducer(action.type !== USER_LOGOUT ? state : undefined, action);
    const saga = function* rootSaga() {
        yield all(
            [
                crudSaga(dataProvider, authClient, messagesProvider),
                ...customSagas,
            ].map(fork)
        );
    };
    const sagaMiddleware = createSagaMiddleware();
    const routerHistory = history || createHistory();
    const store = createStore(
        resettableAppReducer,
        initialState,
        compose(
            applyMiddleware(sagaMiddleware, routerMiddleware(routerHistory)),
            typeof window !== 'undefined' && window.devToolsExtension
                ? window.devToolsExtension()
                : f => f
        )
    );
    sagaMiddleware.run(saga);

    const logout = authClient ? createElement(logoutButton || Logout) : null;

    return (
        <Provider store={store}>
            <TranslationProvider>
                <ConnectedRouter history={routerHistory}>
                    <div>
                        <Switch>
                            <Route
                                exact
                                path="/login"
                                render={props =>
                                    createElement(loginPage || Login, {
                                        ...props,
                                        title,
                                    })}
                            />
                            {customRoutes
                                .filter(route => route.props.noLayout)
                                .map((route, index) => (
                                    <Route
                                        key={index}
                                        exact={route.props.exact}
                                        path={route.props.path}
                                        render={props => {
                                            if (route.props.render) {
                                                return route.props.render({
                                                    ...props,
                                                    title,
                                                });
                                            }
                                            if (route.props.component) {
                                                return createElement(
                                                    route.props.component,
                                                    {
                                                        ...props,
                                                        title,
                                                    }
                                                );
                                            }
                                        }}
                                    />
                                ))}
                            <Route
                                path="/"
                                render={() =>
                                    createElement(appLayout || DefaultLayout, {
                                        children,
                                        dashboard,
                                        customRoutes: customRoutes.filter(
                                            route => !route.props.noLayout
                                        ),
                                        logout,
                                        menu,
                                        catchAll,
                                        theme,
                                        title,
                                    })}
                            />
                        </Switch>
                    </div>
                </ConnectedRouter>
            </TranslationProvider>
        </Provider>
    );
};

const componentPropType = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
]);

Admin.propTypes = {
    appLayout: componentPropType,
    authClient: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    catchAll: componentPropType,
    customSagas: PropTypes.array,
    customReducers: PropTypes.object,
    customRoutes: PropTypes.array,
    dashboard: componentPropType,
    history: PropTypes.object,
    loginPage: componentPropType,
    logoutButton: componentPropType,
    menu: componentPropType,
    dataProvider: PropTypes.func,
    messagesProvider: PropTypes.func,
    theme: PropTypes.object,
    title: PropTypes.node,
    locale: PropTypes.string,
    initialState: PropTypes.object,
};

export default withContext(
    {
        authClient: PropTypes.func,
    },
    ({ authClient }) => ({ authClient })
)(Admin);
