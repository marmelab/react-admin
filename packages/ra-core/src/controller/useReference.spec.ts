import renderHook from '../util/renderHook';
import useReference from './useReference';
import { cleanup } from 'react-testing-library';

describe('useReference', () => {
    const defaultProps = {
        id: '1',
        reference: 'posts',
        allowEmpty: false,
    };

    afterEach(cleanup);

    it('should fetch reference on mount', () => {
        const { dispatch, rerender } = renderHook(() => {
            return useReference(defaultProps);
        });

        expect(dispatch).toBeCalledTimes(1);
        expect(dispatch.mock.calls[0][0].type).toBe(
            'RA/CRUD_GET_MANY_ACCUMULATE'
        );

        rerender(() => {
            return useReference(defaultProps);
        });
        expect(dispatch).toBeCalledTimes(1);
    });

    it('should refetch reference when id changes', () => {
        const { dispatch, rerender } = renderHook(() => {
            return useReference(defaultProps);
        });

        expect(dispatch).toBeCalledTimes(1);
        expect(dispatch.mock.calls[0][0].type).toBe(
            'RA/CRUD_GET_MANY_ACCUMULATE'
        );
        expect(dispatch.mock.calls[0][0].payload).toEqual({
            ids: ['1'],
            resource: 'posts',
        });
        rerender(() => {
            return useReference({ ...defaultProps, id: '2' });
        });

        expect(dispatch).toBeCalledTimes(2);
        expect(dispatch.mock.calls[1][0].type).toBe(
            'RA/CRUD_GET_MANY_ACCUMULATE'
        );
        expect(dispatch.mock.calls[1][0].payload).toEqual({
            ids: ['2'],
            resource: 'posts',
        });
    });

    it('should refetch reference when reference prop changes', () => {
        const { dispatch, rerender } = renderHook(() => {
            return useReference(defaultProps);
        });

        expect(dispatch).toBeCalledTimes(1);
        expect(dispatch.mock.calls[0][0].type).toBe(
            'RA/CRUD_GET_MANY_ACCUMULATE'
        );
        expect(dispatch.mock.calls[0][0].payload).toEqual({
            ids: ['1'],
            resource: 'posts',
        });
        rerender(() => {
            return useReference({ ...defaultProps, reference: 'comments' });
        });

        expect(dispatch).toBeCalledTimes(2);
        expect(dispatch.mock.calls[1][0].type).toBe(
            'RA/CRUD_GET_MANY_ACCUMULATE'
        );
        expect(dispatch.mock.calls[1][0].payload).toEqual({
            ids: ['1'],
            resource: 'comments',
        });
    });

    it('it should not refetch reference when allowEmpty change', () => {
        const { dispatch, rerender } = renderHook(() => {
            return useReference(defaultProps);
        });

        expect(dispatch).toBeCalledTimes(1);
        expect(dispatch.mock.calls[0][0].type).toBe(
            'RA/CRUD_GET_MANY_ACCUMULATE'
        );
        expect(dispatch.mock.calls[0][0].payload).toEqual({
            ids: ['1'],
            resource: 'posts',
        });
        rerender(() => {
            return useReference({ ...defaultProps, allowEmpty: true });
        });

        expect(dispatch).toBeCalledTimes(1);
    });

    it('should retrieve referenceRecord from redux state', () => {
        const { hookValue } = renderHook(
            () => {
                return useReference(defaultProps);
            },
            true,
            {
                admin: {
                    resources: {
                        posts: { data: { 1: { id: 1 }, 2: { id: 2 } } },
                    },
                },
            }
        );

        expect(hookValue).toEqual({
            referenceRecord: { id: 1 },
            loading: false,
            loaded: true,
        });
    });

    it('should set loading to true if no referenceRecord yet', () => {
        const { hookValue } = renderHook(
            () => {
                return useReference(defaultProps);
            },
            true,
            {
                admin: {
                    resources: {
                        posts: { data: {} },
                    },
                },
            }
        );

        expect(hookValue).toEqual({
            referenceRecord: undefined,
            loading: true,
            loaded: false,
        });
    });

    it('should set loading to false even if no referenceRecord yet when allowEmpty is true', () => {
        const { hookValue } = renderHook(
            () => {
                return useReference({ ...defaultProps, allowEmpty: true });
            },
            true,
            {
                admin: {
                    resources: {
                        posts: { data: {} },
                    },
                },
            }
        );

        expect(hookValue).toEqual({
            referenceRecord: undefined,
            loading: false,
            loaded: true,
        });
    });
});
