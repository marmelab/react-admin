import assert from 'assert';
import removeEmpty from './removeEmpty';

describe('removeEmpty', () => {
    it('should not remove any properties with no empty values', () => {
        const obj = { foo: 'fooval', bar: 'barval' };
        assert.deepEqual(removeEmpty({ ...obj }), obj);
    });

    it('should remove the empty values with empty values', () => {
        const input = { foo: '', bar: null };
        assert.deepEqual(removeEmpty(input), {});
    });

    it('should remove whole empty object with a nested empty value', () => {
        const input = { foo: 'val', bar: { baz: '' } };
        assert.deepEqual(removeEmpty(input), { foo: 'val' });
    });

    it('should preserve dates', () => {
        const date = new Date();
        const input = { foo: 'val', bar: { baz: '' }, date };
        assert.deepEqual(removeEmpty(input), { foo: 'val', date });
    });
});
