import React from 'react';
import { IndexRoute, Route, Switch } from 'react-router';

const CrudRoute = ({ path, list, create, edit, show, remove, options, onEnter = () => null }) => {
    const commonProps = {
        resource: path,
        options,
        hasList: !!list,
        hasEdit: !!edit,
        hasShow: !!show,
        hasCreate: !!create,
        hasDelete: !!remove,
    };
    return (
        <Switch>
            {list ? <IndexRoute {...commonProps} path={path} component={list} onEnter={onEnter({ resource: path, route: 'list' })} /> : null}
            {create ? <Route {...commonProps} path={`${path}/create`} component={create} onEnter={onEnter({ resource: path, route: 'create' })} /> : null}
            {edit ? <Route {...commonProps} path={`${path}/:id`} component={edit} onEnter={onEnter({ resource: path, route: 'edit', scrollToTop: true })} /> : null}
            {/*show ? <Route {...commonProps} path={`${path}/:id/show`} component={show} onEnter={onEnter({ resource: path, route: 'show', scrollToTop: true })} /> : null*/}
            {remove ? <Route {...commonProps} path={`${path}/:id/delete`} component={remove} onEnter={onEnter({ resource: path, route: 'delete' })} /> : null}
        </Switch>
    );
};

export default CrudRoute;
