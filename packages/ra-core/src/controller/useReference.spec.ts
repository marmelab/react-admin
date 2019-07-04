import renderHookWithRedux from '../util/renderHookWithRedux';
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
        const { dispatch, rerender } = renderHookWithRedux(() => {
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

    it('should refetch reference when id change', () => {
        const { dispatch, rerender } = renderHookWithRedux(() => {
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

    it('should refetch reference when reference prop change', () => {
        const { dispatch, rerender } = renderHookWithRedux(() => {
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

    it('should pass referenceRecord from redux state to its children', () => {
        const { childrenProps } = renderHookWithRedux(
            () => {
                return useReference(defaultProps);
            },
            {
                admin: {
                    resources: {
                        posts: { data: { 1: { id: 1 }, 2: { id: 2 } } },
                    },
                },
            }
        );

        expect(childrenProps).toEqual({
            referenceRecord: { id: 1 },
            isLoading: false,
        });
    });

    it('should set isLoading to true if no referenceRecord yet', () => {
        const { childrenProps } = renderHookWithRedux(
            () => {
                return useReference(defaultProps);
            },
            {
                admin: {
                    resources: {
                        posts: { data: {} },
                    },
                },
            }
        );

        expect(childrenProps).toEqual({
            referenceRecord: undefined,
            isLoading: true,
        });
    });

    it('should set isLoading to false even if no referenceRecord yet when allowEmpty is true', () => {
        const { childrenProps } = renderHookWithRedux(
            () => {
                return useReference({ ...defaultProps, allowEmpty: true });
            },
            {
                admin: {
                    resources: {
                        posts: { data: {} },
                    },
                },
            }
        );

        expect(childrenProps).toEqual({
            referenceRecord: undefined,
            isLoading: false,
        });
    });
});
