import React, { createElement, Component } from 'react';
import PropTypes from 'prop-types';
import ViewListIcon from 'material-ui-icons/ViewList';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import WithPermissions from './auth/WithPermissions';

import { registerResource, unregisterResource } from './actions';

const componentPropType = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
]);

export class Resource extends Component {
    componentWillMount() {
        const {
            context,
            name,
            list,
            create,
            edit,
            show,
            remove,
            options,
            icon,
            registerResource,
        } = this.props;

        if (context === 'registration') {
            const resource = {
                name,
                options,
                hasList: !!list,
                hasEdit: !!edit,
                hasShow: !!show,
                hasCreate: !!create,
                hasDelete: !!remove,
                icon,
            };

            registerResource(resource);
        }
    }

    componentWillUnmount() {
        const { context, name, unregisterResource } = this.props;
        if (context === 'registration') {
            unregisterResource(name);
        }
    }

    render() {
        const {
            match,
            context,
            name,
            list,
            create,
            edit,
            show,
            remove,
            options,
            authParams,
        } = this.props;

        if (context === 'registration') {
            return null;
        }

        const resource = {
            resource: name,
            options,
            hasList: !!list,
            hasEdit: !!edit,
            hasShow: !!show,
            hasCreate: !!create,
            hasDelete: !!remove,
        };

        return (
            <Switch>
                {create && (
                    <Route
                        exact
                        path={`${match.url}/create`}
                        render={routeProps => (
                            <WithPermissions
                                render={props => createElement(create, props)}
                                {...routeProps}
                                {...resource}
                                authParams={{
                                    resource: name,
                                    type: 'create',
                                    ...authParams,
                                }}
                            />
                        )}
                    />
                )}
                {show && (
                    <Route
                        exact
                        path={`${match.url}/:id/show`}
                        render={routeProps => (
                            <WithPermissions
                                render={props => createElement(show, props)}
                                {...routeProps}
                                {...resource}
                                authParams={{
                                    resource: name,
                                    type: 'show',
                                    ...authParams,
                                }}
                            />
                        )}
                    />
                )}
                {remove && (
                    <Route
                        exact
                        path={`${match.url}/:id/delete`}
                        render={routeProps => (
                            <WithPermissions
                                render={props => createElement(remove, props)}
                                {...routeProps}
                                {...resource}
                                authParams={{
                                    resource: name,
                                    type: 'delete',
                                    ...authParams,
                                }}
                            />
                        )}
                    />
                )}
                {edit && (
                    <Route
                        exact
                        path={`${match.url}/:id`}
                        render={routeProps => (
                            <WithPermissions
                                render={props => createElement(edit, props)}
                                {...routeProps}
                                {...resource}
                                authParams={{
                                    resource: name,
                                    type: 'edit',
                                    ...authParams,
                                }}
                            />
                        )}
                    />
                )}
                {list && (
                    <Route
                        exact
                        path={`${match.url}`}
                        render={routeProps => (
                            <WithPermissions
                                render={props => createElement(list, props)}
                                {...routeProps}
                                {...resource}
                                authParams={{
                                    resource: name,
                                    type: 'list',
                                    ...authParams,
                                }}
                            />
                        )}
                    />
                )}
            </Switch>
        );
    }
}

Resource.propTypes = {
    context: PropTypes.oneOf(['route', 'registration']).isRequired,
    name: PropTypes.string.isRequired,
    list: componentPropType,
    create: componentPropType,
    edit: componentPropType,
    show: componentPropType,
    remove: componentPropType,
    icon: componentPropType,
    options: PropTypes.object,
    registerResource: PropTypes.func.isRequired,
    unregisterResource: PropTypes.func.isRequired,
};

Resource.defaultProps = {
    context: 'route',
    icon: ViewListIcon,
    options: {},
};

export default connect(null, { registerResource, unregisterResource })(
    Resource
);
