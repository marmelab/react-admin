import React, { createElement } from 'react';
import { Route, Switch } from 'react-router-dom';

import Restricted from './auth/Restricted';

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
    const RestrictedPage = (component, route) => routeProps =>
        <Restricted authParams={{ resource, route }} {...routeProps}>
            {createElement(component, { ...commonProps, ...routeProps })}
        </Restricted>;
    return (
        <Switch>
            {list && <Route exact path={`/${resource}`} render={RestrictedPage(list, 'list')} />}
            {create &&  <Route exact path={`/${resource}/create`} render={RestrictedPage(create, 'create')} />}
            {edit && <Route exact path={`/${resource}/:id`} render={RestrictedPage(edit, 'edit')} />}
            {show && <Route exact path={`/${resource}/:id/show`} render={RestrictedPage(show, 'show')} />}
            {remove && <Route exact path={`/${resource}/:id/delete`} render={RestrictedPage(remove, 'delete')} />}
        </Switch>
    );
};

export default CrudRoute;
