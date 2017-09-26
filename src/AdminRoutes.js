import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import getContext from 'recompose/getContext';

import CrudRoute from './CrudRoute';
import NotFound from './mui/layout/NotFound';
import Restricted from './auth/Restricted';
import { AUTH_GET_PERMISSIONS } from './auth';
import { declareResources as declareResourcesAction } from './actions';
import getMissingAuthClientError from './util/getMissingAuthClientError';

export class AdminRoutes extends Component {
    componentDidMount() {
        this.initializeResources(this.props.children);
    }

    initializeResources(children) {
        if (typeof children === 'function') {
            if (!this.props.authClient) {
                throw new Error(getMissingAuthClientError('Admin'));
            }

            this.props.authClient(AUTH_GET_PERMISSIONS).then(permissions => {
                const resources = children(permissions)
                    .filter(node => node)
                    .map(node => node.props);
                this.props.declareResources(resources);
            });
        } else {
            const resources =
                React.Children.map(children, ({ props }) => props) || [];
            this.props.declareResources(resources);
        }
    }

    render() {
        const {
            customRoutes,
            resources = [],
            dashboard,
            catchAll,
        } = this.props;
        return (
            <Switch>
                {customRoutes &&
                    customRoutes.map((route, index) => (
                        <Route
                            key={index}
                            exact={route.props.exact}
                            path={route.props.path}
                            component={route.props.component}
                            render={route.props.render}
                            children={route.props.children} // eslint-disable-line react/no-children-prop
                        />
                    ))}
                {resources.map(resource => (
                    <Route
                        path={`/${resource.name}`}
                        key={resource.name}
                        render={() => (
                            <CrudRoute
                                resource={resource.name}
                                list={resource.list}
                                create={resource.create}
                                edit={resource.edit}
                                show={resource.show}
                                remove={resource.remove}
                                options={resource.options}
                            />
                        )}
                    />
                ))}
                {dashboard ? (
                    <Route
                        exact
                        path="/"
                        render={routeProps => (
                            <Restricted
                                authParams={{ route: 'dashboard' }}
                                {...routeProps}
                            >
                                {React.createElement(dashboard)}
                            </Restricted>
                        )}
                    />
                ) : (
                    resources[0] && (
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Redirect to={`/${resources[0].name}`} />
                            )}
                        />
                    )
                )}
                <Route component={catchAll || NotFound} />
            </Switch>
        );
    }
}

const componentPropType = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
]);

AdminRoutes.propTypes = {
    authClient: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    catchAll: componentPropType,
    customRoutes: PropTypes.array,
    declareResources: PropTypes.func.isRequired,
    resources: PropTypes.array,
    dashboard: componentPropType,
};

const mapStateToProps = state => ({
    resources: Object.keys(state.admin.resources).map(
        key => state.admin.resources[key].props
    ),
});

export default compose(
    getContext({
        authClient: PropTypes.func,
    }),
    connect(mapStateToProps, {
        declareResources: declareResourcesAction,
    })
)(AdminRoutes);
