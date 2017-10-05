import assert from 'assert';
import reducer, {
    initialState,
    nameRelatedTo,
    getRelatedTo,
} from './oneToMany';

describe('one to many reducer', () => {
    it('should return initial state by default', () => {
        assert.deepEqual(initialState, reducer(undefined, {}));
    });
});

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

describe('one to many selectors', () => {
    const state = {
        nameRelatedTo: [1],
    };

    describe('getRelatedTo', () => {
        it('should return an array of ids when a resource is found', () => {
            assert.deepEqual(
                getRelatedTo(state, { relatedTo: 'nameRelatedTo' }),
                [1]
            );
        });
    });
});
