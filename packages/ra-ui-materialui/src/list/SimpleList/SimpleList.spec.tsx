import * as React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import { ListContextProvider, ResourceContextProvider } from 'ra-core';

import { AdminContext } from '../../AdminContext';
import { SimpleList } from './SimpleList';
import { TextField } from '../../field';

const defaultData = [
    { id: 1, title: 'foo' },
    { id: 2, title: 'bar' },
];

const contextValue = {
    resource: 'posts',
    data: defaultData,
    total: 2,
    isFetching: false,
    isLoading: false,
    selectedIds: [],
    sort: { field: 'title', order: 'ASC' },
    onToggleItem: jest.fn(),
    onSelect: jest.fn(),
    filterValues: {},
};

const Wrapper = ({ children, listContext }: any) => (
    <AdminContext>
        <ResourceContextProvider value="posts">
            <ListContextProvider value={listContext}>
                {children}
            </ListContextProvider>
        </ResourceContextProvider>
    </AdminContext>
);

describe('<SimpleList />', () => {
    it('should render a list of items which provide a record context', async () => {
        render(
            <Wrapper listContext={contextValue}>
                <SimpleList
                    primaryText={record => record.id.toString()}
                    secondaryText={<TextField source="title" />}
                />
            </Wrapper>
        );

        await waitFor(() => {
            expect(
                within(screen.getByText('1').closest('li')).queryByText('foo')
            ).not.toBeNull();
            expect(
                within(screen.getByText('2').closest('li')).queryByText('bar')
            ).not.toBeNull();
        });
    });

    it.each([
        [
            'edit',
            'edit',
            ['http://localhost/#/posts/1', 'http://localhost/#/posts/2'],
        ],
        [
            'show',
            'show',
            [
                'http://localhost/#/posts/1/show',
                'http://localhost/#/posts/2/show',
            ],
        ],
        [
            'custom',
            (record, id) => `/posts/${id}/custom`,
            [
                'http://localhost/#/posts/1/custom',
                'http://localhost/#/posts/2/custom',
            ],
        ],
    ])(
        'should render %s links for each item',
        async (_, link, expectedUrls) => {
            render(
                <Wrapper listContext={contextValue}>
                    <SimpleList
                        linkType={link}
                        primaryText={record => record.id.toString()}
                        secondaryText={<TextField source="title" />}
                    />
                </Wrapper>
            );

            await waitFor(() => {
                expect(screen.getByText('1').closest('a').href).toEqual(
                    expectedUrls[0]
                );
                expect(screen.getByText('2').closest('a').href).toEqual(
                    expectedUrls[1]
                );
            });
        }
    );

    it('should not render links if linkType is false', async () => {
        render(
            <Wrapper listContext={contextValue}>
                <SimpleList
                    linkType={false}
                    primaryText={record => record.id.toString()}
                    secondaryText={<TextField source="title" />}
                />
            </Wrapper>
        );

        await waitFor(() => {
            expect(screen.getByText('1').closest('a')).toBeNull();
            expect(screen.getByText('2').closest('a')).toBeNull();
        });
    });

    it('should display the default empty component when no data is available', () => {
        const emptyData = {
            ...contextValue,
            data: [],
        };

        const { rerender } = render(
            <Wrapper listContext={emptyData}>
                <SimpleList />
            </Wrapper>
        );

        expect(screen.queryByText('resources.posts.empty')).not.toBeNull();

        const undefinedData = {
            ...contextValue,
            data: undefined,
        };

        rerender(
            <Wrapper listContext={undefinedData}>
                <SimpleList />
            </Wrapper>
        );

        expect(screen.queryByText('resources.posts.empty')).not.toBeNull();
    });

    it('should not display the default empty component when no data is available but a filter is active', () => {
        const emptyData = {
            ...contextValue,
            data: [],
            filterValues: { q: 'foo' },
        };

        const { rerender } = render(
            <Wrapper listContext={emptyData}>
                <SimpleList />
            </Wrapper>
        );

        expect(screen.queryByText('resources.posts.empty')).toBeNull();

        const undefinedData = {
            ...contextValue,
            data: undefined,
            filterValues: { q: 'foo' },
        };

        rerender(
            <Wrapper listContext={undefinedData}>
                <SimpleList />
            </Wrapper>
        );

        expect(screen.queryByText('resources.posts.empty')).toBeNull();
    });

    it('should display the custom empty component when no data is available', () => {
        const Empty = () => <div>No records to show</div>;

        const emptyData = {
            ...contextValue,
            data: [],
        };

        const { rerender } = render(
            <Wrapper listContext={emptyData}>
                <SimpleList empty={<Empty />} />
            </Wrapper>
        );

        expect(screen.queryByText('No records to show')).toBeTruthy();

        const undefinedData = {
            ...contextValue,
            data: undefined,
        };

        rerender(
            <Wrapper listContext={undefinedData}>
                <SimpleList empty={<Empty />} />
            </Wrapper>
        );

        expect(screen.queryByText('No records to show')).toBeTruthy();
    });
});
