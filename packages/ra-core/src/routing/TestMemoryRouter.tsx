import * as React from 'react';
import {
    createMemoryRouter,
    RouterProvider,
    useLocation,
    Location,
    useNavigate,
    NavigateFunction,
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

const UseNavigate = ({
    navigateCallback,
}: {
    navigateCallback: (n: NavigateFunction) => void;
}) => {
    const navigate = useNavigate();
    navigateCallback(navigate);
    return null;
};

/**
 * Wrapper around react-router's `createMemoryRouter` to be used in test components.
 *
 * It is similar to `MemoryRouter` but it supports
 * [data APIs](https://reactrouter.com/en/main/routers/picking-a-router#data-apis).
 *
 * Additionally, it provides
 * - a `locationCallback` prop to get the location in the test
 * - a `navigateCallback` prop to be able to navigate in the test
 */
export const TestMemoryRouter = ({
    children,
    locationCallback,
    navigateCallback,
    ...rest
}: {
    children: React.ReactNode;
    locationCallback?: (l: Location) => void;
    navigateCallback?: (n: NavigateFunction) => void;
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
                        {navigateCallback && (
                            <UseNavigate navigateCallback={navigateCallback} />
                        )}
                    </>
                ),
            },
        ],
        { ...rest }
    );
    return <RouterProvider router={router} />;
};
