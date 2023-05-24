import * as React from 'react';
import { Children, isValidElement } from 'react';
import { RouteObject, useRoutes } from 'react-router-dom';

import { ResourceProps } from '../types';
import { ResourceContextProvider } from './ResourceContextProvider';

export const Resource = (props: ResourceProps) => {
    const {
        children,
        create: Create,
        edit: Edit,
        list: List,
        name,
        show: Show,
        routes,
    } = props;

    const resourceRoutes = React.useMemo(() => {
        let allRoutes = [];

        if (routes != null) {
            allRoutes = [...routes];
        }

        if (children != null) {
            allRoutes.push(...createRoutesFromChildren(children));
        }

        if (Create) {
            allRoutes.push({
                path: 'create/*',
                element: isValidElement(Create) ? Create : <Create />,
            });
        }

        if (Show) {
            allRoutes.push({
                path: ':id/show/*',
                element: isValidElement(Show) ? Show : <Show />,
            });
        }

        if (Edit) {
            allRoutes.push({
                path: ':id/*',
                element: isValidElement(Edit) ? Edit : <Edit />,
            });
        }

        if (List) {
            allRoutes.push({
                path: '/*',
                element: isValidElement(List) ? List : <List />,
            });
        }

        return allRoutes;
    }, [children, routes, Create, Edit, List, Show]);
    const element = useRoutes(resourceRoutes);

    return (
        <ResourceContextProvider value={name}>
            {element}
        </ResourceContextProvider>
    );
};

Resource.raName = 'Resource';

Resource.registerResource = ({
    create,
    edit,
    icon,
    list,
    name,
    options,
    show,
    recordRepresentation,
    hasCreate,
    hasEdit,
    hasShow,
}: ResourceProps) => ({
    name,
    options,
    hasList: !!list,
    hasCreate: !!create || !!hasCreate,
    hasEdit: !!edit || !!hasEdit,
    hasShow: !!show || !!hasShow,
    icon,
    recordRepresentation,
});

function createRoutesFromChildren(children: React.ReactNode): RouteObject[] {
    let routes: RouteObject[] = [];

    React.Children.forEach(children, element => {
        if (!React.isValidElement(element)) {
            // Ignore non-elements. This allows people to more easily inline
            // conditionals in their route config.
            return;
        }

        if (element.type === React.Fragment) {
            // Transparently support React.Fragment and its children.
            routes.push.apply(
                routes,
                createRoutesFromChildren(element.props.children)
            );
            return;
        }

        let route: RouteObject = {
            caseSensitive: element.props.caseSensitive,
            element: element.props.element,
            index: element.props.index,
            path: element.props.path,
        };

        if (element.props.children) {
            route.children = createRoutesFromChildren(element.props.children);
        }

        routes.push(route);
    });

    return routes;
}
