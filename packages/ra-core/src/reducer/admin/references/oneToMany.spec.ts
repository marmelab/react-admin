import assert from 'assert';

import oneToManyReducer, { nameRelatedTo } from './oneToMany';
import { DELETE } from '../../../dataFetchActions';
import { UNDOABLE } from '../../../actions';

describe('oneToMany', () => {
    describe('oneToMany', () => {
        it('should name relation based on reference, id, resource and target', () => {
            assert.equal(
                nameRelatedTo('reference', 'id', 'resource', 'target'),
                'resource_reference@target_id'
            );
            assert.equal(
                nameRelatedTo('comments', '6', 'posts', 'id'),
                'posts_comments@id_6'
            );
        });

        it('should incorporate filter to the name if any', () => {
            assert.equal(
                nameRelatedTo('reference', 'id', 'resource', 'target', {
                    filter1: 'value1',
                    filter2: false,
                }),
                'resource_reference@target_id?filter1="value1"&filter2=false'
            );
            assert.equal(
                nameRelatedTo('comments', '6', 'posts', 'id', {
                    active: true,
                }),
                'posts_comments@id_6?active=true'
            );
        });

        it('should remove references deleted optimistically', () => {
            const previousState = {
                'posts_comments@id_1': {
                    ids: [1, 2, 3],
                    total: 3,
                },
                'reviews_comments@id_1': {
                    ids: [1, 2, 3],
                    total: 3,
                },
                'posts_reviews@id_1': {
                    ids: [1, 2, 3],
                    total: 3,
                },
            };

            const state = oneToManyReducer(previousState, {
                type: UNDOABLE,
                payload: {
                    id: 2,
                },
                meta: {
                    resource: 'comments',
                    optimistic: true,
                    fetch: DELETE,
                },
            });

            expect(state).toEqual({
                'posts_comments@id_1': {
                    ids: [1, 3],
                    total: 2,
                },
                'reviews_comments@id_1': {
                    ids: [1, 3],
                    total: 2,
                },
                'posts_reviews@id_1': {
                    ids: [1, 2, 3],
                    total: 3,
                },
            });
        });
    });
});
