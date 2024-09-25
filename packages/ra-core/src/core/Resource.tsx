import * as React from 'react';
import { ComponentType, ReactElement, isValidElement } from 'react';
import { Route, Routes } from 'react-router-dom';
import { isValidElementType } from 'react-is';

import { ResourceProps } from '../types';
import { ResourceContextProvider } from './ResourceContextProvider';
import { RestoreScrollPosition } from '../routing/RestoreScrollPosition';
import { CanAccess } from '../auth/CanAccess';

export const Resource = (props: ResourceProps) => {
    const { create, edit, list, name, show } = props;

    return (
        <ResourceContextProvider value={name}>
            <Routes>
                {create && (
                    <Route
                        path="create/*"
                        element={
                            <CanAccess action="create" resource={name}>
                                {getElement(create)}
                            </CanAccess>
                        }
                    />
                )}
                {show && (
                    <Route
                        path=":id/show/*"
                        element={
                            <CanAccess action="show" resource={name}>
                                {getElement(show)}
                            </CanAccess>
                        }
                    />
                )}
                {edit && (
                    <Route
                        path=":id/*"
                        element={
                            <CanAccess action="edit" resource={name}>
                                {getElement(edit)}
                            </CanAccess>
                        }
                    />
                )}
                {list && (
                    <Route
                        path="/*"
                        element={
                            <CanAccess action="list" resource={name}>
                                <RestoreScrollPosition
                                    storeKey={`${name}.list.scrollPosition`}
                                >
                                    {getElement(list)}
                                </RestoreScrollPosition>
                            </CanAccess>
                        }
                    />
                )}
                {props.children}
            </Routes>
        </ResourceContextProvider>
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
