import * as React from 'react';
import expect from 'expect';
import { render, screen } from '@testing-library/react';
import { DataTableBase } from './DataTableBase';
import { ResourceContextProvider, useResourceContext } from '../core';
import { ListContextProvider } from '../controller';

describe('<DataTableBase>', () => {
    const defaultListContext = {
        resource: 'posts',
        data: [],
        total: 0,
        isPending: false,
        isFetching: false,
        sort: { field: 'id', order: 'ASC' },
    };

    const DataTable = () => (
        <DataTableBase
            empty={<div>Empty</div>}
            loading={<div>Loading</div>}
            hasBulkActions={false}
        >
            <div>Child Content</div>
        </DataTableBase>
    );

    it('should render children when data is present', () => {
        render(
            <ResourceContextProvider value="posts">
                <ListContextProvider
                    value={
                        {
                            ...defaultListContext,
                            data: [{ id: 1 }],
                            total: 1,
                        } as any
                    }
                >
                    <DataTable />
                </ListContextProvider>
            </ResourceContextProvider>
        );

        expect(screen.queryByText('Child Content')).not.toBeNull();
        expect(screen.queryByText('Loading')).toBeNull();
        expect(screen.queryByText('Empty')).toBeNull();
    });

    it('should render empty component when no data', () => {
        render(
            <ResourceContextProvider value="posts">
                <ListContextProvider
                    value={{ ...defaultListContext, data: [], total: 0 } as any}
                >
                    <DataTable />
                </ListContextProvider>
            </ResourceContextProvider>
        );

        expect(screen.queryByText('Child Content')).toBeNull();
        expect(screen.queryByText('Loading')).toBeNull();
        expect(screen.queryByText('Empty')).not.toBeNull();
    });

    it('should render loading component when pending', () => {
        render(
            <ResourceContextProvider value="posts">
                <ListContextProvider
                    value={{ ...defaultListContext, isPending: true } as any}
                >
                    <DataTable />
                </ListContextProvider>
            </ResourceContextProvider>
        );

        expect(screen.queryByText('Child Content')).toBeNull();
        expect(screen.queryByText('Loading')).not.toBeNull();
        expect(screen.queryByText('Empty')).toBeNull();
    });

    it('should display the current data when data is refreshing', () => {
        render(
            <ResourceContextProvider value="posts">
                <ListContextProvider
                    value={
                        {
                            ...defaultListContext,
                            data: [{ id: 1 }],
                            total: 1,
                            isPending: false,
                            isFetching: true,
                        } as any
                    }
                >
                    <DataTable />
                </ListContextProvider>
            </ResourceContextProvider>
        );

        expect(screen.queryByText('Child Content')).not.toBeNull();
        expect(screen.queryByText('Loading')).toBeNull();
        expect(screen.queryByText('Empty')).toBeNull();
    });

    it('should provide ResourceContext to the loading component', () => {
        const Loading = () => {
            const resource = useResourceContext();
            return <div>Loading resource: {resource}</div>;
        };

        render(
            <ResourceContextProvider value="posts">
                <ListContextProvider
                    value={{ ...defaultListContext, isPending: true } as any}
                >
                    <DataTableBase
                        empty={<div>Empty</div>}
                        loading={<Loading />}
                        hasBulkActions={false}
                    >
                        <div>Child</div>
                    </DataTableBase>
                </ListContextProvider>
            </ResourceContextProvider>
        );

        expect(screen.queryByText('Loading resource: posts')).not.toBeNull();
    });

    it('should provide ResourceContext to the empty component', () => {
        const Empty = () => {
            const resource = useResourceContext();
            return <div>Empty resource: {resource}</div>;
        };

        render(
            <ResourceContextProvider value="posts">
                <ListContextProvider
                    value={
                        {
                            ...defaultListContext,
                            isPending: false,
                            data: [],
                        } as any
                    }
                >
                    <DataTableBase
                        empty={<Empty />}
                        loading={<div>Loading</div>}
                        hasBulkActions={false}
                    >
                        <div>Child</div>
                    </DataTableBase>
                </ListContextProvider>
            </ResourceContextProvider>
        );

        expect(screen.queryByText('Empty resource: posts')).not.toBeNull();
    });
});
