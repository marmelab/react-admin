import React from 'react';
import { cleanup } from 'react-testing-library';

import ReferenceArrayFieldController from './ReferenceArrayFieldController';
import renderWithRedux from '../../util/renderWithRedux';
import { crudGetManyAccumulate } from '../../actions';

describe('<ReferenceArrayFieldController />', () => {
    afterEach(cleanup);
    it('should set the loadedOnce prop to false when related records are not yet fetched', () => {
        const children = jest.fn().mockReturnValue('child');

        renderWithRedux(
            <ReferenceArrayFieldController
                resource="foo"
                reference="bar"
                basePath=""
                record={{ id: 1, barIds: [1, 2] }}
                source="barIds"
            >
                {children}
            </ReferenceArrayFieldController>,
            {
                admin: {
                    resources: {
                        bar: {
                            data: {},
                        },
                    },
                },
            }
        );
        expect(children.mock.calls[0][0]).toEqual({
            currentSort: { field: 'id', order: 'ASC' },
            loadedOnce: false,
            referenceBasePath: '',
            data: null,
            ids: [1, 2],
        });
    });

    it('should set the loadedOnce prop to true when at least one related record is found', () => {
        const children = jest.fn().mockReturnValue('child');

        renderWithRedux(
            <ReferenceArrayFieldController
                record={{ id: 1, barIds: [1, 2] }}
                resource="foo"
                reference="bar"
                source="barIds"
                basePath=""
            >
                {children}
            </ReferenceArrayFieldController>,
            {
                admin: {
                    resources: {
                        bar: {
                            data: {
                                2: {
                                    id: 2,
                                    title: 'hello',
                                },
                            },
                        },
                    },
                },
            }
        );

        expect(children.mock.calls[0][0]).toEqual({
            currentSort: { field: 'id', order: 'ASC' },
            loadedOnce: true,
            referenceBasePath: '',
            data: {
                2: {
                    id: 2,
                    title: 'hello',
                },
            },
            ids: [1, 2],
        });
    });

    it('should set the data prop to the loaded data when it has been fetched', () => {
        const children = jest.fn().mockReturnValue('child');
        renderWithRedux(
            <ReferenceArrayFieldController
                record={{ id: 1, barIds: [1, 2] }}
                resource="foo"
                reference="bar"
                source="barIds"
                basePath=""
            >
                {children}
            </ReferenceArrayFieldController>,
            {
                admin: {
                    resources: {
                        bar: {
                            data: {
                                1: { id: 1, title: 'hello' },
                                2: { id: 2, title: 'world' },
                            },
                        },
                    },
                },
            }
        );
        expect(children.mock.calls[0][0]).toEqual({
            currentSort: { field: 'id', order: 'ASC' },
            loadedOnce: true,
            referenceBasePath: '',
            data: {
                1: { id: 1, title: 'hello' },
                2: { id: 2, title: 'world' },
            },
            ids: [1, 2],
        });
    });

    it('should support record with string identifier', () => {
        const children = jest.fn().mockReturnValue('child');
        renderWithRedux(
            <ReferenceArrayFieldController
                record={{ id: 1, barIds: ['abc-1', 'abc-2'] }}
                resource="foo"
                reference="bar"
                source="barIds"
                basePath=""
            >
                {children}
            </ReferenceArrayFieldController>,
            {
                admin: {
                    resources: {
                        bar: {
                            data: {
                                'abc-1': { id: 'abc-1', title: 'hello' },
                                'abc-2': { id: 'abc-2', title: 'world' },
                            },
                        },
                    },
                },
            }
        );
        expect(children.mock.calls[0][0]).toEqual({
            currentSort: { field: 'id', order: 'ASC' },
            loadedOnce: true,
            referenceBasePath: '',
            data: {
                'abc-1': { id: 'abc-1', title: 'hello' },
                'abc-2': { id: 'abc-2', title: 'world' },
            },
            ids: ['abc-1', 'abc-2'],
        });
    });

    it('should dispatch crudGetManyAccumulate', () => {
        const children = jest.fn().mockReturnValue('child');
        const { dispatch } = renderWithRedux(
            <ReferenceArrayFieldController
                record={{ id: 1, barIds: [1, 2] }}
                resource="foo"
                reference="bar"
                source="barIds"
                basePath=""
            >
                {children}
            </ReferenceArrayFieldController>,
            {
                admin: {
                    resources: {
                        bar: {
                            data: {},
                        },
                    },
                },
            }
        );
        expect(dispatch).toBeCalledWith(crudGetManyAccumulate('bar', [1, 2]));
    });
});
