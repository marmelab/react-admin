import React, { createElement } from 'react';
import { Route, Switch } from 'react-router-dom';

import WithPermissions from './auth/WithPermissions';

const CrudRoute = ({ resource, list, create, edit, show, remove, options }) => {
    const commonProps = {
        resource,
        options,
        hasList: !!list,
        hasEdit: !!edit,
        hasShow: !!show,
        hasCreate: !!create,
        hasDelete: !!remove,
    };
    const restrictPage = (component, route) => {
        const AuthenticatedPage = routeProps => (
            <WithPermissions
                authParams={{ resource, route }}
                {...routeProps}
                render={props =>
                    createElement(component, {
                        ...commonProps,
                        ...routeProps,
                        ...props,
                    })}
            />
        );
        return AuthenticatedPage;
    };
    return (
        <Switch>
            {list && (
                <Route
                    exact
                    path={`/${resource}`}
                    render={restrictPage(list, 'list')}
                />
            )}
            {create && (
                <Route
                    exact
                    path={`/${resource}/create`}
                    render={restrictPage(create, 'create')}
                />
            )}
            {edit && (
                <Route
                    exact
                    path={`/${resource}/:id`}
                    render={restrictPage(edit, 'edit')}
                />
            )}
            {show && (
                <Route
                    exact
                    path={`/${resource}/:id/show`}
                    render={restrictPage(show, 'show')}
                />
            )}
            {remove && (
                <Route
                    exact
                    path={`/${resource}/:id/delete`}
                    render={restrictPage(remove, 'delete')}
                />
            )}
        </Switch>
    );
};

export default CrudRoute;
