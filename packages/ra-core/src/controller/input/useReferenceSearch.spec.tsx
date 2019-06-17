import renderHookWithRedux from '../../util/renderHookWithRedux';
import useReferenceSearch from './useReferenceSearch';
import { cleanup } from 'react-testing-library';

describe('useReferenceSearch', () => {
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
        const { dispatch } = renderHookWithRedux(() => {
            return { matchingReferences: useReferenceSearch(defaultProps) };
        });

        expect(dispatch).toBeCalledTimes(1);
        expect(dispatch.mock.calls[0][0].type).toBe(
            'RA/CRUD_GET_MATCHING_ACCUMULATE'
        );
    });

    it('should pass matching references from redux state to its children', () => {
        const { childrenProps } = renderHookWithRedux(
            () => {
                return { matchingReferences: useReferenceSearch(defaultProps) };
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
    });
});
