import * as React from 'react';
import {
    createMemoryRouter,
    RouterProvider,
    useLocation,
    Location,
} from 'react-router-dom';
import type { InitialEntry } from '@remix-run/router';

const UseLocation = ({
    locationCallback,
}: {
    locationCallback: (l: Location) => void;
}) => {
    const location = useLocation();
    locationCallback(location);
    return null;
};

/**
 * Wrapper around react-router's `createMemoryRouter` to be used in test components.
 *
 * It is similar to `MemoryRouter` but it supports
 * [data APIs](https://reactrouter.com/en/main/routers/picking-a-router#data-apis).
 *
 * Additionally, it provides a `locationCallback` prop to get the location in the test.
 */
export const TestMemoryRouter = ({
    children,
    locationCallback,
    ...rest
}: {
    children: React.ReactNode;
    locationCallback?: (l: Location) => void;
    basename?: string;
    initialEntries?: InitialEntry[];
    initialIndex?: number;
}) => {
    const router = createMemoryRouter(
        [
            {
                path: '*',
                element: (
                    <>
                        {children}
                        {locationCallback && (
                            <UseLocation locationCallback={locationCallback} />
                        )}
                    </>
                ),
            },
        ],
        { ...rest }
    );
    return <RouterProvider router={router} />;
};
