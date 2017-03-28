import React, { createElement } from 'react';
import { Route, Switch } from 'react-router-dom';
import Restricted from './auth/Restricted';

const CrudRoute = ({ authClient = () => Promise.resolve(), match, resource, list, create, edit, show, remove, options }) => {
    const commonProps = {
        resource,
        options,
        hasList: !!list,
        hasEdit: !!edit,
        hasShow: !!show,
        hasCreate: !!create,
        hasDelete: !!remove,
    };
    const CrudComponent = (component, route) => routeProps =>
        <Restricted authClient={authClient} authParams={{ resource, route }} {...routeProps}>
            {createElement(component, { ...commonProps, ...routeProps })}
        </Restricted>;
    return (
        <Switch>
            {list
                ? <Route exact path={match.url} render={CrudComponent(list, 'list')} />
                : <Route path="dummy" />}
            {create
                ? <Route exact path={`${match.url}/create`} render={CrudComponent(create, 'create')} />
                : <Route path="dummy" />}
            {edit
                ? <Route exact path={`${match.url}/:id`} render={CrudComponent(edit, 'edit')} />
                : <Route path="dummy" />}
            {show
                ? <Route exact path={`${match.url}/:id/show`} render={CrudComponent(show, 'show')} />
                : <Route path="dummy" />}
            {remove
                ? <Route exact path={`${match.url}/:id/delete`} render={CrudComponent(remove, 'delete')} />
                : <Route path="dummy" />}
        </Switch>
    );
};

export default CrudRoute;
