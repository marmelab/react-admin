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
import withProps from './mui/layout/withProps';
import formatBasePath from './util/formatBasePath';

const Admin = ({ restClient, dashboard, children, title = 'Admin on REST', history, basePath, appLayout = withProps({title, basePath: formatBasePath(basePath)})(Layout) }) => {
    const resources = React.Children.map(children, ({ props }) => props);
    const firstResource = resources[0].name;
    const sagaMiddleware = createSagaMiddleware();
    const reducer = combineReducers({
        admin: adminReducer(resources),
        routing: routerReducer,
    });
    const initialHistory = history || hashHistory;
    const finalBasePath = formatBasePath(basePath);
    const store = createStore(reducer, undefined, compose(
        applyMiddleware(routerMiddleware(initialHistory), sagaMiddleware),
        window.devToolsExtension ? window.devToolsExtension() : f => f,
    ));
    sagaMiddleware.run(crudSaga(restClient));

    const finalHistory = syncHistoryWithStore(initialHistory, store);

    return (
        <Provider store={store}>
            <Router history={finalHistory}>
                {dashboard ? undefined : <Redirect from={`/${finalBasePath}`} to={finalBasePath?`/${finalBasePath}/${firstResource}`:`/${firstResource}`} />}
                <Route path={`/${finalBasePath}`} component={appLayout} resources={resources}>
                    {dashboard && <IndexRoute component={dashboard} restClient={restClient} />}
                    {resources.map(resource =>
                        <CrudRoute key={resource.name} name={resource.name} path={finalBasePath?`/${finalBasePath}/${resource.name}`:resource.name} list={resource.list} edit={resource.edit} create={resource.create} remove={resource.remove} options={resource.options} />
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
    history: PropTypes.object,
    basePath: PropTypes.string
};

export default Admin;
