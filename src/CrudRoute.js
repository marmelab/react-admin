import React from 'react';
import { IndexRoute, Route } from 'react-router';
import { createRoutesFromReactChildren } from 'react-router/lib/RouteUtils';

const scrollToTop = () => window.scrollTo(0,0);

const CrudRoute = () => <div>&lt;CrudRoute&gt; elements are for configuration only and should not be rendered</div>;

CrudRoute.createRouteFromReactElement = (element, parentRoute) => {
    const { path, list, create, edit, show, remove, options } = element.props;
    // dynamically add crud routes
    const crudRoute = createRoutesFromReactChildren(
        <Route path={path}>
            {list && <IndexRoute component={list} />}
            {create && <Route path="create" component={create} />}
            {edit && <Route path=":id" component={edit} onEnter={scrollToTop} />}
            {show && <Route path=":id/show" component={show} onEnter={scrollToTop} />}
            {remove && <Route path=":id/delete" component={remove} />}
        </Route>,
        parentRoute
    )[0];
    // higher-order component to pass path as resource to components
    crudRoute.component = ({ children }) => (
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
    );
    return crudRoute;
};

export default CrudRoute;
