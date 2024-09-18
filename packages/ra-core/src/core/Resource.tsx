import * as React from 'react';
import { ComponentType, ReactElement, isValidElement } from 'react';
import { Route, Routes } from 'react-router-dom';
import { isValidElementType } from 'react-is';

import { ResourceProps } from '../types';
import { ResourceContextProvider } from './ResourceContextProvider';
import { RestoreScrollPosition } from '../routing/RestoreScrollPosition';
import { useCanAccess } from '../auth';
import { useLoadingContext } from './useLoadingContext';
import { useUnauthorizedContext } from './useUnauthorizedContext';

export const Resource = (props: ResourceProps) => {
    const { create, edit, list, name, show } = props;

    return (
        <ResourceContextProvider value={name}>
            <Routes>
                {create && (
                    <Route
                        path="create/*"
                        element={
                            <ResourcePage action="create" resource={name}>
                                {getElement(create)}
                            </ResourcePage>
                        }
                    />
                )}
                {show && (
                    <Route
                        path=":id/show/*"
                        element={
                            <ResourcePage action="show" resource={name}>
                                {getElement(show)}
                            </ResourcePage>
                        }
                    />
                )}
                {edit && (
                    <Route
                        path=":id/*"
                        element={
                            <ResourcePage action="edit" resource={name}>
                                {getElement(edit)}
                            </ResourcePage>
                        }
                    />
                )}
                {list && (
                    <Route
                        path="/*"
                        element={
                            <ResourcePage action="list" resource={name}>
                                <RestoreScrollPosition
                                    storeKey={`${name}.list.scrollPosition`}
                                >
                                    {getElement(list)}
                                </RestoreScrollPosition>
                            </ResourcePage>
                        }
                    />
                )}
                {props.children}
            </Routes>
        </ResourceContextProvider>
    );
};

const ResourcePage = ({
    action,
    resource,
    children,
}: {
    action: string;
    resource: string;
    children: React.ReactNode;
}) => {
    const { canAccess, isPending } = useCanAccess({
        action,
        resource,
    });

    const Loading = useLoadingContext();
    const Unauthorized = useUnauthorizedContext();

    return isPending ? (
        <Loading />
    ) : canAccess === false ? (
        <Unauthorized />
    ) : (
        children
    );
};

const getElement = (ElementOrComponent: ComponentType<any> | ReactElement) => {
    if (isValidElement(ElementOrComponent)) {
        return ElementOrComponent;
    }

    if (isValidElementType(ElementOrComponent)) {
        const Element = ElementOrComponent as ComponentType<any>;
        return <Element />;
    }

    return null;
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
