import * as React from 'react';
import {
    fireEvent,
    render,
    screen,
    waitFor,
    within,
} from '@testing-library/react';
import { ListContext, ResourceContextProvider } from 'ra-core';

import { AdminContext } from '../../AdminContext';
import { SimpleList } from './SimpleList';
import { TextField } from '../../field/TextField';
import {
    NoPrimaryText,
    Standalone,
    StandaloneEmpty,
} from './SimpleList.stories';
import { Basic } from '../filter/FilterButton.stories';

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
            <ListContext.Provider
                value={{
                    isLoading: false,
                    data: [],
                    total: 0,
                    resource: 'posts',
                }}
            >
                <SimpleList />
            </ListContext.Provider>,
            { wrapper: Wrapper }
        );
        expect(screen.queryByText('ra.navigation.no_results')).not.toBeNull();
    });

    it('should display a message when there is no result but filters applied', async () => {
        render(<Basic />);

        await screen.findByText(
            'Accusantium qui nihil voluptatum quia voluptas maxime ab similique'
        );

        fireEvent.change(screen.getByLabelText('Search'), {
            target: { value: 'w' },
        });

        expect(
            await screen.findByText('No Posts found using the current filters.')
        ).not.toBeNull();
        expect(screen.getByText('Clear filters')).not.toBeNull();

        fireEvent.click(screen.getByText('Clear filters'));

        await screen.findByText(
            'Accusantium qui nihil voluptatum quia voluptas maxime ab similique'
        );

        expect(
            screen.queryByText('No Posts found using the current filters.')
        ).toBeNull();
        expect(screen.queryByText('Clear filters')).toBeNull();
        expect(
            screen.queryByText(
                'In facilis aut aut odit hic doloribus. Fugit possimus perspiciatis sit molestias in. Sunt dignissimos sed quis at vitae veniam amet. Sint sunt perspiciatis quis doloribus aperiam numquam consequatur et. Blanditiis aut earum incidunt eos magnam et voluptatem. Minima iure voluptatum autem. At eaque sit aperiam minima aut in illum.'
            )
        ).not.toBeNull();
    });

    it('should fall back to record representation when no primaryText is provided', async () => {
        render(<NoPrimaryText />);
        await screen.findByText('War and Peace');
    });

    describe('standalone', () => {
        it('should work without a ListContext', async () => {
            render(<Standalone />);
            await screen.findByText('War and Peace');
        });
        it('should display a message when there is no result', async () => {
            render(<StandaloneEmpty />);
            await screen.findByText('No results found.');
        });
    });
});
