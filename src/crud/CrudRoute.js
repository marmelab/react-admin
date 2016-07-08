import React from 'react';
import { IndexRoute, Route } from 'react-router';
import { createRoutesFromReactChildren } from 'react-router/lib//RouteUtils';

const CrudRoute = () => <div>&lt;CrudRoute&gt; elements are for configuration only and should not be rendered</div>;

CrudRoute.createRouteFromReactElement = (element, parentRoute) => {
    const { path, endpoint, list, show } = element.props;
    // dynamically add crud routes
    const crudRoute = createRoutesFromReactChildren(
        <Route path={path}>
            {element.props.list ? <IndexRoute component={list} /> : null}
            {element.props.show ? <Route path=":id" component={show} /> : null}
        </Route>,
        parentRoute
    )[0];
    // higher-order component to pass path and endpoint to components
    crudRoute.component = ({ children }) => (
        <div>
            { React.Children.map(children, child => React.cloneElement(children, { resource: path, path: endpoint })) }
        </div>
    );
    return crudRoute;
};

export default CrudRoute;
