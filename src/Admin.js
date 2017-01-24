import React, { PropTypes } from 'react';
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, IndexRoute, Route, Redirect, hashHistory } from 'react-router';
import { syncHistoryWithStore, routerMiddleware, routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import createSagaMiddleware from 'redux-saga';
import { fork } from 'redux-saga/effects';

import adminReducer from './reducer';
import { crudSaga } from './sideEffect/saga';
import CrudRoute from './CrudRoute';
import Layout from './mui/layout/Layout';
import SignIn from './mui/auth/SignIn';
import withProps from 'recompose/withProps';
import TranslationProvider from './i18n/TranslationProvider';
import { DEFAULT_LOCALE, TranslationReducer as translationReducer } from './i18n';

const Admin = ({
    children,
    customReducers = {},
    customSagas = [],
    dashboard,
    restClient,
    signInClient,
    checkCredentials,
    theme,
    title = 'Admin on REST',
    appLayout = withProps({ title, theme })(Layout),
    SignInPage = withProps({ title, theme, signInClient })(SignIn),
    locale = DEFAULT_LOCALE,
    messages = {},
}) => {
    const resources = React.Children.map(children, ({ props }) => props);
    const reducer = combineReducers({
        admin: adminReducer(resources),
        form: formReducer,
        routing: routerReducer,
        locale: translationReducer(locale),
        ...customReducers,
    });
    const saga = function* rootSaga() {
        yield [
            crudSaga(restClient),
            ...customSagas,
        ].map(fork);
    };
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(reducer, undefined, compose(
        applyMiddleware(routerMiddleware(hashHistory), sagaMiddleware),
        window.devToolsExtension ? window.devToolsExtension() : f => f,
    ));
    sagaMiddleware.run(saga);

    const history = syncHistoryWithStore(hashHistory, store);
    const firstResource = resources[0].name;

    return (
        <Provider store={store}>
            <TranslationProvider messages={messages}>
                <Router history={history}>
                    {dashboard ? undefined : <Redirect from="/" to={`/${firstResource}`} />}
                    <Route path="/sign-in" component={SignInPage} />
                    <Route path="/" component={appLayout} resources={resources}>
                        {dashboard && <IndexRoute component={dashboard} onEnter={checkCredentials} />}
                        {resources.map(resource =>
                            <CrudRoute
                                key={resource.name}
                                path={resource.name}
                                list={resource.list}
                                create={resource.create}
                                edit={resource.edit}
                                show={resource.show}
                                remove={resource.remove}
                                options={resource.options}
                                checkCredentials={resource.checkCredentials || checkCredentials}
                            />
                        )}
                    </Route>
                </Router>
            </TranslationProvider>
        </Provider>
    );
};

const componentPropType = PropTypes.oneOfType([PropTypes.func, PropTypes.string]);

Admin.propTypes = {
    appLayout: componentPropType,
    checkCredentials: PropTypes.func,
    children: PropTypes.node,
    customSagas: PropTypes.array,
    customReducers: PropTypes.object,
    dashboard: componentPropType,
    restClient: PropTypes.func,
    signInClient: PropTypes.func,
    theme: PropTypes.object,
    title: PropTypes.string,
    locale: PropTypes.string,
    messages: PropTypes.object,
};

Admin.defaultProps = {
    signInClient: () => Promise.resolve(),
    checkCredentials: () => true,
};

export default Admin;
