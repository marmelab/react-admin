import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';

import CrudRoute from './CrudRoute';
import NotFound from './mui/layout/NotFound';
import Restricted from './auth/Restricted';

const AdminRoutes = ({ children, customRoutes, dashboard, catchAll }) =>
    <Switch>
        {customRoutes &&
            customRoutes.map((route, index) =>
                <Route
                    key={index}
                    exact={route.props.exact}
                    path={route.props.path}
                    component={route.props.component}
                    render={route.props.render}
                    children={route.props.children} // eslint-disable-line react/no-children-prop
                />
            )}
        {dashboard
            ? <Route
                  exact
                  path="/"
                  render={routeProps =>
                      <Restricted
                          authParams={{ route: 'dashboard' }}
                          {...routeProps}
                      >
                          {React.createElement(dashboard)}
                      </Restricted>}
              />
            : children[0] &&
              <Route
                  exact
                  path="/"
                  render={() => <Redirect to={`/${children[0].props.name}`} />}
              />}
        {children}
        <Route component={catchAll || NotFound} />
    </Switch>;

const componentPropType = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
]);

AdminRoutes.propTypes = {
    catchAll: componentPropType,
    children: PropTypes.node.isRequired,
    customRoutes: PropTypes.array,
    dashboard: componentPropType,
};

export default AdminRoutes;
