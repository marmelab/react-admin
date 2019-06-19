import renderHookWithRedux from '../../util/renderHookWithRedux';
import useMatchingReferences from './useMatchingReferences';
import { cleanup } from 'react-testing-library';

describe('useMatchingReferences', () => {
    const defaultProps = {
        reference: 'posts',
        resource: 'comments',
        source: 'post_id',
        filter: { q: '' },
        pagination: {
            perPage: 25,
            page: 1,
        },
        sort: { field: 'id', order: 'DESC' },
        referenceSource: undefined,
    };

    afterEach(cleanup);

    it('should fetch matchingReferences on mount', () => {
        const { dispatch, rerender } = renderHookWithRedux(() => {
            return useMatchingReferences(defaultProps);
        });

        expect(dispatch).toBeCalledTimes(1);
        expect(dispatch.mock.calls[0][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[0][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@post_id',
            pagination:{
                perPage:25,
                page:1
            },
            sort:{
                field: 'id',
                order: 'DESC'
            },
            filter:{
                q: ''
            }
        });

        rerender(() => {
            return useMatchingReferences({
                reference: 'posts',
                resource: 'comments',
                source: 'post_id',
                filter: { q: '' },
                pagination: {
                    perPage: 25,
                    page: 1,
                },
                sort: { field: 'id', order: 'DESC' },
                referenceSource: undefined,
            }); // deep but not shallow equal
        });
        expect(dispatch).toBeCalledTimes(1);
    });

    it('should fetch matchingReferences when filter change', () => {
        const { dispatch, rerender } = renderHookWithRedux(() => {
            return useMatchingReferences(defaultProps);
        });

        expect(dispatch).toBeCalledTimes(1);
        expect(dispatch.mock.calls[0][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[0][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@post_id',
            pagination:{
                perPage:25,
                page:1
            },
            sort:{
                field: 'id',
                order: 'DESC'
            },
            filter:{
                q: ''
            }
        });

        rerender(() => {
            return useMatchingReferences({...defaultProps, filter: { q: 'typing' } });
        });
        expect(dispatch).toBeCalledTimes(2);expect(dispatch.mock.calls[1][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[1][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@post_id',
            pagination:{
                perPage:25,
                page:1
            },
            sort:{
                field: 'id',
                order: 'DESC'
            },
            filter:{
                q: 'typing'
            }
        });
    });

    it('should refetch matchingReferences when reference change', () => {
        const { dispatch, rerender } = renderHookWithRedux(() => {
            return useMatchingReferences(defaultProps);
        });

        expect(dispatch).toBeCalledTimes(1);
        expect(dispatch.mock.calls[0][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[0][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@post_id',
            pagination:{
                perPage:25,
                page:1
            },
            sort:{
                field: 'id',
                order: 'DESC'
            },
            filter:{
                q: ''
            }
        });

        rerender(() => {
            return useMatchingReferences({...defaultProps, reference: 'blog_posts' });
        });
        expect(dispatch).toBeCalledTimes(2);expect(dispatch.mock.calls[1][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[1][0].meta.accumulateKey)
        ).toEqual({
            resource: 'blog_posts',
            relatedTo: 'comments@post_id',
            pagination:{
                perPage:25,
                page:1
            },
            sort:{
                field: 'id',
                order: 'DESC'
            },
            filter:{
                q: ''
            }
        });
    });

    it('should refetch matchingReferences when resource change', () => {
        const { dispatch, rerender } = renderHookWithRedux(() => {
            return useMatchingReferences(defaultProps);
        });

        expect(dispatch).toBeCalledTimes(1);
        expect(dispatch.mock.calls[0][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[0][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@post_id',
            pagination:{
                perPage:25,
                page:1
            },
            sort:{
                field: 'id',
                order: 'DESC'
            },
            filter:{
                q: ''
            }
        });

        rerender(() => {
            return useMatchingReferences({...defaultProps, resource: 'note' });
        });
        expect(dispatch).toBeCalledTimes(2);expect(dispatch.mock.calls[1][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[1][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'note@post_id',
            pagination:{
                perPage:25,
                page:1
            },
            sort:{
                field: 'id',
                order: 'DESC'
            },
            filter:{
                q: ''
            }
        });
    });

    it('should refetch matchingReferences when source change', () => {
        const { dispatch, rerender } = renderHookWithRedux(() => {
            return useMatchingReferences(defaultProps);
        });

        expect(dispatch).toBeCalledTimes(1);
        expect(dispatch.mock.calls[0][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[0][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@post_id',
            pagination:{
                perPage:25,
                page:1
            },
            sort:{
                field: 'id',
                order: 'DESC'
            },
            filter:{
                q: ''
            }
        });

        rerender(() => {
            return useMatchingReferences({...defaultProps, source: 'blog_posts_id' });
        });
        expect(dispatch).toBeCalledTimes(2);expect(dispatch.mock.calls[1][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[1][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@blog_posts_id',
            pagination:{
                perPage:25,
                page:1
            },
            sort:{
                field: 'id',
                order: 'DESC'
            },
            filter:{
                q: ''
            }
        });
    });

    it('should refetch matchingReferences when pagination.page change', () => {
        const { dispatch, rerender } = renderHookWithRedux(() => {
            return useMatchingReferences(defaultProps);
        });

        expect(dispatch).toBeCalledTimes(1);
        expect(dispatch.mock.calls[0][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[0][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@post_id',
            pagination:{
                perPage:25,
                page:1
            },
            sort:{
                field: 'id',
                order: 'DESC'
            },
            filter:{
                q: ''
            }
        });

        rerender(() => {
            return useMatchingReferences({...defaultProps, pagination: {
                perPage: 25,
                page: 2,
            } });
        });
        expect(dispatch).toBeCalledTimes(2);expect(dispatch.mock.calls[1][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[1][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@post_id',
            pagination:{
                perPage:25,
                page: 2,
            },
            sort:{
                field: 'id',
                order: 'DESC'
            },
            filter:{
                q: ''
            }
        });
    });

    it('should refetch matchingReferences when pagination.pagination change', () => {
        const { dispatch, rerender } = renderHookWithRedux(() => {
            return useMatchingReferences(defaultProps);
        });

        expect(dispatch).toBeCalledTimes(1);
        expect(dispatch.mock.calls[0][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[0][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@post_id',
            pagination:{
                perPage:25,
                page:1
            },
            sort:{
                field: 'id',
                order: 'DESC'
            },
            filter:{
                q: ''
            }
        });

        rerender(() => {
            return useMatchingReferences({...defaultProps, pagination: {
                perPage: 50,
                page: 1,
            } });
        });
        expect(dispatch).toBeCalledTimes(2);expect(dispatch.mock.calls[1][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[1][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@post_id',
            pagination:{
                perPage:50,
                page: 1,
            },
            sort:{
                field: 'id',
                order: 'DESC'
            },
            filter:{
                q: ''
            }
        });
    });

    it('should refetch matchingReferences when sort.field change', () => {
        const { dispatch, rerender } = renderHookWithRedux(() => {
            return useMatchingReferences(defaultProps);
        });

        expect(dispatch).toBeCalledTimes(1);
        expect(dispatch.mock.calls[0][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[0][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@post_id',
            pagination:{
                perPage:25,
                page:1
            },
            sort:{
                field: 'id',
                order: 'DESC'
            },
            filter:{
                q: ''
            }
        });

        rerender(() => {
            return useMatchingReferences({...defaultProps, sort:{
                field: 'uid',
                order: 'DESC'
            } });
        });
        expect(dispatch).toBeCalledTimes(2);expect(dispatch.mock.calls[1][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[1][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@post_id',
            pagination:{
                perPage: 25,
                page: 1,
            },
            sort:{
                field: 'uid',
                order: 'DESC'
            },
            filter:{
                q: ''
            }
        });
    });

    it('should refetch matchingReferences when sort.order change', () => {
        const { dispatch, rerender } = renderHookWithRedux(() => {
            return useMatchingReferences(defaultProps);
        });

        expect(dispatch).toBeCalledTimes(1);
        expect(dispatch.mock.calls[0][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[0][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@post_id',
            pagination:{
                perPage:25,
                page:1
            },
            sort:{
                field: 'id',
                order: 'DESC'
            },
            filter:{
                q: ''
            }
        });

        rerender(() => {
            return useMatchingReferences({ ...defaultProps, sort: {
                field: 'id',
                order: 'ASC'
            } });
        });
        expect(dispatch).toBeCalledTimes(2);expect(dispatch.mock.calls[1][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[1][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@post_id',
            pagination:{
                perPage: 25,
                page: 1,
            },
            sort:{
                field: 'id',
                order: 'ASC'
            },
            filter:{
                q: ''
            }
        });
    });

    it('should pass matching references from redux state to its children', () => {
        const { childrenProps } = renderHookWithRedux(
            () => {
                return useMatchingReferences(defaultProps);
            },
            {
                admin: {
                    resources: {
                        posts: { data: { 1: { id: 1 }, 2: { id: 2 } } },
                    },
                    references: {
                        possibleValues: { 'comments@post_id': [2, 1] },
                    },
                },
            }
        );

        expect(childrenProps.matchingReferences).toEqual([
            { id: 2 },
            { id: 1 },
        ]);

        expect(childrenProps.loading).toBe(false);
        expect(childrenProps.error).toBe(null);
    });

    it('should pass an error if an error is in redux state', () => {
        const { childrenProps } = renderHookWithRedux(
            () => {
                return useMatchingReferences(defaultProps);
            },
            {
                admin: {
                    resources: {
                        posts: { data: { 1: { id: 1 }, 2: { id: 2 } } },
                    },
                    references: {
                        possibleValues: {
                            'comments@post_id': {
                                error: 'Something bad happened',
                            },
                        },
                    },
                },
            }
        );

        expect(childrenProps.matchingReferences).toBe(null);

        expect(childrenProps.loading).toBe(false);
        expect(childrenProps.error).toBe('Something bad happened');
    });

    it('should pass loading true if no matching reference yet', () => {
        const { childrenProps } = renderHookWithRedux(
            () => {
                return useMatchingReferences(defaultProps);
            },
            {
                admin: {
                    resources: {
                        posts: { data: {} },
                    },
                    references: {
                        possibleValues: {},
                    },
                },
            }
        );

        expect(childrenProps.matchingReferences).toBe(null);

        expect(childrenProps.loading).toBe(true);
        expect(childrenProps.error).toBe(null);
    });
});
