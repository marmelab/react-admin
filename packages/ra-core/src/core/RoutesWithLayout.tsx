import * as React from 'react';
import { Children } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import WithPermissions from '../auth/WithPermissions';
import {
    AdminChildren,
    CatchAllComponent,
    TitleComponent,
    DashboardComponent,
    ResourceProps,
} from '../types';

import { CustomRoutes, CustomRoutesProps } from './CustomRoutes';

export const RoutesWithLayout = (props: RoutesWithLayoutProps) => {
    const {
        catchAll: CatchAll,
        children,
        dashboard,
        firstResource,
        title,
    } = props;

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
    firstResource: string;
    title?: TitleComponent;
}

const defaultAuthParams = { route: 'dashboard' };

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
