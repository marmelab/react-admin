import expect from 'expect';

import oneToManyReducer, { nameRelatedTo } from './oneToMany';
import { DELETE, DELETE_MANY } from '../../../core';
import { UNDOABLE } from '../../../actions';

describe('oneToMany', () => {
    describe('oneToMany', () => {
        it('should name relation based on reference, id, resource and target', () => {
            expect(
                nameRelatedTo('reference', 'id', 'resource', 'target')
            ).toEqual('resource_reference@target_id');
            expect(nameRelatedTo('comments', '6', 'posts', 'id')).toEqual(
                'posts_comments@id_6'
            );
        });

        it('should incorporate filter to the name if any', () => {
            expect(
                nameRelatedTo('reference', 'id', 'resource', 'target', {
                    filter1: 'value1',
                    filter2: false,
                })
            ).toEqual(
                'resource_reference@target_id?filter1="value1"&filter2=false'
            );
            expect(
                nameRelatedTo('comments', '6', 'posts', 'id', {
                    active: true,
                })
            ).toEqual('posts_comments@id_6?active=true');
        });

        it('should remove reference deleted optimistically', () => {
            const previousState = {
                'posts_comments@id_1': {
                    ids: [1, 2, 3],
                    total: 3,
                },
                'reviews_comments@id_1': {
                    ids: [1, 3, 4],
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
                    ids: [1, 3, 4],
                    total: 3,
                },
                'posts_reviews@id_1': {
                    ids: [1, 2, 3],
                    total: 3,
                },
            });
        });

        it('should remove references deleted optimistically', () => {
            const previousState = {
                'posts_comments@id_1': {
                    ids: [1, 2, 3],
                    total: 3,
                },
                'reviews_comments@id_1': {
                    ids: [1, 3, 4],
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
                    ids: [2, 3],
                },
                meta: {
                    resource: 'comments',
                    optimistic: true,
                    fetch: DELETE_MANY,
                },
            });

            expect(state).toEqual({
                'posts_comments@id_1': {
                    ids: [1],
                    total: 1,
                },
                'reviews_comments@id_1': {
                    ids: [1, 4],
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
