import { renderHook } from 'ra-test';
import useMatchingReferences from './useGetMatchingReferences';

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

    it('should fetch matchingReferences only on mount', () => {
        const { dispatch } = renderHook(
            () => {
                return useMatchingReferences(defaultProps);
            },
            true,
            { admin: { resources: { posts: {} } } }
        );

        expect(dispatch).toBeCalledTimes(1);
        expect(dispatch.mock.calls[0][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[0][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@post_id',
            pagination: {
                perPage: 25,
                page: 1,
            },
            sort: {
                field: 'id',
                order: 'DESC',
            },
            filter: {
                q: '',
            },
        });
    });

    it('should not fetch matchingReferences on subsequent rerender', () => {
        const { dispatch, rerender } = renderHook(
            () => {
                return useMatchingReferences(defaultProps);
            },
            true,
            { admin: { resources: { posts: {} } } }
        );

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

    it('should fetch matchingReferences when the filter prop changes', () => {
        const { dispatch, rerender } = renderHook(
            () => {
                return useMatchingReferences(defaultProps);
            },
            true,
            { admin: { resources: { posts: {} } } }
        );

        expect(dispatch).toBeCalledTimes(1);
        expect(dispatch.mock.calls[0][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[0][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@post_id',
            pagination: {
                perPage: 25,
                page: 1,
            },
            sort: {
                field: 'id',
                order: 'DESC',
            },
            filter: {
                q: '',
            },
        });

        rerender(() => {
            return useMatchingReferences({
                ...defaultProps,
                filter: { q: 'typing' },
            });
        });
        expect(dispatch).toBeCalledTimes(2);
        expect(dispatch.mock.calls[1][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[1][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@post_id',
            pagination: {
                perPage: 25,
                page: 1,
            },
            sort: {
                field: 'id',
                order: 'DESC',
            },
            filter: {
                q: 'typing',
            },
        });
    });

    it('should refetch matchingReferences when the reference prop changes', () => {
        const { dispatch, rerender } = renderHook(
            () => {
                return useMatchingReferences(defaultProps);
            },
            true,
            { admin: { resources: { posts: {}, blog_posts: {} } } }
        );

        expect(dispatch).toBeCalledTimes(1);
        expect(dispatch.mock.calls[0][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[0][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@post_id',
            pagination: {
                perPage: 25,
                page: 1,
            },
            sort: {
                field: 'id',
                order: 'DESC',
            },
            filter: {
                q: '',
            },
        });

        rerender(() => {
            return useMatchingReferences({
                ...defaultProps,
                reference: 'blog_posts',
            });
        });
        expect(dispatch).toBeCalledTimes(2);
        expect(dispatch.mock.calls[1][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[1][0].meta.accumulateKey)
        ).toEqual({
            resource: 'blog_posts',
            relatedTo: 'comments@post_id',
            pagination: {
                perPage: 25,
                page: 1,
            },
            sort: {
                field: 'id',
                order: 'DESC',
            },
            filter: {
                q: '',
            },
        });
    });

    it('should refetch matchingReferences when the resource prop changes', () => {
        const { dispatch, rerender } = renderHook(
            () => {
                return useMatchingReferences(defaultProps);
            },
            true,
            { admin: { resources: { posts: {} } } }
        );

        expect(dispatch).toBeCalledTimes(1);
        expect(dispatch.mock.calls[0][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[0][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@post_id',
            pagination: {
                perPage: 25,
                page: 1,
            },
            sort: {
                field: 'id',
                order: 'DESC',
            },
            filter: {
                q: '',
            },
        });

        rerender(() => {
            return useMatchingReferences({ ...defaultProps, resource: 'note' });
        });
        expect(dispatch).toBeCalledTimes(2);
        expect(dispatch.mock.calls[1][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[1][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'note@post_id',
            pagination: {
                perPage: 25,
                page: 1,
            },
            sort: {
                field: 'id',
                order: 'DESC',
            },
            filter: {
                q: '',
            },
        });
    });

    it('should refetch matchingReferences when the source prop changes', () => {
        const { dispatch, rerender } = renderHook(
            () => {
                return useMatchingReferences(defaultProps);
            },
            true,
            { admin: { resources: { posts: {} } } }
        );

        expect(dispatch).toBeCalledTimes(1);
        expect(dispatch.mock.calls[0][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[0][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@post_id',
            pagination: {
                perPage: 25,
                page: 1,
            },
            sort: {
                field: 'id',
                order: 'DESC',
            },
            filter: {
                q: '',
            },
        });

        rerender(() => {
            return useMatchingReferences({
                ...defaultProps,
                source: 'blog_posts_id',
            });
        });
        expect(dispatch).toBeCalledTimes(2);
        expect(dispatch.mock.calls[1][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[1][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@blog_posts_id',
            pagination: {
                perPage: 25,
                page: 1,
            },
            sort: {
                field: 'id',
                order: 'DESC',
            },
            filter: {
                q: '',
            },
        });
    });

    it('should refetch matchingReferences when the pagination.page prop changes', () => {
        const { dispatch, rerender } = renderHook(
            () => {
                return useMatchingReferences(defaultProps);
            },
            true,
            { admin: { resources: { posts: {} } } }
        );

        expect(dispatch).toBeCalledTimes(1);
        expect(dispatch.mock.calls[0][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[0][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@post_id',
            pagination: {
                perPage: 25,
                page: 1,
            },
            sort: {
                field: 'id',
                order: 'DESC',
            },
            filter: {
                q: '',
            },
        });

        rerender(() => {
            return useMatchingReferences({
                ...defaultProps,
                pagination: {
                    perPage: 25,
                    page: 2,
                },
            });
        });
        expect(dispatch).toBeCalledTimes(2);
        expect(dispatch.mock.calls[1][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[1][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@post_id',
            pagination: {
                perPage: 25,
                page: 2,
            },
            sort: {
                field: 'id',
                order: 'DESC',
            },
            filter: {
                q: '',
            },
        });
    });

    it('should refetch matchingReferences when the pagination.pagination prop changes', () => {
        const { dispatch, rerender } = renderHook(
            () => {
                return useMatchingReferences(defaultProps);
            },
            true,
            { admin: { resources: { posts: {} } } }
        );

        expect(dispatch).toBeCalledTimes(1);
        expect(dispatch.mock.calls[0][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[0][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@post_id',
            pagination: {
                perPage: 25,
                page: 1,
            },
            sort: {
                field: 'id',
                order: 'DESC',
            },
            filter: {
                q: '',
            },
        });

        rerender(() => {
            return useMatchingReferences({
                ...defaultProps,
                pagination: {
                    perPage: 50,
                    page: 1,
                },
            });
        });
        expect(dispatch).toBeCalledTimes(2);
        expect(dispatch.mock.calls[1][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[1][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@post_id',
            pagination: {
                perPage: 50,
                page: 1,
            },
            sort: {
                field: 'id',
                order: 'DESC',
            },
            filter: {
                q: '',
            },
        });
    });

    it('should refetch matchingReferences when the sort.field prop changes', () => {
        const { dispatch, rerender } = renderHook(
            () => {
                return useMatchingReferences(defaultProps);
            },
            true,
            { admin: { resources: { posts: {} } } }
        );

        expect(dispatch).toBeCalledTimes(1);
        expect(dispatch.mock.calls[0][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[0][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@post_id',
            pagination: {
                perPage: 25,
                page: 1,
            },
            sort: {
                field: 'id',
                order: 'DESC',
            },
            filter: {
                q: '',
            },
        });

        rerender(() => {
            return useMatchingReferences({
                ...defaultProps,
                sort: {
                    field: 'uid',
                    order: 'DESC',
                },
            });
        });
        expect(dispatch).toBeCalledTimes(2);
        expect(dispatch.mock.calls[1][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[1][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@post_id',
            pagination: {
                perPage: 25,
                page: 1,
            },
            sort: {
                field: 'uid',
                order: 'DESC',
            },
            filter: {
                q: '',
            },
        });
    });

    it('should refetch matchingReferences when the sort.order prop changes', () => {
        const { dispatch, rerender } = renderHook(
            () => {
                return useMatchingReferences(defaultProps);
            },
            true,
            { admin: { resources: { posts: {} } } }
        );

        expect(dispatch).toBeCalledTimes(1);
        expect(dispatch.mock.calls[0][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[0][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@post_id',
            pagination: {
                perPage: 25,
                page: 1,
            },
            sort: {
                field: 'id',
                order: 'DESC',
            },
            filter: {
                q: '',
            },
        });

        rerender(() => {
            return useMatchingReferences({
                ...defaultProps,
                sort: {
                    field: 'id',
                    order: 'ASC',
                },
            });
        });
        expect(dispatch).toBeCalledTimes(2);
        expect(dispatch.mock.calls[1][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
        expect(
            JSON.parse(dispatch.mock.calls[1][0].meta.accumulateKey)
        ).toEqual({
            resource: 'posts',
            relatedTo: 'comments@post_id',
            pagination: {
                perPage: 25,
                page: 1,
            },
            sort: {
                field: 'id',
                order: 'ASC',
            },
            filter: {
                q: '',
            },
        });
    });

    it('should pass matching references from redux state to its children', () => {
        const { hookValue } = renderHook(
            () => {
                return useMatchingReferences(defaultProps);
            },
            true,
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

        expect(hookValue.matchingReferences).toEqual([{ id: 2 }, { id: 1 }]);

        expect(hookValue.loading).toBe(false);
        expect(hookValue.error).toBe(null);
    });

    it('should pass an error if an error is in redux state', () => {
        const { hookValue } = renderHook(
            () => {
                return useMatchingReferences(defaultProps);
            },
            true,
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

        expect(hookValue.matchingReferences).toBe(null);

        expect(hookValue.loading).toBe(false);
        expect(hookValue.error).toBe('Something bad happened');
    });

    it('should pass loading true if no matching reference yet', () => {
        const { hookValue } = renderHook(
            () => {
                return useMatchingReferences(defaultProps);
            },
            true,
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

        expect(hookValue.matchingReferences).toBe(null);

        expect(hookValue.loading).toBe(true);
        expect(hookValue.error).toBe(null);
    });
});
