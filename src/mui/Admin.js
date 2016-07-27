import React, { PropTypes } from 'react';
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, Redirect, hashHistory } from 'react-router';
import { syncHistoryWithStore, routerMiddleware, routerReducer } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';

import { adminReducer, crudSaga, CrudRoute } from 'admin-on-rest';
import { Layout } from 'admin-on-rest/mui';

const Admin = ({ resources, restFlavor, appLayout = Layout }) => {

    const sagaMiddleware = createSagaMiddleware();
    const reducer = combineReducers({
        admin: adminReducer(Object.keys(resources)),
        routing: routerReducer,
    });
    const store = createStore(reducer, undefined, compose(
        applyMiddleware(routerMiddleware(hashHistory), sagaMiddleware),
        window.devToolsExtension ? window.devToolsExtension() : f => f,
    ));
    sagaMiddleware.run(crudSaga(restFlavor));

    const history = syncHistoryWithStore(hashHistory, store);
    const firstResource = Object.keys(resources).shift();

    return (
        <Provider store={store}>
            <Router history={history}>
                <Redirect from="/" to={`/${firstResource}`} />
                <Route path="/" component={appLayout}>
                    {Object.keys(resources).map(name =>
                        <CrudRoute path={name} list={resources[name].list} edit={resources[name].edit} create={resources[name].create} />
                    )}
                </Route>
            </Router>
        </Provider>
    );
};

Admin.PropTypes = {
    resources: PropTypes.object.isRequired,
    restFlavor: PropTypes.func.isRequired,
    appLayout: PropTypes.element,
};

export default Admin;
