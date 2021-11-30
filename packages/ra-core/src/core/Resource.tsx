import * as React from 'react';
import { useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ResourceProps } from '../types';
import { ResourceContextProvider } from './ResourceContextProvider';

export const Resource = (props: ResourceProps) => {
    const { create: Create, edit: Edit, list: List, name, show: Show } = props;

    // match tends to change even on the same route ; using memo to avoid an extra render
    return useMemo(() => {
        return (
            <ResourceContextProvider value={name}>
                <Routes>
                    {Create && <Route path="create/*" element={<Create />} />}
                    {Show && <Route path=":id/show/*" element={<Show />} />}
                    {Edit && <Route path=":id/*" element={<Edit />} />}
                    {List && <Route path="/*" element={<List />} />}
                </Routes>
            </ResourceContextProvider>
        );
    }, [name, Create, Edit, List, Show]);
};
