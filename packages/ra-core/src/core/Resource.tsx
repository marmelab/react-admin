import * as React from 'react';
import { isValidElement } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ResourceProps } from '../types';
import { ResourceContextProvider } from './ResourceContextProvider';

export const Resource = (props: ResourceProps) => {
    const { create: Create, edit: Edit, list: List, name, show: Show } = props;

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
