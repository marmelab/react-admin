import assert from 'assert';

import { nameRelatedTo, getReferencesByIds } from './oneToMany';

describe('oneToMany', () => {
    describe('nameRelatedTo', () => {
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
    });

    describe('getReferencesByIds', () => {
        const state = {
            admin: {
                resources: {
                    reference: { data: { 1: { id: 1 }, 2: { id: 2 } } },
                },
            },
        };
        it('should return an empty object if ids are empty.', () => {
            assert.deepEqual(getReferencesByIds(state, 'reference', []), {});
        });

        it('should return null if no reference has data.', () => {
            assert.equal(getReferencesByIds(state, 'reference', [3, 4]), null);
        });

        it('should return references data even though not all of them are there.', () => {
            assert.deepEqual(
                getReferencesByIds(state, 'reference', [1, 2, 3]),
                { 1: { id: 1 }, 2: { id: 2 } }
            );
        });
    });
});
