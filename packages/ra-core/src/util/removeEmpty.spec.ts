import expect from 'expect';
import removeEmpty from './removeEmpty';

describe('removeEmpty', () => {
    it('should not remove any properties with no empty values', () => {
        const obj = [
            { field: 'foo', value: 'fooval' },
            { field: 'bar', value: 'barval' },
        ];
        expect(removeEmpty(obj)).toEqual(obj);
    });

    it('should remove the empty values', () => {
        const input = [
            { field: 'foo', value: '' },
            { field: 'bar', value: null },
        ];
        expect(removeEmpty(input)).toEqual([]);
    });

    it('should remove compound keys with an empty value', () => {
        const input = [
            { field: 'foo', value: 'val' },
            { field: 'bar.baz', value: '' },
        ];
        expect(removeEmpty(input)).toEqual([{ field: 'foo', value: 'val' }]);
    });

    it('should remove nested undefined values', () => {
        const input = [
            { field: 'foo', value: 'val' },
            { field: 'bar.baz', value: undefined },
        ];
        expect(removeEmpty(input)).toEqual([{ field: 'foo', value: 'val' }]);
    });

    it('should preserve dates', () => {
        const date = new Date();
        const input = [
            { field: 'foo', value: 'val' },
            { field: 'bar.baz', value: '' },
            { field: 'date', value: date },
        ];
        expect(removeEmpty(input)).toEqual([
            { field: 'foo', value: 'val' },
            { field: 'date', value: date },
        ]);
    });
});
