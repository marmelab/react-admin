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
            {/*create ? <Route {...commonProps} path="/create" component={create} onEnter={onEnter({ resource, route: 'create' })} /> : null*/}
            {edit ? <Route exact path={`${match.url}/:id`} render={({ location, match }) => React.createElement(edit, {
                ...commonProps,
                location,
                match,
                onEnter: onEnter({ resource, route: 'edit', scrollToTop: true }),
            })} /> : null}
            {/*show ? <Route {...commonProps} path="/:id/show" component={show} onEnter={onEnter({ resource, route: 'show', scrollToTop: true })} /> : null*/}
            {/*remove ? <Route {...commonProps} path="/:id/delete" component={remove} onEnter={onEnter({ resource, route: 'delete' })} /> : null*/}
        </Switch>
    );
};

export default CrudRoute;
