import React from 'react';
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
            {list ? <Route exact path={match.url} render={({ location }) => React.createElement(list, {
                ...commonProps,
                location,
                onEnter: onEnter({ resource, route: 'list' }),
            })} /> : null}
            {create ? <Route exact path={`${match.url}/create`} render={({ location }) => React.createElement(create, {
                ...commonProps,
                location,
                onEnter: onEnter({ resource, route: 'create' }),
            })} /> : null}
            {edit ? <Route exact path={`${match.url}/:id`} render={({ location, match }) => React.createElement(edit, {
                ...commonProps,
                location,
                match,
                onEnter: onEnter({ resource, route: 'edit', scrollToTop: true }),
            })} /> : null}
            {show ? <Route exact path={`${match.url}/:id/show`} render={({ location, match }) => React.createElement(show, {
                ...commonProps,
                location,
                match,
                onEnter: onEnter({ resource, route: 'show', scrollToTop: true }),
            })} /> : null}
            {remove ? <Route exact path={`${match.url}/:id/delete`} render={({ location, match, history }) => React.createElement(remove, {
                ...commonProps,
                location,
                match,
                history,
                onEnter: onEnter({ resource, route: 'delete' }),
            })} /> : null}
        </Switch>
    );
};

export default CrudRoute;
