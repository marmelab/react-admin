import expect from 'expect';
import sanitizeEmptyValues from './sanitizeEmptyValues';

describe('sanitizeEmptyValues', () => {
    it('should set null or undefined values to null', () => {
        expect(sanitizeEmptyValues({ foo: 23 }, {})).toEqual({ foo: null });
        expect(sanitizeEmptyValues({ foo: 'hello' }, {})).toEqual({
            foo: null,
        });
        expect(sanitizeEmptyValues({ foo: new Date() }, {})).toEqual({
            foo: null,
        });
        expect(sanitizeEmptyValues({ foo: { bar: 2 } }, {})).toEqual({
            foo: null,
        });
    });
    it('should set null or undefined deep values to null', () => {
        expect(sanitizeEmptyValues({ foo: { bar: 1 } }, { foo: {} })).toEqual({
            foo: { bar: null },
        });
    });
    it('should accept string values', () => {
        const str = 'hello';
        expect(sanitizeEmptyValues({ str: null }, { str })).toEqual({ str });
        expect(sanitizeEmptyValues({}, { str })).toEqual({ str });
    });
    it('should accept date values', () => {
        const date = new Date();
        expect(sanitizeEmptyValues({ date: null }, { date })).toEqual({ date });
        expect(sanitizeEmptyValues({}, { date })).toEqual({ date });
    });
    it('should accept array values', () => {
        const arr = [1, 2, 3];
        expect(sanitizeEmptyValues({ arr: null }, { arr })).toEqual({ arr });
        expect(sanitizeEmptyValues({}, { arr })).toEqual({ arr });
    });
    it('should accept object values', () => {
        const obj = { foo: 1 };
        expect(sanitizeEmptyValues({ obj: null }, { obj })).toEqual({ obj });
        expect(sanitizeEmptyValues({}, { obj })).toEqual({ obj });
    });
    it('should accept deep object values', () => {
        const obj = { foo: { bar: 1 } };
        expect(
            sanitizeEmptyValues({ obj: { foo: null, foo2: 2 } }, { obj })
        ).toEqual({ obj: { foo: { bar: 1 }, foo2: null } });
    });
    it("should not ignore initial value when it's not of the same type", () => {
        const initialValues = { a: 'foobar' };
        const values = { a: { hello: 'world' } };
        expect(sanitizeEmptyValues(initialValues, values)).toEqual({
            a: { hello: 'world' },
        });
        expect(sanitizeEmptyValues(values, initialValues)).toEqual({
            a: 'foobar',
        });
    });
});
