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
import withProps from './withProps';
import I18nProvider from './i18n/I18nProvider';
import { loadTranslations, DEFAULT_LOCALE } from './i18n/I18nLoader';

const Admin = ({
    children,
    customReducers = {},
    customSagas = [],
    dashboard,
    restClient,
    theme,
    title = 'Admin on REST',
    appLayout = withProps({ title, theme })(Layout),
    locale = DEFAULT_LOCALE,
    messages = {},
}) => {
    const resources = React.Children.map(children, ({ props }) => props);
    const reducer = combineReducers({
        admin: adminReducer(resources),
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
    const store = createStore(reducer, undefined, compose(
        applyMiddleware(routerMiddleware(hashHistory), sagaMiddleware),
        window.devToolsExtension ? window.devToolsExtension() : f => f,
    ));
    sagaMiddleware.run(saga);

    const history = syncHistoryWithStore(hashHistory, store);
    const firstResource = resources[0].name;

    const customMessages = messages[locale] || messages[DEFAULT_LOCALE] || {};
    const translations = { ...loadTranslations(locale), ...customMessages };

    return (
        <I18nProvider locale={locale} messages={translations}>
            <Provider store={store}>
                <Router history={history}>
                    {dashboard ? undefined : <Redirect from="/" to={`/${firstResource}`} />}
                    <Route path="/" component={appLayout} resources={resources}>
                        {dashboard && <IndexRoute component={dashboard} />}
                        {resources.map(resource =>
                            <CrudRoute key={resource.name} path={resource.name} list={resource.list} create={resource.create} edit={resource.edit} show={resource.show} remove={resource.remove} options={resource.options} />
                        )}
                    </Route>
                </Router>
            </Provider>
        </I18nProvider>
    );
};

const componentPropType = PropTypes.oneOfType([PropTypes.func, PropTypes.string]);

Admin.propTypes = {
    appLayout: componentPropType,
    children: PropTypes.node,
    customSagas: PropTypes.array,
    customReducers: PropTypes.object,
    dashboard: componentPropType,
    restClient: PropTypes.func,
    theme: PropTypes.object,
    title: PropTypes.string,
    locale: PropTypes.string,
    messages: PropTypes.object,
};

export default Admin;
