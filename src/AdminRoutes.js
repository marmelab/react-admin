import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';

import CrudRoute from './CrudRoute';
import NotFound from './mui/layout/NotFound';
import Restricted from './auth/Restricted';

const AdminRoutes = ({ customRoutes, resources = [], dashboard, notFound }) =>
    <Switch>
        {customRoutes &&
            customRoutes.map((route, index) =>
                <Route
                    key={index}
                    exact={route.props.exact}
                    path={route.props.path}
                    component={route.props.component}
                    render={route.props.render}
                    children={route.props.children}
                />
            )}
        {resources.map(resource =>
            <Route
                path={`/${resource.name}`}
                key={resource.name}
                render={() =>
                    <CrudRoute
                        resource={resource.name}
                        list={resource.list}
                        create={resource.create}
                        edit={resource.edit}
                        show={resource.show}
                        remove={resource.remove}
                        options={resource.options}
                    />}
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
            : resources[0] &&
              <Route
                  exact
                  path="/"
                  render={() => <Redirect to={`/${resources[0].name}`} />}
              />}
        <Route component={notFound || NotFound} />
    </Switch>;

const componentPropType = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
]);

AdminRoutes.propTypes = {
    customRoutes: PropTypes.array,
    resources: PropTypes.array,
    dashboard: componentPropType,
    notFound: componentPropType,
};

export default AdminRoutes;
