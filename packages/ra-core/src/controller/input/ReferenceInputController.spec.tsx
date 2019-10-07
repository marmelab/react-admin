import React, { useState, useCallback } from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import omit from 'lodash/omit';
import expect from 'expect';

import renderWithRedux from '../../util/renderWithRedux';
import ReferenceInputController from './ReferenceInputController';
import { DataProviderContext } from '../../dataProvider';
import { crudGetMatching } from '../../actions';

describe('<ReferenceInputController />', () => {
    const defaultProps = {
        basePath: '/comments',
        children: jest.fn(),
        input: { value: undefined } as any,
        onChange: jest.fn(),
        reference: 'posts',
        resource: 'comments',
        source: 'post_id',
    };

    afterEach(cleanup);

    it('should fetch reference matchingReferences, and provide filter pagination and sort', async () => {
        const children = jest.fn().mockReturnValue(<p>child</p>);
        const dataProvider = {
            getMany: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'foo' }] })
            ),
        };
        const { dispatch } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <ReferenceInputController
                    {...{
                        ...defaultProps,
                        input: { value: 1 } as any,
                        loading: true,
                        sort: { field: 'title', order: 'ASC' },
                    }}
                >
                    {children}
                </ReferenceInputController>
            </DataProviderContext.Provider>,
            {
                admin: {
                    resources: { posts: { data: { 1: { id: 1 } } } },
                    references: {
                        possibleValues: { 'comments@post_id': [2, 1] },
                    },
                },
            }
        );

        expect(
            omit(children.mock.calls[0][0], [
                'onChange',
                'setPagination',
                'setFilter',
                'setSort',
            ])
        ).toEqual({
            choices: [{ id: 1 }],
            error: null,
            filter: { q: '' },
            loading: false,
            pagination: { page: 1, perPage: 25 },
            sort: { field: 'title', order: 'ASC' },
            warning: null,
        });
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(dispatch).toBeCalledTimes(6);
        expect(dispatch.mock.calls[0][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(dispatch.mock.calls[0][0].meta.accumulate()).toEqual(
            crudGetMatching(
                'posts',
                'comments@post_id',
                { page: 1, perPage: 25 },
                { field: 'title', order: 'ASC' },
                { q: '' }
            )
        );
        expect(dispatch.mock.calls[1][0].type).toBe('RA/CRUD_GET_MANY');
    });

    it('should refetch reference matchingReferences when its props change', async () => {
        const children = jest.fn().mockReturnValue(<p>child</p>);
        const dataProvider = {
            getMany: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'foo' }] })
            ),
        };

        const Component = () => {
            const [sort, setSort] = useState({ field: 'title', order: 'ASC' });
            const handleClick = useCallback(
                () => setSort({ field: 'body', order: 'DESC' }),
                [setSort]
            );
            return (
                <>
                    <button aria-label="Change sort" onClick={handleClick} />
                    <ReferenceInputController
                        {...{
                            ...defaultProps,
                            input: { value: 1 } as any,
                            loading: true,
                            sort,
                        }}
                    >
                        {children}
                    </ReferenceInputController>
                </>
            );
        };
        const { getByLabelText, dispatch } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <Component />
            </DataProviderContext.Provider>,
            {
                admin: {
                    resources: { posts: { data: { 1: { id: 1 } } } },
                    references: {
                        possibleValues: { 'comments@post_id': [2, 1] },
                    },
                },
            }
        );

        await new Promise(resolve => setTimeout(resolve, 100));
        expect(dispatch.mock.calls[0][0].meta.accumulate()).toEqual(
            crudGetMatching(
                'posts',
                'comments@post_id',
                { page: 1, perPage: 25 },
                { field: 'title', order: 'ASC' },
                { q: '' }
            )
        );
        fireEvent.click(getByLabelText('Change sort'));
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(
            dispatch.mock.calls[
                dispatch.mock.calls.length - 1
            ][0].meta.accumulate()
        ).toEqual(
            crudGetMatching(
                'posts',
                'comments@post_id',
                { page: 1, perPage: 25 },
                { field: 'body', order: 'DESC' },
                { q: '' }
            )
        );
    });
});
