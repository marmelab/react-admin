import React, { Children, cloneElement, createElement } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';

import WithPermissions from './auth/WithPermissions';

const RoutesWithLayout = ({
    catchAll,
    children,
    customRoutes,
    dashboard,
    title,
}) => (
    <Switch>
        {customRoutes &&
            customRoutes.map((route, index) => (
                <Route
                    key={index}
                    exact={route.props.exact}
                    path={route.props.path}
                    component={route.props.component}
                    render={route.props.render}
                    children={route.props.children} // eslint-disable-line react/no-children-prop
                />
            ))}
        {Children.map(children, child => (
            <Route
                key={child.props.name}
                path={`/${child.props.name}`}
                render={props =>
                    cloneElement(child, {
                        // The context prop instruct the Resource component to
                        // render itself as a standard component
                        context: 'route',
                        ...props,
                    })}
            />
        ))}
        {dashboard ? (
            <Route
                exact
                path="/"
                render={routeProps => (
                    <WithPermissions
                        authParams={{
                            route: 'dashboard',
                        }}
                        {...routeProps}
                        render={props => createElement(dashboard, props)}
                    />
                )}
            />
        ) : (
            children[0] && (
                <Route
                    exact
                    path="/"
                    render={() => (
                        <Redirect to={`/${children[0].props.name}`} />
                    )}
                />
            )
        )}
        <Route
            render={() =>
                createElement(catchAll, {
                    title,
                })}
        />
    </Switch>
);

const componentPropType = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
]);

RoutesWithLayout.propTypes = {
    catchAll: componentPropType,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    customRoutes: PropTypes.array,
    dashboard: componentPropType,
    title: PropTypes.string,
};

export default RoutesWithLayout;
