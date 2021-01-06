import getValuesFromRecords from './getValuesFromRecords';

describe('getValuesFromRecords', () => {
    it('should return an empty object when passed no record', () => {
        expect(getValuesFromRecords([])).toEqual({});
    });

    it('should return a list of values indexed by key', () => {
        const now = new Date();
        const records = [
            { id: 1, foo: 'bar', dob: now },
            { id: 2, foo: 'baz', dob: now },
        ];
        expect(getValuesFromRecords(records)).toEqual({
            id: [1, 2],
            foo: ['bar', 'baz'],
            dob: [now, now],
        });
    });

    it('should accept records with variable fields', () => {
        const records = [
            { a: 1, b: 1, c: 1 },
            { b: 2, c: 2, d: 2 },
        ];
        expect(getValuesFromRecords(records)).toEqual({
            a: [1],
            b: [1, 2],
            c: [1, 2],
            d: [2],
        });
    });

    it('should keep duplicate values', () => {
        const records = [
            { a: 1, b: 1 },
            { a: 1, b: 1 },
        ];
        expect(getValuesFromRecords(records)).toEqual({
            a: [1, 1],
            b: [1, 1],
        });
    });
});
