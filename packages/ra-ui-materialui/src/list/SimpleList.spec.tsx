import * as React from 'react';
import { render, waitFor, within } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { ListContext } from 'ra-core';

import SimpleList from './SimpleList';
import TextField from '../field/TextField';

const renderWithRouter = children => {
    const history = createMemoryHistory();

    return {
        history,
        ...render(<Router history={history}>{children}</Router>),
    };
};

describe('<SimpleList />', () => {
    it('should render a list of items which provide a record context', async () => {
        const { getByText } = renderWithRouter(
            <ListContext.Provider
                value={{
                    loaded: true,
                    loading: false,
                    ids: [1, 2],
                    data: {
                        1: { id: 1, title: 'foo' },
                        2: { id: 2, title: 'bar' },
                    },
                    total: 2,
                    resource: 'posts',
                    basePath: '/posts',
                }}
            >
                <SimpleList
                    primaryText={record => record.id.toString()}
                    secondaryText={<TextField source="title" />}
                />
            </ListContext.Provider>
        );

        await waitFor(() => {
            expect(
                within(getByText('1').closest('li')).queryByText('foo')
            ).not.toBeNull();
            expect(
                within(getByText('2').closest('li')).queryByText('bar')
            ).not.toBeNull();
        });
    });

    it.each([
        [
            'edit',
            'edit',
            ['http://localhost/posts/1', 'http://localhost/posts/2'],
        ],
        [
            'show',
            'show',
            ['http://localhost/posts/1/show', 'http://localhost/posts/2/show'],
        ],
        [
            'custom',
            (record, id) => `/posts/${id}/custom`,
            [
                'http://localhost/posts/1/custom',
                'http://localhost/posts/2/custom',
            ],
        ],
    ])(
        'should render %s links for each item',
        async (_, link, expectedUrls) => {
            const { getByText } = renderWithRouter(
                <ListContext.Provider
                    value={{
                        loaded: true,
                        loading: false,
                        ids: [1, 2],
                        data: {
                            1: { id: 1, title: 'foo' },
                            2: { id: 2, title: 'bar' },
                        },
                        total: 2,
                        resource: 'posts',
                        basePath: '/posts',
                    }}
                >
                    <SimpleList
                        linkType={link}
                        primaryText={record => record.id.toString()}
                        secondaryText={<TextField source="title" />}
                    />
                </ListContext.Provider>
            );

            await waitFor(() => {
                expect(getByText('1').closest('a').href).toEqual(
                    expectedUrls[0]
                );
                expect(getByText('2').closest('a').href).toEqual(
                    expectedUrls[1]
                );
            });
        }
    );

    it('should not render links if linkType is false', async () => {
        const { getByText } = renderWithRouter(
            <ListContext.Provider
                value={{
                    loaded: true,
                    loading: false,
                    ids: [1, 2],
                    data: {
                        1: { id: 1, title: 'foo' },
                        2: { id: 2, title: 'bar' },
                    },
                    total: 2,
                    resource: 'posts',
                    basePath: '/posts',
                }}
            >
                <SimpleList
                    linkType={false}
                    primaryText={record => record.id.toString()}
                    secondaryText={<TextField source="title" />}
                />
            </ListContext.Provider>
        );

        await waitFor(() => {
            expect(getByText('1').closest('a')).toBeNull();
            expect(getByText('2').closest('a')).toBeNull();
        });
    });
});
