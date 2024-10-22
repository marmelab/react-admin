import * as React from 'react';
import { Route, Routes, useLocation } from 'react-router';
import {
    CoreAdminContext,
    ShowController,
    testDataProvider,
    TestMemoryRouter,
} from '../..';

export default {
    title: 'ra-core/controller/useShowController',
};

export const EncodedId = ({
    id = 'test?',
    url = '/posts/test%3F',
    dataProvider = testDataProvider({
        // @ts-expect-error
        getOne: () => Promise.resolve({ data: { id, title: 'hello' } }),
    }),
}) => {
    return (
        <TestMemoryRouter initialEntries={[url]}>
            <CoreAdminContext dataProvider={dataProvider}>
                <Routes>
                    <Route
                        path="/posts/:id"
                        element={
                            <ShowController resource="posts">
                                {({ record }) => (
                                    <>
                                        <LocationInspector />
                                        <p>Id: {record && record.id}</p>
                                        <p>Title: {record && record.title}</p>
                                    </>
                                )}
                            </ShowController>
                        }
                    />
                </Routes>
            </CoreAdminContext>
        </TestMemoryRouter>
    );
};

export const EncodedIdWithPercentage = ({
    id = 'test%',
    url = '/posts/test%25',
    dataProvider = testDataProvider({
        // @ts-expect-error
        getOne: () => Promise.resolve({ data: { id, title: 'hello' } }),
    }),
}) => {
    return (
        <TestMemoryRouter initialEntries={[url]}>
            <CoreAdminContext dataProvider={dataProvider}>
                <Routes>
                    <Route
                        path="/posts/:id"
                        element={
                            <ShowController resource="posts">
                                {({ record }) => (
                                    <>
                                        <LocationInspector />
                                        <p>Id: {record && record.id}</p>
                                        <p>Title: {record && record.title}</p>
                                    </>
                                )}
                            </ShowController>
                        }
                    />
                </Routes>
            </CoreAdminContext>
        </TestMemoryRouter>
    );
};

const LocationInspector = () => {
    const location = useLocation();
    return (
        <p>
            Location: <code>{location.pathname}</code>
        </p>
    );
};
