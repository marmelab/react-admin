import * as React from 'react';
import expect from 'expect';
import { waitFor } from '@testing-library/react';
import { renderWithRedux } from 'ra-test';
import { MemoryRouter, Route } from 'react-router';

import { ShowController } from './ShowController';
import { DataProviderContext } from '../../dataProvider';
import { DataProvider } from '../../types';

describe('useShowController', () => {
    const defaultProps = {
        id: 12,
        resource: 'posts',
        debounce: 200,
    };

    it('should call the dataProvider.getOne() function on mount', async () => {
        const getOne = jest
            .fn()
            .mockImplementationOnce(() =>
                Promise.resolve({ data: { id: 12, title: 'hello' } })
            );
        const dataProvider = ({ getOne } as unknown) as DataProvider;
        const { queryAllByText } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <ShowController {...defaultProps}>
                    {({ record }) => <div>{record && record.title}</div>}
                </ShowController>
            </DataProviderContext.Provider>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        await waitFor(() => {
            expect(getOne).toHaveBeenCalled();
            expect(queryAllByText('hello')).toHaveLength(1);
        });
    });

    it('should decode the id from the route params', async () => {
        const getOne = jest
            .fn()
            .mockImplementationOnce(() =>
                Promise.resolve({ data: { id: 12, title: 'hello' } })
            );
        const dataProvider = ({ getOne } as unknown) as DataProvider;
        renderWithRedux(
            <MemoryRouter initialEntries={['/posts/test%3F']}>
                <Route path="/posts/:id">
                    <DataProviderContext.Provider value={dataProvider}>
                        <ShowController resource="posts">
                            {({ record }) => (
                                <div>{record && record.title}</div>
                            )}
                        </ShowController>
                    </DataProviderContext.Provider>
                </Route>
            </MemoryRouter>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        await waitFor(() => {
            expect(getOne).toHaveBeenCalledWith('posts', { id: 'test?' });
        });
    });

    it('should dispatch a CRUD_GET_ONE action on mount', async () => {
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 13, title: 'hello' } }),
        } as unknown) as DataProvider;
        const { dispatch, queryAllByText } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <ShowController {...defaultProps} id={13}>
                    {({ record }) => <div>{record && record.title}</div>}
                </ShowController>
            </DataProviderContext.Provider>,
            { admin: { resources: { posts: { data: {} } } } }
        );

        await waitFor(() => {
            const crudGetOneAction = dispatch.mock.calls[0][0];
            expect(crudGetOneAction.type).toEqual('RA/CRUD_GET_ONE');
            expect(crudGetOneAction.payload).toEqual({ id: 13 });
            expect(crudGetOneAction.meta.resource).toEqual('posts');
        });
        expect(queryAllByText('hello')).toHaveLength(1);
    });

    it('should grab the record from the store based on the id', () => {
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12, title: 'world' } }),
        } as unknown) as DataProvider;
        const { queryAllByText } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <ShowController {...defaultProps}>
                    {({ record }) => <div>{record && record.title}</div>}
                </ShowController>
            </DataProviderContext.Provider>,
            {
                admin: {
                    resources: {
                        posts: { data: { 12: { id: 12, title: 'hello' } } },
                    },
                },
            }
        );
        expect(queryAllByText('hello')).toHaveLength(1);
    });
});
