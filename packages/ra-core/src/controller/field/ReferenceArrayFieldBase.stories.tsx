import * as React from 'react';
import fakeRestProvider from 'ra-data-fakerest';

import { ReferenceArrayFieldBase } from './ReferenceArrayFieldBase';
import {
    CoreAdmin,
    DataProvider,
    Resource,
    ShowBase,
    TestMemoryRouter,
    useListContext,
} from '../..';
import { QueryClient } from '@tanstack/react-query';

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
                            <MyReferenceArrayField>
                                <List source="name" />
                            </MyReferenceArrayField>
                        </ReferenceArrayFieldBase>
                    </ShowBase>
                }
            />
        </CoreAdmin>
    </TestMemoryRouter>
);

export const WithPagination = () => (
    <TestMemoryRouter initialEntries={['/bands/1/show']}>
        <CoreAdmin dataProvider={defaultDataProvider}>
            <Resource name="artists" />
            <Resource
                name="bands"
                show={
                    <ShowBase resource="bands" id={1}>
                        <ReferenceArrayFieldBase
                            source="members"
                            reference="artists"
                            pagination={<Pagination />}
                            perPage={3}
                        >
                            <MyReferenceArrayField>
                                <List source="name" />
                            </MyReferenceArrayField>
                        </ReferenceArrayFieldBase>
                    </ShowBase>
                }
            />
        </CoreAdmin>
    </TestMemoryRouter>
);

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
    pagination,
}: {
    dataProvider?: DataProvider;
    pagination?: React.ReactElement;
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
                            pagination={pagination}
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

const MyReferenceArrayField = (props: { children: React.ReactNode }) => {
    const context = useListContext();

    if (context.isPending) {
        return <p>Loading...</p>;
    }

    if (context.error) {
        return <p style={{ color: 'red' }}>{context.error.toString()}</p>;
    }
    return props.children;
};

const List = ({ source }: { source: string }) => {
    const listContext = useListContext();
    return (
        <p>
            {listContext.data?.map((datum, index) => (
                <li key={index}>{datum[source]}</li>
            ))}
        </p>
    );
};

const Pagination = () => {
    const { page = 1, setPage, total = 0, perPage = 0 } = useListContext();
    const nextPage = () => {
        setPage?.(page + 1);
    };
    const previousPage = () => {
        setPage?.(page - 1);
    };
    return (
        <div>
            <button disabled={page <= 1} onClick={previousPage}>
                Previous Page
            </button>
            <span>
                {`${(page - 1) * perPage + 1} - ${Math.min(page * perPage, total)} of ${total}`}
            </span>
            <button disabled={page >= total / perPage} onClick={nextPage}>
                Next Page
            </button>
        </div>
    );
};
