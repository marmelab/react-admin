import React from 'react';
import { IndexRoute, Route } from 'react-router';
import { createRoutesFromReactChildren } from 'react-router/lib/RouteUtils';
import { pure } from 'recompose';

const CrudRoute = () => <div>&lt;CrudRoute&gt; elements are for configuration only and should not be rendered</div>;

CrudRoute.createRouteFromReactElement = (element, parentRoute) => {
    const { path, list, create, edit, show, remove, options, onEnter } = element.props;

    // dynamically add crud routes
    const crudRoute = createRoutesFromReactChildren(
        <Route path={path}>
            {list && <IndexRoute component={list} onEnter={onEnter({ resource: path, route: 'list' })} />}
            {create && <Route path="create" component={create} onEnter={onEnter({ resource: path, route: 'create' })} />}
            {edit && <Route path=":id" component={edit} onEnter={onEnter({ resource: path, route: 'edit', scrollToTop: true })} />}
            {show && <Route path=":id/show" component={show} onEnter={onEnter({ resource: path, route: 'show', scrollToTop: true })} />}
            {remove && <Route path=":id/delete" component={remove} onEnter={onEnter({ resource: path, route: 'delete' })} />}
        </Route>,
        parentRoute,
    )[0];
    // higher-order component to pass path as resource to components
    crudRoute.component = pure(({ children }) => (
        <div>
            {React.Children.map(children, child => React.cloneElement(child, {
                resource: path,
                options,
                hasList: !!list,
                hasEdit: !!edit,
                hasShow: !!show,
                hasCreate: !!create,
                hasDelete: !!remove,
            }))}
        </div>
    ));
    return crudRoute;
};

export default CrudRoute;
