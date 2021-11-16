import React, { Children, cloneElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import WithPermissions from '../auth/WithPermissions';
import {
    AdminChildren,
    CustomRoutes,
    CatchAllComponent,
    TitleComponent,
    DashboardComponent,
    ResourceDefinition,
    ResourceProps,
} from '../types';

import Resource from './Resource';
import { useRegisterResource } from './useRegisterResource';

export interface RoutesWithLayoutProps {
    catchAll: CatchAllComponent;
    children: AdminChildren;
    customRoutes?: CustomRoutes;
    dashboard?: DashboardComponent;
    title?: TitleComponent;
}

const defaultAuthParams = { route: 'dashboard' };

const createResourcesFromChildren = (children: React.ReactNode) => {
    const resources: ResourceDefinition[] = [];

    Children.forEach(children, element => {
        if (!React.isValidElement(element)) {
            // Ignore non-elements. This allows people to more easily inline
            // conditionals in their route config.
            return;
        }

        if (element.type === React.Fragment) {
            // Transparently support React.Fragment and its children.
            resources.push.apply(
                resources,
                createResourcesFromChildren(element.props.children)
            );
            return;
        }

        if (element.type !== Resource) {
            throw new Error(
                `[${
                    typeof element.type === 'string'
                        ? element.type
                        : element.type.name
                }] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
            );
        }

        const resourceElement = element as React.ReactElement<ResourceProps>;

        const resource: ResourceDefinition = {
            name: resourceElement.props.name,
            options: resourceElement.props.options,
            hasList: !!resourceElement.props.list,
            hasEdit: !!resourceElement.props.edit,
            hasShow: !!resourceElement.props.show,
            hasCreate: !!resourceElement.props.create,
            icon: resourceElement.props.icon,
        };

        resources.push(resource);
    });

    return resources;
};

const renderResources = (children: React.ReactNode) => {
    return Children.map(children, element => {
        if (!React.isValidElement(element)) {
            // Ignore non-elements. This allows people to more easily inline
            // conditionals in their route config.
            return null;
        }
        if (element.type === React.Fragment) {
            return renderResources(element.props.children);
        }

        const resourceElement = element as React.ReactElement<ResourceProps>;

        return (
            <Route
                key={resourceElement.props.name}
                path={`${resourceElement.props.name}/*`}
                element={resourceElement}
            />
        );
    });
};

const RoutesWithLayout = (props: RoutesWithLayoutProps) => {
    const {
        catchAll: CatchAll,
        children,
        customRoutes,
        dashboard,
        title,
    } = props;
    const childrenAsArray = React.Children.toArray(children);
    const registerResource = useRegisterResource();
    const resources = createResourcesFromChildren(children);

    resources.forEach(resource => {
        registerResource(resource);
    });

    const firstChild: React.ReactElement<any> | null =
        childrenAsArray.length > 0
            ? (childrenAsArray[0] as React.ReactElement<any>)
            : null;

    return (
        <>
            <Routes>
                {customRoutes &&
                    customRoutes.map((route, key) =>
                        cloneElement(route, { key })
                    )}
                {renderResources(children)}
                {dashboard ? (
                    <Route
                        index
                        element={
                            <WithPermissions
                                authParams={defaultAuthParams}
                                component={dashboard}
                            />
                        }
                    />
                ) : firstChild ? (
                    <Route
                        index
                        element={<Navigate to={`/${firstChild.props.name}`} />}
                    />
                ) : null}
                <Route path="*" element={<CatchAll title={title} />} />
            </Routes>
        </>
    );
};

export default RoutesWithLayout;
