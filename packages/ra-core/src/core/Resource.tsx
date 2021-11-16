import * as React from 'react';
import { useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';

import WithPermissions from '../auth/WithPermissions';
import { ResourceProps } from '../types';
import { ResourceContextProvider } from './ResourceContextProvider';

const Resource = (props: ResourceProps) => {
    const { name, list, create, edit, show } = props;

    // match tends to change even on the same route ; using memo to avoid an extra render
    return useMemo(() => {
        return (
            <ResourceContextProvider value={name}>
                <Routes>
                    {create && (
                        <Route
                            path="create"
                            element={<WithPermissions component={create} />}
                        />
                    )}
                    {show && (
                        <Route
                            path=":id/show"
                            element={<WithPermissions component={show} />}
                        />
                    )}
                    {edit && (
                        <Route
                            path=":id"
                            element={<WithPermissions component={edit} />}
                        />
                    )}
                    {list && (
                        <Route
                            index
                            element={<WithPermissions component={list} />}
                        />
                    )}
                </Routes>
            </ResourceContextProvider>
        );
    }, [name, create, edit, list, show]);
};

export default Resource;
