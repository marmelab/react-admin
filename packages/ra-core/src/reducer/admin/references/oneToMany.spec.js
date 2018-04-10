import assert from 'assert';

import { nameRelatedTo } from './oneToMany';

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
    });
});
