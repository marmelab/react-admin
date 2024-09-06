import * as React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import {
    ListContext,
    Resource,
    ResourceContextProvider,
    TestMemoryRouter,
    useListFilterContext,
} from 'ra-core';
import fakerestDataProvider from 'ra-data-fakerest';

import { AdminContext } from '../../AdminContext';
import { SimpleList } from './SimpleList';
import { TextField } from '../../field/TextField';
import { NoPrimaryText } from './SimpleList.stories';
import { Admin, List } from 'react-admin';

const Wrapper = ({ children }: any) => (
    <AdminContext>
        <ResourceContextProvider value="posts">
            {children}
        </ResourceContextProvider>
    </AdminContext>
);

describe('<SimpleList />', () => {
    it('should render a list of items which provide a record context', async () => {
        render(
            <ListContext.Provider
                value={{
                    isLoading: false,
                    data: [
                        { id: 1, title: 'foo' },
                        { id: 2, title: 'bar' },
                    ],
                    total: 2,
                    resource: 'posts',
                }}
            >
                <SimpleList
                    primaryText={record => record.id.toString()}
                    secondaryText={<TextField source="title" />}
                />
            </ListContext.Provider>,
            { wrapper: Wrapper }
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
                <ListContext.Provider
                    value={{
                        isLoading: false,
                        data: [
                            { id: 1, title: 'foo' },
                            { id: 2, title: 'bar' },
                        ],
                        total: 2,
                        resource: 'posts',
                    }}
                >
                    <SimpleList
                        linkType={link}
                        primaryText={record => record.id.toString()}
                        secondaryText={<TextField source="title" />}
                    />
                </ListContext.Provider>,
                { wrapper: Wrapper }
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
            <ListContext.Provider
                value={{
                    isLoading: false,
                    data: [
                        { id: 1, title: 'foo' },
                        { id: 2, title: 'bar' },
                    ],
                    total: 2,
                    resource: 'posts',
                }}
            >
                <SimpleList
                    linkType={false}
                    primaryText={record => record.id.toString()}
                    secondaryText={<TextField source="title" />}
                />
            </ListContext.Provider>,
            { wrapper: Wrapper }
        );

        await waitFor(() => {
            expect(screen.getByText('1').closest('a')).toBeNull();
            expect(screen.getByText('2').closest('a')).toBeNull();
        });
    });

    it('should display a message when there is no result', () => {
        render(
            <TestMemoryRouter>
                <Admin>
                    <Resource
                        name="posts"
                        list={
                            <ListContext.Provider
                                value={{
                                    isLoading: false,
                                    data: [],
                                    total: 0,
                                    resource: 'posts',
                                }}
                            >
                                <SimpleList />
                            </ListContext.Provider>
                        }
                    />
                </Admin>
            </TestMemoryRouter>
        );
        expect(
            screen.queryByText('No posts found using the current filters.')
        ).not.toBeNull();
    });

    it('should display a message when there is no result but filters applied', async () => {
        const MyListView = () => {
            const { setFilters } = useListFilterContext();
            setFilters({ title: 'foo' }, ['title']);
            return <SimpleList />;
        };

        render(
            <TestMemoryRouter>
                <Admin
                    dataProvider={fakerestDataProvider({
                        posts: [{ id: 1, title: 'bar' }],
                    })}
                >
                    <Resource
                        name="posts"
                        list={
                            <List>
                                <MyListView />
                            </List>
                        }
                    />
                </Admin>
            </TestMemoryRouter>
        );

        await screen.findByText('No posts found using the current filters.');
        screen.getByText('Clear filters.');
    });

    it('should fall back to record representation when no primaryText is provided', async () => {
        render(<NoPrimaryText />);
        await screen.findByText('War and Peace');
    });
});
