import expect from 'expect';
import removeEmpty from './removeEmpty';

describe('removeEmpty', () => {
    it('should not remove any properties with no empty values', () => {
        const obj = { foo: 'fooval', bar: 'barval' };
        expect(removeEmpty({ ...obj })).toEqual(obj);
    });

    it('should remove the empty values with empty values', () => {
        const input = { foo: '', bar: null };
        expect(removeEmpty(input)).toEqual({});
    });

    it('should remove whole empty object with a nested empty value', () => {
        const input = { foo: 'val', bar: { baz: '' } };
        expect(removeEmpty(input)).toEqual({ foo: 'val' });
    });

    it('should remove nested undefined values', () => {
        const input = { foo: 'val', bar: { baz: undefined } };
        expect(removeEmpty(input)).toEqual({ foo: 'val' });
    });

    it('should preserve dates', () => {
        const date = new Date();
        const input = { foo: 'val', bar: { baz: '' }, date };
        expect(removeEmpty(input)).toEqual({ foo: 'val', date });
    });
});
