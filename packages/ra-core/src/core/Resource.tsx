import * as React from 'react';
import { isValidElement, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ResourceProps } from '../types';
import { ResourceContextProvider } from './ResourceContextProvider';
import { useRegisterResource } from './useRegisterResource';

export const Resource = (props: ResourceProps) => {
    const registerResource = useRegisterResource();
    const {
        create: Create,
        edit: Edit,
        icon,
        list: List,
        name,
        options,
        show: Show,
    } = props;

    useEffect(() => {
        registerResource({
            name: name,
            options: options,
            hasList: !!List,
            hasCreate: !!Create,
            hasEdit: !!Edit,
            hasShow: !!Show,
            icon: icon,
        });
    }, [registerResource, name, options, List, Create, Edit, Show, icon]);

    return (
        <ResourceContextProvider value={name}>
            <Routes>
                {Create && (
                    <Route
                        path="create/*"
                        element={isValidElement(Create) ? Create : <Create />}
                    />
                )}
                {Show && (
                    <Route
                        path=":id/show/*"
                        element={isValidElement(Show) ? Show : <Show />}
                    />
                )}
                {Edit && (
                    <Route
                        path=":id/*"
                        element={isValidElement(Edit) ? Edit : <Edit />}
                    />
                )}
                {List && (
                    <Route
                        path="/*"
                        element={isValidElement(List) ? List : <List />}
                    />
                )}
            </Routes>
        </ResourceContextProvider>
    );
};

Resource.raName = 'Resource';
