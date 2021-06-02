import * as React from 'react';
import expect from 'expect';
import { waitFor, fireEvent } from '@testing-library/react';
import { Form } from 'react-final-form';
import { renderWithRedux } from 'ra-test';
import ReferenceArrayInputController, {
    ReferenceArrayInputControllerChildrenFuncParams,
} from './ReferenceArrayInputController';
import { CRUD_GET_MATCHING, CRUD_GET_MANY } from '../../../lib';
import { SORT_ASC } from '../../reducer/admin/resource/list/queryReducer';

describe('<ReferenceArrayInputController />', () => {
    const defaultProps = {
        input: { value: undefined },
        record: undefined,
        reference: 'tags',
        basePath: '/posts',
        resource: 'posts',
        source: 'tag_ids',
    };

    it('should set loading to true as long as there are no references fetched and no selected references', () => {
        const children = jest.fn(({ loading }) => (
            <div>{loading.toString()}</div>
        ));
        const { queryByText } = renderWithRedux(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ReferenceArrayInputController
                        {...defaultProps}
                        input={{ value: [1, 2] }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                )}
            />,
            { admin: { resources: { tags: { data: {} } } } }
        );

        expect(queryByText('true')).not.toBeNull();
    });

    it('should set loading to true as long as there are no references fetched and there are no data found for the references already selected', () => {
        const children = jest.fn(({ loading }) => (
            <div>{loading.toString()}</div>
        ));
        const { queryByText } = renderWithRedux(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ReferenceArrayInputController
                        {...defaultProps}
                        input={{ value: [1, 2] }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                )}
            />,
            { admin: { resources: { tags: { data: {} } } } }
        );
        expect(queryByText('true')).not.toBeNull();
    });

    it('should set loading to false if the references are being searched but data from at least one selected reference was found', () => {
        const children = jest.fn(({ loading }) => (
            <div>{loading.toString()}</div>
        ));
        const { queryByText } = renderWithRedux(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ReferenceArrayInputController
                        {...defaultProps}
                        input={{ value: [1, 2] }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                )}
            />,
            {
                admin: {
                    resources: {
                        tags: {
                            data: {
                                1: {
                                    id: 1,
                                },
                            },
                            list: {},
                        },
                    },
                },
            }
        );

        expect(queryByText('false')).not.toBeNull();
    });

    it('should set error in case of references fetch error and there are no selected reference in the input value', async () => {
        const children = jest.fn(({ error }) => <div>{error}</div>);

        const { queryByText } = renderWithRedux(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ReferenceArrayInputController {...defaultProps}>
                        {children}
                    </ReferenceArrayInputController>
                )}
            />,
            {
                admin: {
                    references: {
                        possibleValues: {
                            'posts@tag_ids': { error: 'boom' },
                        },
                    },
                },
            }
        );

        expect(queryByText('ra.input.references.all_missing')).not.toBeNull();
    });

    it('should set error in case of references fetch error and there are no data found for the references already selected', () => {
        const children = jest.fn(({ error }) => <div>{error}</div>);
        const { queryByText } = renderWithRedux(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ReferenceArrayInputController
                        {...defaultProps}
                        input={{ value: [1] }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                )}
            />,
            {
                admin: {
                    resources: { tags: { data: {} } },
                    references: {
                        possibleValues: {
                            'posts@tag_ids': { error: 'boom' },
                        },
                    },
                },
            }
        );
        expect(queryByText('ra.input.references.all_missing')).not.toBeNull();
    });

    it('should not display an error in case of references fetch error but data from at least one selected reference was found', () => {
        const children = jest.fn(({ error }) => <div>{error}</div>);
        const { queryByText } = renderWithRedux(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ReferenceArrayInputController
                        {...defaultProps}
                        input={{ value: [1, 2] }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                )}
            />,
            {
                admin: {
                    resources: {
                        tags: {
                            data: {
                                1: {
                                    id: 1,
                                },
                            },
                            list: {
                                total: 42,
                            },
                        },
                    },
                    references: {
                        possibleValues: {
                            'posts@tag_ids': { error: 'boom' },
                        },
                    },
                },
            }
        );
        expect(queryByText('ra.input.references.all_missing')).toBeNull();
    });

    it('should set warning if references fetch fails but selected references are not empty', async () => {
        const children = jest.fn(({ warning }) => <div>{warning}</div>);
        const { queryByText } = renderWithRedux(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ReferenceArrayInputController
                        {...defaultProps}
                        // Avoid global collision in useGetMany with queriesToCall
                        basePath="/articles"
                        resource="articles"
                        input={{ value: [1, 2] }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                )}
            />,
            {
                admin: {
                    resources: {
                        tags: {
                            data: {
                                1: {
                                    id: 1,
                                },
                            },
                            list: {
                                total: 42,
                            },
                        },
                    },
                    references: {
                        possibleValues: {
                            'articles@tag_ids': { error: 'boom' },
                        },
                    },
                },
            }
        );
        await waitFor(() => {
            expect(
                queryByText('ra.input.references.many_missing')
            ).not.toBeNull();
        });
    });

    it('should set warning if references were found but selected references are not complete', async () => {
        const children = jest.fn(({ warning }) => <div>{warning}</div>);
        const { queryByText } = renderWithRedux(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ReferenceArrayInputController
                        {...defaultProps}
                        // Avoid global collision in useGetMany with queriesToCall
                        basePath="/products"
                        resource="products"
                        input={{ value: [1, 2] }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                )}
            />,
            {
                admin: {
                    resources: {
                        tags: {
                            data: {
                                1: {
                                    id: 1,
                                },
                            },
                            list: {
                                total: 42,
                            },
                        },
                    },
                    references: {
                        possibleValues: {
                            'products@tag_ids': [],
                        },
                    },
                },
            }
        );
        await waitFor(() => {
            expect(
                queryByText('ra.input.references.many_missing')
            ).not.toBeNull();
        });
    });

    it('should set warning if references were found but selected references are empty', () => {
        const children = jest.fn(({ warning }) => <div>{warning}</div>);
        const { queryByText } = renderWithRedux(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ReferenceArrayInputController
                        {...defaultProps}
                        // Avoid global collision in useGetMany with queriesToCall
                        basePath="/posters"
                        resource="posters"
                        input={{ value: [1, 2] }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                )}
            />,
            {
                admin: {
                    resources: { tags: { data: { 5: {}, 6: {} } } },
                    references: {
                        possibleValues: {
                            'posters@tag_ids': [],
                        },
                    },
                },
            }
        );
        expect(queryByText('ra.input.references.many_missing')).not.toBeNull();
    });

    it('should not set warning if all references were found', async () => {
        const children = jest.fn(({ warning }) => <div>{warning}</div>);
        const { queryByText } = renderWithRedux(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ReferenceArrayInputController
                        {...defaultProps}
                        input={{ value: [1, 2] }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                )}
            />,
            {
                admin: {
                    resources: {
                        tags: {
                            data: {
                                1: {
                                    id: 1,
                                },
                                2: {
                                    id: 2,
                                },
                            },
                            list: {
                                total: 42,
                            },
                        },
                    },
                    references: {
                        possibleValues: {
                            'posts@tag_ids': [],
                        },
                    },
                },
            }
        );
        await waitFor(() => {
            expect(queryByText('ra.input.references.many_missing')).toBeNull();
        });
    });

    it('should call crudGetMatching on mount with default fetch values', async () => {
        const children = jest.fn(() => <div />);
        await new Promise(resolve => setTimeout(resolve, 100)); // empty the query deduplication in useQueryWithStore
        const { dispatch } = renderWithRedux(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ReferenceArrayInputController {...defaultProps} allowEmpty>
                        {children}
                    </ReferenceArrayInputController>
                )}
            />,
            { admin: { resources: { tags: { data: {} } } } }
        );
        expect(dispatch.mock.calls[0][0]).toEqual({
            type: CRUD_GET_MATCHING,
            meta: {
                relatedTo: 'posts@tag_ids',
                resource: 'tags',
            },
            payload: {
                pagination: {
                    page: 1,
                    perPage: 25,
                },
                sort: {
                    field: 'id',
                    order: 'DESC',
                },
                filter: { q: '' },
            },
        });
    });

    it('should allow to customize crudGetMatching arguments with perPage, sort, and filter props', () => {
        const children = jest.fn(() => <div />);

        const { dispatch } = renderWithRedux(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ReferenceArrayInputController
                        {...defaultProps}
                        sort={{ field: 'foo', order: 'ASC' }}
                        perPage={5}
                        filter={{ permanentFilter: 'foo' }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                )}
            />
        );
        expect(dispatch.mock.calls[0][0]).toEqual({
            type: CRUD_GET_MATCHING,
            meta: {
                relatedTo: 'posts@tag_ids',
                resource: 'tags',
            },
            payload: {
                pagination: {
                    page: 1,
                    perPage: 5,
                },
                sort: {
                    field: 'foo',
                    order: 'ASC',
                },
                filter: { permanentFilter: 'foo', q: '' },
            },
        });
    });

    it('should call crudGetMatching when setFilter is called', async () => {
        const children = jest.fn(({ setFilter }) => (
            <button aria-label="Filter" onClick={() => setFilter('bar')} />
        ));

        const { dispatch, getByLabelText } = renderWithRedux(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ReferenceArrayInputController {...defaultProps}>
                        {children}
                    </ReferenceArrayInputController>
                )}
            />
        );

        fireEvent.click(getByLabelText('Filter'));

        await waitFor(() => {
            expect(dispatch).toHaveBeenCalledWith({
                type: CRUD_GET_MATCHING,
                meta: {
                    relatedTo: 'posts@tag_ids',
                    resource: 'tags',
                },
                payload: {
                    pagination: {
                        page: 1,
                        perPage: 25,
                    },
                    sort: {
                        field: 'id',
                        order: 'DESC',
                    },
                    filter: { q: 'bar' },
                },
            });
        });
    });

    it('should use custom filterToQuery function prop', async () => {
        const children = jest.fn(({ setFilter }) => (
            <button aria-label="Filter" onClick={() => setFilter('bar')} />
        ));

        const { dispatch, getByLabelText } = renderWithRedux(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ReferenceArrayInputController
                        {...defaultProps}
                        filterToQuery={searchText => ({ foo: searchText })}
                    >
                        {children}
                    </ReferenceArrayInputController>
                )}
            />
        );

        fireEvent.click(getByLabelText('Filter'));

        await waitFor(() => {
            expect(dispatch).toHaveBeenCalledWith({
                type: CRUD_GET_MATCHING,
                meta: {
                    relatedTo: 'posts@tag_ids',
                    resource: 'tags',
                },
                payload: {
                    pagination: {
                        page: 1,
                        perPage: 25,
                    },
                    sort: {
                        field: 'id',
                        order: 'DESC',
                    },
                    filter: { foo: 'bar' },
                },
            });
        });
    });

    it('should call crudGetMany on mount if value is set', async () => {
        const children = jest.fn(() => <div />);

        const { dispatch } = renderWithRedux(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ReferenceArrayInputController
                        {...defaultProps}
                        input={{ value: [5, 6] }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                )}
            />,
            { admin: { resources: { tags: { data: { 5: {}, 6: {} } } } } }
        );
        await waitFor(() => {
            expect(dispatch).toHaveBeenCalledWith({
                type: CRUD_GET_MANY,
                meta: {
                    resource: 'tags',
                },
                payload: { ids: [5, 6] },
            });
        });
    });

    it('should only call crudGetMatching when calling setFilter', async () => {
        const children = jest.fn(({ setFilter }) => (
            <button aria-label="Filter" onClick={() => setFilter('bar')} />
        ));

        const { dispatch, getByLabelText } = renderWithRedux(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ReferenceArrayInputController
                        {...defaultProps}
                        input={{ value: [5] }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                )}
            />,
            { admin: { resources: { tags: { data: { 5: {} } } } } }
        );

        fireEvent.click(getByLabelText('Filter'));

        await waitFor(() => {
            expect(
                dispatch.mock.calls.filter(
                    call => call[0].type === CRUD_GET_MATCHING
                ).length
            ).toEqual(2);
            expect(
                dispatch.mock.calls.filter(
                    call => call[0].type === CRUD_GET_MANY
                ).length
            ).toEqual(1);
        });
    });

    it('should only call crudGetMatching when props other than input are changed from outside', async () => {
        const children = jest.fn(() => <div />);

        const { dispatch, rerender } = renderWithRedux(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ReferenceArrayInputController
                        {...defaultProps}
                        input={{ value: [5] }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                )}
            />,
            { admin: { resources: { tags: { data: { 5: {} } } } } }
        );

        rerender(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ReferenceArrayInputController
                        {...defaultProps}
                        input={{ value: [5] }}
                        filter={{ permanentFilter: 'bar' }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                )}
            />
        );

        await waitFor(() => {
            expect(
                dispatch.mock.calls.filter(
                    call => call[0].type === CRUD_GET_MATCHING
                ).length
            ).toEqual(2);
            expect(
                dispatch.mock.calls.filter(
                    call => call[0].type === CRUD_GET_MANY
                ).length
            ).toEqual(1);
        });

        rerender(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ReferenceArrayInputController
                        {...defaultProps}
                        input={{ value: [5] }}
                        filter={{ permanentFilter: 'bar' }}
                        sort={{ field: 'foo', order: 'ASC' }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                )}
            />
        );

        await waitFor(() => {
            expect(
                dispatch.mock.calls.filter(
                    call => call[0].type === CRUD_GET_MATCHING
                ).length
            ).toEqual(3);
            expect(
                dispatch.mock.calls.filter(
                    call => call[0].type === CRUD_GET_MANY
                ).length
            ).toEqual(1);
        });

        rerender(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ReferenceArrayInputController
                        {...defaultProps}
                        input={{ value: [5] }}
                        filter={{ permanentFilter: 'bar' }}
                        sort={{ field: 'foo', order: 'ASC' }}
                        perPage={42}
                    >
                        {children}
                    </ReferenceArrayInputController>
                )}
            />
        );

        await waitFor(() => {
            expect(
                dispatch.mock.calls.filter(
                    call => call[0].type === CRUD_GET_MATCHING
                ).length
            ).toEqual(4);
            expect(
                dispatch.mock.calls.filter(
                    call => call[0].type === CRUD_GET_MANY
                ).length
            ).toEqual(1);
        });
    });

    it('should call crudGetMany when input value changes only with the additional input values', async () => {
        const children = jest.fn(() => <div />);

        const { dispatch, rerender } = renderWithRedux(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ReferenceArrayInputController
                        {...defaultProps}
                        input={{ value: [5] }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                )}
            />,
            {
                admin: {
                    resources: {
                        tags: {
                            data: {},
                            list: {},
                        },
                    },
                    references: { possibleValues: {} },
                    ui: { viewVersion: 1 },
                },
            }
        );

        await waitFor(() => {
            expect(dispatch).toHaveBeenCalledWith({
                type: CRUD_GET_MANY,
                meta: {
                    resource: 'tags',
                },
                payload: { ids: [5] },
            });
        });
        rerender(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ReferenceArrayInputController
                        {...defaultProps}
                        input={{ value: [5, 6] }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                )}
            />
        );

        await waitFor(() => {
            expect(dispatch).toHaveBeenCalledWith({
                type: CRUD_GET_MANY,
                meta: {
                    resource: 'tags',
                },
                payload: { ids: [6] },
            });
        });
    });

    it('should not call crudGetMany when already fetched input value changes', async () => {
        const children = jest.fn(() => <div />);

        const { dispatch, rerender } = renderWithRedux(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ReferenceArrayInputController
                        {...defaultProps}
                        input={{ value: [5, 6] }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                )}
            />,
            { admin: { resources: { tags: { data: { 5: {}, 6: {} } } } } }
        );
        await waitFor(() => {
            expect(dispatch).toHaveBeenCalledWith({
                type: CRUD_GET_MANY,
                meta: {
                    resource: 'tags',
                },
                payload: { ids: [5, 6] },
            });
        });
        rerender(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ReferenceArrayInputController
                        {...defaultProps}
                        input={{ value: [5, 6] }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                )}
            />
        );

        await waitFor(() => {
            expect(
                dispatch.mock.calls.filter(
                    call => call[0].type === CRUD_GET_MANY
                ).length
            ).toEqual(1);
        });
    });

    it('should props compatible with the ListContext', async () => {
        const children = ({
            setPage,
            setPerPage,
            setSortForList,
        }: ReferenceArrayInputControllerChildrenFuncParams): React.ReactElement => {
            const handleSetPage = () => {
                setPage(2);
            };
            const handleSetPerPage = () => {
                setPerPage(50);
            };
            const handleSetSort = () => {
                setSortForList('name', SORT_ASC);
            };

            return (
                <>
                    <button aria-label="setPage" onClick={handleSetPage} />
                    <button
                        aria-label="setPerPage"
                        onClick={handleSetPerPage}
                    />
                    <button aria-label="setSort" onClick={handleSetSort} />
                </>
            );
        };

        const { getByLabelText, dispatch } = renderWithRedux(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ReferenceArrayInputController
                        {...defaultProps}
                        input={{ value: [5, 6] }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                )}
            />,
            { admin: { resources: { tags: { data: { 5: {}, 6: {} } } } } }
        );

        fireEvent.click(getByLabelText('setPage'));
        await waitFor(() => {
            expect(dispatch).toHaveBeenCalledWith({
                type: CRUD_GET_MATCHING,
                meta: {
                    relatedTo: 'posts@tag_ids',
                    resource: 'tags',
                },
                payload: {
                    pagination: {
                        page: 2,
                        perPage: 25,
                    },
                    sort: {
                        field: 'id',
                        order: 'DESC',
                    },
                    filter: { q: '' },
                },
            });
        });

        fireEvent.click(getByLabelText('setPerPage'));
        await waitFor(() => {
            expect(dispatch).toHaveBeenCalledWith({
                type: CRUD_GET_MATCHING,
                meta: {
                    relatedTo: 'posts@tag_ids',
                    resource: 'tags',
                },
                payload: {
                    pagination: {
                        page: 2,
                        perPage: 50,
                    },
                    sort: {
                        field: 'id',
                        order: 'DESC',
                    },
                    filter: { q: '' },
                },
            });
        });

        fireEvent.click(getByLabelText('setSort'));
        await waitFor(() => {
            expect(dispatch).toHaveBeenCalledWith({
                type: CRUD_GET_MATCHING,
                meta: {
                    relatedTo: 'posts@tag_ids',
                    resource: 'tags',
                },
                payload: {
                    pagination: {
                        page: 1,
                        perPage: 50,
                    },
                    sort: {
                        field: 'name',
                        order: 'ASC',
                    },
                    filter: { q: '' },
                },
            });
        });
    });

    it('should call its children with the correct resource and basePath', () => {
        const children = jest.fn(() => null);
        renderWithRedux(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ReferenceArrayInputController
                        {...defaultProps}
                        input={{ value: [1, 2] }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                )}
            />,
            { admin: { resources: { tags: { data: {} } } } }
        );

        expect(children.mock.calls[0][0].resource).toEqual('posts');
        expect(children.mock.calls[0][0].basePath).toEqual('/posts');
    });
});
