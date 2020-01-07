import React, { FunctionComponent, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import WithPermissions from '../auth/WithPermissions';
import { registerResource, unregisterResource } from '../actions';
import { ResourceProps, ResourceMatch, ReduxState } from '../types';

const defaultOptions = {};

const ResourceRegister: FunctionComponent<ResourceProps> = ({
    name,
    list,
    create,
    edit,
    show,
    icon,
    options = defaultOptions,
}) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(
            registerResource({
                name,
                options,
                hasList: !!list,
                hasEdit: !!edit,
                hasShow: !!show,
                hasCreate: !!create,
                icon,
            })
        );
        return () => dispatch(unregisterResource(name));
    }, [dispatch, name, create, edit, icon, list, show, options]);
    return null;
};

const ResourceRoutes: FunctionComponent<ResourceProps> = ({
    name,
    match,
    list,
    create,
    edit,
    show,
    options = defaultOptions,
}) => {
    const isRegistered = useSelector(
        (state: ReduxState) => !!state.admin.resources[name]
    );

    const basePath = match ? match.path : '';

    // match tends to change even on the same route ; using memo to avoid an extra render
    return useMemo(() => {
        // if the registration hasn't finished, no need to render
        if (!isRegistered) {
            return null;
        }
        const props = {
            resource: name,
            options,
            hasList: !!list,
            hasEdit: !!edit,
            hasShow: !!show,
            hasCreate: !!create,
        };

        return (
            <Switch>
                {create && (
                    <Route
                        path={`${basePath}/create`}
                        render={routeProps => (
                            <WithPermissions
                                component={create}
                                basePath={basePath}
                                {...routeProps}
                                {...props}
                            />
                        )}
                    />
                )}
                {show && (
                    <Route
                        path={`${basePath}/:id/show`}
                        render={routeProps => (
                            <WithPermissions
                                component={show}
                                basePath={basePath}
                                id={decodeURIComponent(
                                    (routeProps.match as ResourceMatch).params
                                        .id
                                )}
                                {...routeProps}
                                {...props}
                            />
                        )}
                    />
                )}
                {edit && (
                    <Route
                        path={`${basePath}/:id`}
                        render={routeProps => (
                            <WithPermissions
                                component={edit}
                                basePath={basePath}
                                id={decodeURIComponent(
                                    (routeProps.match as ResourceMatch).params
                                        .id
                                )}
                                {...routeProps}
                                {...props}
                            />
                        )}
                    />
                )}
                {list && (
                    <Route
                        path={`${basePath}`}
                        render={routeProps => (
                            <WithPermissions
                                component={list}
                                basePath={basePath}
                                {...routeProps}
                                {...props}
                            />
                        )}
                    />
                )}
            </Switch>
        );
    }, [basePath, name, create, edit, list, show, options, isRegistered]); // eslint-disable-line react-hooks/exhaustive-deps
};

const Resource: FunctionComponent<ResourceProps> = ({
    intent = 'route',
    ...props
}) =>
    intent === 'registration' ? (
        <ResourceRegister {...props} />
    ) : (
        <ResourceRoutes {...props} />
    );

export default Resource;
