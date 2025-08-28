import * as React from 'react';
import fakeRestProvider from 'ra-data-fakerest';

import { ReferenceArrayFieldBase } from './ReferenceArrayFieldBase';
import {
    CoreAdmin,
    DataProvider,
    IsOffline,
    Resource,
    ShowBase,
    TestMemoryRouter,
    useIsOffline,
    useListContext,
    WithRecord,
} from '../..';
import { onlineManager, QueryClient } from '@tanstack/react-query';

export default { title: 'ra-core/controller/field/ReferenceArrayFieldBase' };

const fakeData = {
    bands: [{ id: 1, name: 'The Beatles', members: [1, 2, 3, 4, 5, 6, 7, 8] }],
    artists: [
        { id: 1, name: 'John Lennon' },
        { id: 2, name: 'Paul McCartney' },
        { id: 3, name: 'Ringo Star' },
        { id: 4, name: 'George Harrison' },
        { id: 5, name: 'Mick Jagger' },
        { id: 6, name: 'Keith Richards' },
        { id: 7, name: 'Ronnie Wood' },
        { id: 8, name: 'Charlie Watts' },
    ],
};
const defaultDataProvider = fakeRestProvider(fakeData, false);

export const Basic = ({
    dataProvider = defaultDataProvider,
}: {
    dataProvider?: DataProvider;
}) => (
    <TestMemoryRouter initialEntries={['/bands/1/show']}>
        <CoreAdmin
            dataProvider={dataProvider}
            queryClient={
                new QueryClient({
                    defaultOptions: {
                        queries: {
                            retry: false,
                        },
                    },
                })
            }
        >
            <Resource name="artists" />
            <Resource
                name="bands"
                show={
                    <ShowBase resource="bands" id={1}>
                        <ReferenceArrayFieldBase
                            source="members"
                            reference="artists"
                        >
                            <ArtistList />
                        </ReferenceArrayFieldBase>
                    </ShowBase>
                }
            />
        </CoreAdmin>
    </TestMemoryRouter>
);

const ArtistList = () => {
    const { isPending, error, data } = useListContext();

    if (isPending) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error.toString()}</p>;
    }
    return (
        <p>
            {data.map((datum, index) => (
                <li key={index}>{datum.name}</li>
            ))}
        </p>
    );
};

const erroredDataProvider = {
    ...defaultDataProvider,
    getMany: _resource => Promise.reject(new Error('Error')),
} as any;

export const Errored = () => <Basic dataProvider={erroredDataProvider} />;

const foreverLoadingDataProvider = {
    ...defaultDataProvider,
    getMany: _resource => new Promise(() => {}),
} as any;

export const Loading = () => (
    <Basic dataProvider={foreverLoadingDataProvider} />
);

export const WithRenderProp = ({
    dataProvider = defaultDataProvider,
}: {
    dataProvider?: DataProvider;
}) => (
    <TestMemoryRouter initialEntries={['/bands/1/show']}>
        <CoreAdmin
            dataProvider={dataProvider}
            queryClient={
                new QueryClient({
                    defaultOptions: {
                        queries: {
                            retry: false,
                        },
                    },
                })
            }
        >
            <Resource name="artists" />
            <Resource
                name="bands"
                show={
                    <ShowBase resource="bands" id={1}>
                        <ReferenceArrayFieldBase
                            source="members"
                            reference="artists"
                            render={({ data, isPending, error }) => {
                                if (isPending) {
                                    return <p>Loading...</p>;
                                }

                                if (error) {
                                    return (
                                        <p style={{ color: 'red' }}>
                                            {error.toString()}
                                        </p>
                                    );
                                }

                                return (
                                    <p>
                                        {data?.map((datum, index) => (
                                            <li key={index}>{datum.name}</li>
                                        ))}
                                    </p>
                                );
                            }}
                        />
                    </ShowBase>
                }
            />
        </CoreAdmin>
    </TestMemoryRouter>
);

export const Offline = () => (
    <TestMemoryRouter initialEntries={['/bands/1/show']}>
        <CoreAdmin
            dataProvider={defaultDataProvider}
            queryClient={
                new QueryClient({
                    defaultOptions: {
                        queries: {
                            retry: false,
                        },
                    },
                })
            }
        >
            <Resource
                name="bands"
                show={
                    <ShowBase>
                        <div>
                            <WithRecord render={band => <p>{band.name}</p>} />
                            <RenderChildOnDemand>
                                <ReferenceArrayFieldBase
                                    source="members"
                                    reference="artists"
                                    offline={
                                        <p style={{ color: 'orange' }}>
                                            You are offline, cannot load data
                                        </p>
                                    }
                                    render={({ data, isPending, error }) => {
                                        if (isPending) {
                                            return <p>Loading...</p>;
                                        }

                                        if (error) {
                                            return (
                                                <p style={{ color: 'red' }}>
                                                    {error.toString()}
                                                </p>
                                            );
                                        }

                                        return (
                                            <>
                                                <IsOffline>
                                                    <p
                                                        style={{
                                                            color: 'orange',
                                                        }}
                                                    >
                                                        You are offline, the
                                                        data may be outdated
                                                    </p>
                                                </IsOffline>
                                                <p>
                                                    {data?.map(
                                                        (datum, index) => (
                                                            <li key={index}>
                                                                {datum.name}
                                                            </li>
                                                        )
                                                    )}
                                                </p>
                                            </>
                                        );
                                    }}
                                />
                            </RenderChildOnDemand>
                        </div>
                        <SimulateOfflineButton />
                    </ShowBase>
                }
            />
        </CoreAdmin>
    </TestMemoryRouter>
);

const SimulateOfflineButton = () => {
    const isOffline = useIsOffline();
    return (
        <button
            type="button"
            onClick={() => onlineManager.setOnline(isOffline)}
        >
            {isOffline ? 'Simulate online' : 'Simulate offline'}
        </button>
    );
};

const RenderChildOnDemand = ({ children }) => {
    const [showChild, setShowChild] = React.useState(false);
    return (
        <>
            <button onClick={() => setShowChild(!showChild)}>
                Toggle Child
            </button>
            {showChild && <div>{children}</div>}
        </>
    );
};
