import React, {
    Children,
    cloneElement,
    createElement,
    FunctionComponent,
} from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';

import WithPermissions from '../auth/WithPermissions';
import {
    AdminChildren,
    CustomRoutes,
    CatchAllComponent,
    TitleComponent,
    DashboardComponent,
    ReduxState,
} from '../types';

interface Props {
    catchAll: CatchAllComponent;
    children: AdminChildren;
    customRoutes?: CustomRoutes;
    dashboard?: DashboardComponent;
    title?: TitleComponent;
}

const RoutesWithLayout: FunctionComponent<Props> = ({
    catchAll,
    children,
    customRoutes,
    dashboard,
    title,
}) => {
    const childrenAsArray = React.Children.toArray(children);
    const firstChild: React.ReactElement<any> | null =
        childrenAsArray.length > 0
            ? (childrenAsArray[0] as React.ReactElement<any>)
            : null;
    // In order to let the Dashboard component use Redux-based dataProvider
    // hooks like useGetOne, we must wait for the resource registration before
    // displaying the dashboard.
    const resourcesAreRegistered = useSelector(
        (state: ReduxState) => Object.keys(state.admin.resources).length > 0
    );

    return (
        <Switch>
            {customRoutes &&
                customRoutes.map((route, key) => cloneElement(route, { key }))}
            {Children.map(children, (child: React.ReactElement<any>) => (
                <Route
                    key={child.props.name}
                    path={`/${child.props.name}`}
                    render={props =>
                        cloneElement(child, {
                            // The context prop instruct the Resource component to
                            // render itself as a standard component
                            intent: 'route',
                            ...props,
                        })
                    }
                />
            ))}
            {dashboard ? (
                resourcesAreRegistered ? (
                    <Route
                        exact
                        path="/"
                        render={routeProps => (
                            <WithPermissions
                                authParams={{
                                    route: 'dashboard',
                                }}
                                component={dashboard}
                                {...routeProps}
                            />
                        )}
                    />
                ) : null
            ) : firstChild ? (
                <Route
                    exact
                    path="/"
                    render={() => <Redirect to={`/${firstChild.props.name}`} />}
                />
            ) : null}
            <Route
                render={routeProps =>
                    createElement(catchAll, {
                        ...routeProps,
                        title,
                    })
                }
            />
        </Switch>
    );
};

export default RoutesWithLayout;
