import React, { PropTypes } from 'react';
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, IndexRoute, Route, Redirect, hashHistory } from 'react-router';
import { syncHistoryWithStore, routerMiddleware, routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import createSagaMiddleware from 'redux-saga';

import adminReducer from './reducer';
import { crudSaga } from './sideEffect/saga';
import CrudRoute from './CrudRoute';
import Layout from './mui/layout/Layout';
import withProps from './withProps';

const Admin = ({
    children,
    customReducers = {},
    customSagas = [],
    dashboard,
    restClient,
    theme,
    title = 'Admin on REST',
    appLayout = withProps({ title, theme })(Layout),
}) => {
    const resources = React.Children.map(children, ({ props }) => props);
    const firstResource = resources[0].name;
    const sagaMiddleware = createSagaMiddleware();
    const reducer = combineReducers({
        admin: adminReducer(resources),
        form: formReducer,
        routing: routerReducer,
        ...customReducers,
    });
    const store = createStore(reducer, undefined, compose(
        applyMiddleware(routerMiddleware(hashHistory), sagaMiddleware),
        window.devToolsExtension ? window.devToolsExtension() : f => f,
    ));
    sagaMiddleware.run(function* rootSaga() {
        yield [
            crudSaga(restClient)(),
            ...customSagas,
        ];
    });

    const history = syncHistoryWithStore(hashHistory, store);

    return (
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
};

export default Admin;
