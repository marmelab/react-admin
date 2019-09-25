import getValue from './getValue';
import expect from 'expect';

describe('getValue', () => {
    it('returns directly the value if it is not an object', () => {
        expect(getValue(10, 'foo.bar')).toEqual(10);
    });
    it('returns the value at specified path if it is an object', () => {
        expect(getValue({ foo: { bar: 10 } }, 'foo.bar')).toEqual(10);
    });
});
