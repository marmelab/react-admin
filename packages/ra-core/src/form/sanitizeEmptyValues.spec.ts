import expect from 'expect';

import { sanitizeEmptyValues } from './sanitizeEmptyValues';

describe('sanitizeEmptyValues', () => {
    it('does not fail on empty inputs', () => {
        expect(sanitizeEmptyValues({})).toEqual({});
    });
    it('should not change objects with only non-empty values', () => {
        expect(sanitizeEmptyValues({ foo: 'bar', bar: 0, baz: false })).toEqual(
            {
                foo: 'bar',
                bar: 0,
                baz: false,
            }
        );
    });
    it('should remove empty strings from input', () => {
        expect(sanitizeEmptyValues({ foo: '', bar: 'baz' })).toEqual({
            bar: 'baz',
        });
    });
    it('should not remove empty strings from input if the record had a value', () => {
        expect(
            sanitizeEmptyValues({ foo: '', bar: 'baz' }, { foo: 'foo' })
        ).toEqual({
            foo: null,
            bar: 'baz',
        });
    });
});
