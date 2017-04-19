import assert from 'assert';
import hiddenFieldsReducer from './hiddenFields';

describe('Hidden fields Reducer', () => {
    describe('TOGGLE_FIELD action', () => {
        it('should hide a field', () => {
            const updatedState = hiddenFieldsReducer('posts')([], {
                type: 'TOGGLE_FIELD',
                payload: 'title',
                meta: { resource: 'posts' },
            });
            assert.deepEqual(updatedState, ['title']);
        });
        it('should show a field if it is already hidden', () => {
            const updatedState = hiddenFieldsReducer('posts')(
                ['title', 'desc'],
                {
                    type: 'TOGGLE_FIELD',
                    payload: 'title',
                    meta: { resource: 'posts' },
                });
            assert.deepEqual(updatedState, ['desc']);
        });
    });
});
