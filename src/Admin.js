import React, { PropTypes } from 'react';
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, IndexRoute, Route, Redirect, hashHistory } from 'react-router';
import { syncHistoryWithStore, routerMiddleware, routerReducer } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';

import adminReducer from './reducer';
import crudSaga from './sideEffect/saga';
import CrudRoute from './CrudRoute';
import Layout from './mui/layout/Layout';
import withAppTitle from './mui/layout/withAppTitle';

const Admin = ({ restClient, dashboard, children, title = 'Admin on REST', appLayout = withAppTitle(title)(Layout) }) => {
    const resources = React.Children.map(children, ({ props }) => props);
    const firstResource = resources[0].name;
    const reducer = combineReducers({
        admin: adminReducer(resources),
        routing: routerReducer,
    });
    
    if (typeof window != "undefined") {
        const sagaMiddleware = createSagaMiddleware();
        const store = createStore(reducer, undefined, compose(
            applyMiddleware(routerMiddleware(hashHistory), sagaMiddleware),
            window.devToolsExtension ? window.devToolsExtension() : f => f,
        ));
        sagaMiddleware.run(crudSaga(restClient));
    }
    else {
        const store = createStore(reducer);
    }
    

    const history = syncHistoryWithStore(hashHistory, store);

    return (
        <Provider store={store}>
            <Router history={history}>
                {dashboard ? undefined : <Redirect from="/" to={`/${firstResource}`} />}
                <Route path="/" component={appLayout} resources={resources}>
                    {dashboard && <IndexRoute component={dashboard} restClient={restClient} />}
                    {resources.map(resource =>
                        <CrudRoute key={resource.name} path={resource.name} list={resource.list} edit={resource.edit} create={resource.create} remove={resource.remove} options={resource.options} />
                    )}
                </Route>
            </Router>
        </Provider>
    );
};

const componentPropType = PropTypes.oneOfType([PropTypes.func, PropTypes.string]);

Admin.propTypes = {
    restClient: PropTypes.func.isRequired,
    appLayout: componentPropType,
    dashboard: componentPropType,
    children: PropTypes.node,
    title: PropTypes.string,
};

export default Admin;
