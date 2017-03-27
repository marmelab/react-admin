import React, { PropTypes } from 'react';
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createHashHistory';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import createSagaMiddleware from 'redux-saga';
import { fork } from 'redux-saga/effects';
import withProps from 'recompose/withProps';

import adminReducer from './reducer';
import localeReducer from './reducer/locale';
import { crudSaga } from './sideEffect/saga';
import CrudRoute from './CrudRoute';
import DefaultLayout from './mui/layout/Layout';
import Menu from './mui/layout/Menu';
import Login from './mui/auth/Login';
import Logout from './mui/auth/Logout';
import TranslationProvider from './i18n/TranslationProvider';
import { AUTH_CHECK } from './auth';

const Admin = ({
    appLayout,
    authClient,
    children,
    customReducers = {},
    customSagas = [],
    customRoutes,
    dashboard,
    locale,
    messages = {},
    menu,
    restClient,
    theme,
    title = 'Admin on REST',
    loginPage,
    logoutButton,
    initialState,
}) => {
    const resources = React.Children.map(children, ({ props }) => props);
    const reducer = combineReducers({
        admin: adminReducer(resources),
        locale: localeReducer(locale),
        form: formReducer,
        routing: routerReducer,
        ...customReducers,
    });
    const saga = function* rootSaga() {
        yield [
            crudSaga(restClient),
            ...customSagas,
        ].map(fork);
    };
    const sagaMiddleware = createSagaMiddleware();
    const history = createHistory();
    const store = createStore(reducer, initialState, compose(
        applyMiddleware(sagaMiddleware, routerMiddleware(history)),
        window.devToolsExtension ? window.devToolsExtension() : f => f,
    ));
    sagaMiddleware.run(saga);

    const onEnter = authClient ?
        params => (nextState, replace, callback) => authClient(AUTH_CHECK, params)
            .then(() => params && params.scrollToTop ? window.scrollTo(0, 0) : null)
            .catch(e => {
                replace({
                    pathname: (e && e.redirectTo) || '/login',
                    state: { nextPathname: nextState.location.pathname },
                })
            })
            .then(callback)
        :
        params => () => params && params.scrollToTop ? window.scrollTo(0, 0) : null;
    const LoginPage = withProps({ title, theme, authClient })(loginPage || Login);
    const LogoutButton = withProps({ authClient })(logoutButton || Logout);
    const MenuComponent = withProps({ authClient, logout: <LogoutButton />, resources, hasDashboard: !!dashboard })(menu || Menu);
    const Layout = withProps({
        authClient,
        dashboard,
        customRoutes,
        logout: <LogoutButton />,
        menu: <MenuComponent />,
        onEnter,
        resources,
        title,
        theme,
    })(appLayout || DefaultLayout);

    return (
        <Provider store={store}>
            <TranslationProvider messages={messages}>
                <ConnectedRouter history={history}>
                    <div>
                        <Switch>
                            <Route exact path="/login" component={LoginPage} />
                            <Route path="/" component={Layout} />
                        </Switch>
                    </div>
                </ConnectedRouter>
            </TranslationProvider>
        </Provider>
    );
};

const componentPropType = PropTypes.oneOfType([PropTypes.func, PropTypes.string]);

Admin.propTypes = {
    appLayout: componentPropType,
    authClient: PropTypes.func,
    children: PropTypes.node,
    customSagas: PropTypes.array,
    customReducers: PropTypes.object,
    customRoutes: PropTypes.func,
    dashboard: componentPropType,
    loginPage: componentPropType,
    logoutButton: componentPropType,
    menu: componentPropType,
    restClient: PropTypes.func,
    theme: PropTypes.object,
    title: PropTypes.string,
    locale: PropTypes.string,
    messages: PropTypes.object,
    initialState: PropTypes.object,
};

export default Admin;
