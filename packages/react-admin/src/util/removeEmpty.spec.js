import assert from 'assert';
import removeEmpty from './removeEmpty';

describe('removeEmpty', () => {
    test('should not remove any properties with no empty values', () => {
        const obj = { foo: 'fooval', bar: 'barval' };
        assert.deepEqual(removeEmpty({ ...obj }), obj);
    });

    test('should remove the empty values with empty values', () => {
        const input = { foo: '', bar: null };
        assert.deepEqual(removeEmpty(input), {});
    });

    test('should remove whole empty object with a nested empty value', () => {
        const input = { foo: 'val', bar: { baz: '' } };
        assert.deepEqual(removeEmpty(input), { foo: 'val' });
    });

    test('should preserve dates', () => {
        const date = new Date();
        const input = { foo: 'val', bar: { baz: '' }, date };
        assert.deepEqual(removeEmpty(input), { foo: 'val', date });
    });
});
