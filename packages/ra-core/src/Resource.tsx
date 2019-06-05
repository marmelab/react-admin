import React, { createElement, Component, ComponentType } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import WithPermissions from './auth/WithPermissions';

import { registerResource as registerResourceAction, unregisterResource as unregisterResourceAction } from './actions';
import { Dispatch, ResourceProps, ResourceMatch } from './types';

interface ConnectedProps {
    registerResource: Dispatch<typeof registerResourceAction>;
    unregisterResource: Dispatch<typeof unregisterResourceAction>;
}

export class Resource extends Component<ResourceProps & ConnectedProps> {
    static defaultProps = {
        context: 'route',
        options: {},
    };

    componentWillMount() {
        const { context, name, list, create, edit, show, options, icon, registerResource } = this.props;

        if (context === 'registration') {
            const resource = {
                name,
                options,
                hasList: !!list,
                hasEdit: !!edit,
                hasShow: !!show,
                hasCreate: !!create,
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
        const { match, context, name, list, create, edit, show, options } = this.props;

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
        };

        const basePath = match.url;

        return (
            <Switch>
                {create && (
                    <Route
                        path={`${match.url}/create`}
                        render={routeProps => (
                            <WithPermissions
                                render={props =>
                                    createElement(create, {
                                        basePath,
                                        ...props,
                                    })
                                }
                                {...routeProps}
                                {...resource}
                            />
                        )}
                    />
                )}
                {show && (
                    <Route
                        path={`${match.url}/:id/show`}
                        render={routeProps => (
                            <WithPermissions
                                render={props =>
                                    createElement(show, {
                                        basePath,
                                        id: decodeURIComponent((props.match as ResourceMatch).params.id),
                                        ...props,
                                    })
                                }
                                {...routeProps}
                                {...resource}
                            />
                        )}
                    />
                )}
                {edit && (
                    <Route
                        path={`${match.url}/:id`}
                        render={routeProps => (
                            <WithPermissions
                                render={props =>
                                    createElement(edit, {
                                        basePath,
                                        id: decodeURIComponent((props.match as ResourceMatch).params.id),
                                        ...props,
                                    })
                                }
                                {...routeProps}
                                {...resource}
                            />
                        )}
                    />
                )}
                {list && (
                    <Route
                        path={`${match.url}`}
                        render={routeProps => (
                            <WithPermissions
                                render={props =>
                                    createElement(list, {
                                        basePath,
                                        ...props,
                                    })
                                }
                                {...routeProps}
                                {...resource}
                            />
                        )}
                    />
                )}
            </Switch>
        );
    }
}

const ConnectedResource = connect(
    null,
    {
        registerResource: registerResourceAction,
        unregisterResource: unregisterResourceAction,
    }
)(
    // Necessary casting because of https://github.com/DefinitelyTyped/DefinitelyTyped/issues/19989#issuecomment-432752918
    Resource as ComponentType<ResourceProps & ConnectedProps>
);

// Necessary casting because of https://github.com/DefinitelyTyped/DefinitelyTyped/issues/19989#issuecomment-432752918
export default ConnectedResource as ComponentType<ResourceProps>;
