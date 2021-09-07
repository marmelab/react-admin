import React, { Children, cloneElement, createElement } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import WithPermissions from '../auth/WithPermissions';
import {
    AdminChildren,
    CustomRoutes,
    CatchAllComponent,
    TitleComponent,
    DashboardComponent,
} from '../types';

export interface RoutesWithLayoutProps {
    catchAll: CatchAllComponent;
    children: AdminChildren;
    customRoutes?: CustomRoutes;
    dashboard?: DashboardComponent;
    title?: TitleComponent;
}

const defaultAuthParams = { route: 'dashboard' };

const RoutesWithLayout = (props: RoutesWithLayoutProps) => {
    const { catchAll, children, customRoutes, dashboard, title } = props;
    const childrenAsArray = React.Children.toArray(children);
    const firstChild: React.ReactElement<any> | null =
        childrenAsArray.length > 0
            ? (childrenAsArray[0] as React.ReactElement<any>)
            : null;

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
                <Route
                    exact
                    path="/"
                    render={routeProps => (
                        <WithPermissions
                            authParams={defaultAuthParams}
                            component={dashboard}
                            {...routeProps}
                        />
                    )}
                />
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
