import * as React from 'react';
import { Children, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import WithPermissions from '../auth/WithPermissions';
import {
    AdminChildren,
    CatchAllComponent,
    TitleComponent,
    DashboardComponent,
    ResourceDefinition,
    ResourceProps,
} from '../types';

import { CustomRoutes, CustomRoutesProps } from './CustomRoutes';
import { Resource } from './Resource';
import { useRegisterResource } from './useRegisterResource';

export const RoutesWithLayout = (props: RoutesWithLayoutProps) => {
    const { catchAll: CatchAll, children, dashboard, title } = props;
    const registerResource = useRegisterResource();
    const resources = createResourcesFromChildren(children);

    useEffect(() => {
        resources.forEach(resource => {
            registerResource(resource);
        });
    }, [registerResource, resources]);

    const firstResource = resources.length > 0 ? resources[0].name : null;

    return (
        <>
            <Routes>
                {renderCustomRoutes(children)}
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
                ) : firstResource ? (
                    <Route
                        index
                        element={<Navigate to={`/${firstResource}`} />}
                    />
                ) : null}
                <Route path="*" element={<CatchAll title={title} />} />
            </Routes>
        </>
    );
};

export interface RoutesWithLayoutProps {
    catchAll: CatchAllComponent;
    children: AdminChildren;
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

        if (element.type === CustomRoutes) {
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

        if (element.type === CustomRoutes) {
            return null;
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

const renderCustomRoutes = (children: React.ReactNode) => {
    return Children.map(children, element => {
        if (!React.isValidElement(element)) {
            // Ignore non-elements. This allows people to more easily inline
            // conditionals in their route config.
            return null;
        }
        if (element.type === React.Fragment) {
            return renderCustomRoutes(element.props.children);
        }

        if (element.type !== CustomRoutes) {
            return null;
        }

        const customRoutesElement = element as React.ReactElement<
            CustomRoutesProps
        >;

        if (!customRoutesElement.props.noLayout) {
            return customRoutesElement.props.children;
        }

        return null;
    });
};
