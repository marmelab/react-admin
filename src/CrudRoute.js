import React, { createElement } from 'react';
import { Route, Switch } from 'react-router-dom';

const CrudRoute = ({ match, resource, list, create, edit, show, remove, options, onEnter = () => null }) => {
    const commonProps = {
        resource,
        options,
        hasList: !!list,
        hasEdit: !!edit,
        hasShow: !!show,
        hasCreate: !!create,
        hasDelete: !!remove,
    };
    return (
        <Switch>
            {list ? <Route exact path={match.url} render={routeProps => createElement(list, {
                ...commonProps,
                ...routeProps,
                onEnter: onEnter({ resource, route: 'list' }),
            })} /> : <Route path="dummy" />}
            {create ? <Route exact path={`${match.url}/create`} render={routeProps => createElement(create, {
                ...commonProps,
                ...routeProps,
                onEnter: onEnter({ resource, route: 'create' }),
            })} /> : <Route path="dummy" />}
            {edit ? <Route exact path={`${match.url}/:id`} render={routeProps => createElement(edit, {
                ...commonProps,
                ...routeProps,
                onEnter: onEnter({ resource, route: 'edit', scrollToTop: true }),
            })} /> : <Route path="dummy" />}
            {show ? <Route exact path={`${match.url}/:id/show`} render={routeProps => createElement(show, {
                ...commonProps,
                ...routeProps,
                onEnter: onEnter({ resource, route: 'show', scrollToTop: true }),
            })} /> : <Route path="dummy" />}
            {remove ? <Route exact path={`${match.url}/:id/delete`} render={routeProps => createElement(remove, {
                ...commonProps,
                ...routeProps,
                onEnter: onEnter({ resource, route: 'delete' }),
            })} /> : <Route path="dummy" />}
        </Switch>
    );
};

export default CrudRoute;
