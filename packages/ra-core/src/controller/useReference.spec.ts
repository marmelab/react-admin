import renderHookWithRedux from '../util/renderHookWithRedux';
import useReference from './useReference';
import { cleanup } from 'react-testing-library';

describe('useReference', () => {
    const defaultProps = {
        id: 'id',
        reference: 'posts',
        allowEmpty: false,
    };

    afterEach(cleanup);

    it('should fetch references on mount', () => {
        const { dispatch } = renderHookWithRedux(() => {
            return useReference(defaultProps);
        });

        expect(dispatch).toBeCalledTimes(1);
        expect(dispatch.mock.calls[0][0].type).toBe(
            'RA/CRUD_GET_MANY_ACCUMULATE'
        );
    });

    it('should pass referenceRecord from redux state to its children', () => {
        const { childrenProps } = renderHookWithRedux(
            () => {
                return useReference(defaultProps);
            },
            {
                admin: {
                    resources: {
                        posts: { data: { id: { id: 'id' }, 2: { id: 2 } } },
                    },
                },
            }
        );

        expect(childrenProps).toEqual({
            referenceRecord: { id: 'id' },
            isLoading: false,
        });
    });

    it('should pass loading true if no referenceRecord yet', () => {
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
});
