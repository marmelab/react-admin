import * as React from 'react';
import { ComponentType, isValidElement } from 'react';
import { Route, Routes } from 'react-router-dom';
import { isValidElementType } from 'react-is';

import { ResourceProps } from '../types';
import { ResourceContextProvider } from './ResourceContextProvider';
import { RestoreScrollPosition } from '../routing/RestoreScrollPosition';

export const Resource = (props: ResourceProps) => {
    const { create, edit, list, name, show } = props;

    return (
        <ResourceContextProvider value={name}>
            <Routes>
                {create && (
                    <Route path="create/*" element={getElement(create)} />
                )}
                {show && <Route path=":id/show/*" element={getElement(show)} />}
                {edit && <Route path=":id/*" element={getElement(edit)} />}
                {list && (
                    <Route
                        path="/*"
                        element={
                            <RestoreScrollPosition
                                storeKey={`${name}.list.scrollPosition`}
                            >
                                {getElement(list)}
                            </RestoreScrollPosition>
                        }
                    />
                )}
                {props.children}
            </Routes>
        </ResourceContextProvider>
    );
};

const getElement = (
    ElementOrComponent: ComponentType<any> | React.ReactNode
) => {
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
