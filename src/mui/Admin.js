import React, { PropTypes } from 'react';
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, Redirect, hashHistory } from 'react-router';
import { syncHistoryWithStore, routerMiddleware, routerReducer } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';

import { adminReducer, crudSaga, CrudRoute } from 'admin-on-rest';
import { Layout } from 'admin-on-rest/mui';

const Admin = ({ restFlavor, appLayout = Layout, children }) => {
    const resources = React.Children.map(children, ({ props }) => (
        { name: props.name, list: props.list, edit: props.edit, create: props.create }
    ));
    const resourceNames = React.Children.map(children, ({ props }) => props.name);
    const sagaMiddleware = createSagaMiddleware();
    const reducer = combineReducers({
        admin: adminReducer(resourceNames),
        routing: routerReducer,
    });
    const store = createStore(reducer, undefined, compose(
        applyMiddleware(routerMiddleware(hashHistory), sagaMiddleware),
        window.devToolsExtension ? window.devToolsExtension() : f => f,
    ));
    sagaMiddleware.run(crudSaga(restFlavor));

    const history = syncHistoryWithStore(hashHistory, store);
    const firstResource = resourceNames[0];

    return (
        <Provider store={store}>
            <Router history={history}>
                <Redirect from="/" to={`/${firstResource}`} />
                <Route path="/" component={appLayout}>
                    {resources.map(resource =>
                        <CrudRoute key={resource.name} path={resource.name} list={resource.list} edit={resource.edit} create={resource.create} />
                    )}
                </Route>
            </Router>
        </Provider>
    );
};

Admin.propTypes = {
    restFlavor: PropTypes.func.isRequired,
    appLayout: PropTypes.element,
    children: PropTypes.node,
};

export default Admin;
