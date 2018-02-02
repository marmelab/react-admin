import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createHashHistory';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import withContext from 'recompose/withContext';
import { Route, Switch } from 'react-router-dom';

import { USER_LOGOUT } from './actions/authActions';
import Login from './mui/auth/Login';
import createAppReducer from './reducer';
import { crudSaga } from './sideEffect/saga';
import Menu from './mui/layout/Menu';
import Logout from './mui/auth/Logout';
import TranslationProvider from './i18n/TranslationProvider';
import AdminRoutes from './AdminRoutes';

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
    messages = {},
    menu = Menu,
    catchAll,
    restClient,
    theme,
    title = 'Admin on REST',
    loginPage,
    logoutButton,
    initialState,
}) => {
    const appReducer = createAppReducer(customReducers, locale);
    const resettableAppReducer = (state, action) =>
        appReducer(action.type !== USER_LOGOUT ? state : undefined, action);
    const saga = function* rootSaga() {
        yield all([crudSaga(restClient, authClient), ...customSagas].map(fork));
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
            <TranslationProvider messages={messages}>
                <ConnectedRouter history={routerHistory}>
                    <Switch>
                        {loginPage && (
                            <Route
                                exact
                                path="/login"
                                render={({ location }) =>
                                    createElement(loginPage, {
                                        location,
                                        title,
                                        theme,
                                    })}
                            />
                        )}
                        <Route
                            path="/"
                            render={routeProps => (
                                <AdminRoutes
                                    appLayout={appLayout}
                                    catchAll={catchAll}
                                    customRoutes={customRoutes}
                                    dashboard={dashboard}
                                    logout={logout}
                                    menu={menu}
                                    theme={theme}
                                    title={title}
                                    {...routeProps}
                                >
                                    {children}
                                </AdminRoutes>
                            )}
                        />
                    </Switch>
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
    restClient: PropTypes.func,
    theme: PropTypes.object,
    title: PropTypes.node,
    locale: PropTypes.string,
    messages: PropTypes.object,
    initialState: PropTypes.object,
};

Admin.defaultProps = {
    loginPage: Login,
};

export default withContext(
    {
        authClient: PropTypes.func,
    },
    ({ authClient }) => ({ authClient })
)(Admin);
