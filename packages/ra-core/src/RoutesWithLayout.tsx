import React, {
    Children,
    cloneElement,
    createElement,
    ComponentType,
    SFC,
} from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import WithPermissions, {
    WithPermissionsChildrenParams,
} from './auth/WithPermissions';
import {
    AdminChildren,
    CustomRoutes,
    CatchAllComponent,
    TitleComponent,
} from './types';

interface Props {
    catchAll?: CatchAllComponent;
    children: AdminChildren;
    customRoutes?: CustomRoutes;
    dashboard?: ComponentType<WithPermissionsChildrenParams>;
    title?: TitleComponent;
}

const RoutesWithLayout: SFC<Props> = ({
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
                            context: 'route',
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
                            authParams={{
                                route: 'dashboard',
                            }}
                            {...routeProps}
                            render={props => createElement(dashboard, props)}
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
                render={() =>
                    createElement(catchAll, {
                        title,
                    })
                }
            />
        </Switch>
    );
};

export default RoutesWithLayout;
