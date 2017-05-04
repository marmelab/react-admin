import assert from 'assert';
import { required, minLength, maxLength, minValue, maxValue, number, regex, email, choices } from './validate';

describe('Validators', () => {
    const test = (validator, inputs, message) =>
        assert.deepEqual(
            inputs
                .map(input => validator(input, null, { translate: x => x }))
                .filter(m => m === message)
            ,
            Array.apply(null, Array(inputs.length)).map(x => message)
        );

    describe('required', () => {
        it('should return undefined if the value is not empty', () => {
            test(required, ['foo', 12], undefined);
        });
        it('should return an error message if the value is empty', () => {
            test(required, [undefined, '', null], 'aor.validation.required');
        });
    });
    describe('minLength', () => {
        it('should return undefined if the value is empty', () => {
            test(minLength(5), [undefined, '', null], undefined);
        });
        it('should return undefined if the value is not a string', () => {
            test(minLength(5), [1234, 123456], undefined);
        });
        it('should return undefined if the value has equal or higher length than the given minimum', () => {
            test(minLength(5), ['12345', '123456'], undefined);
        });
        it('should return an error message if the value has smaller length than the given minimum', () => {
            test(minLength(5), ['1234', '12'], 'aor.validation.minLength');
        });
    });
    describe('maxLength', () => {
        it('should return undefined if the value is empty', () => {
            test(maxLength(5), [undefined, '', null], undefined);
        });
        it('should return undefined if the value is not a string', () => {
            test(maxLength(5), [1234, 123456], undefined);
        });
        it('should return undefined if the value has equal or smaller length than the given maximum', () => {
            test(maxLength(5), ['12345', '123'], undefined);
        });
        it('should return an error message if the value has higher length than the given maximum', () => {
            test(maxLength(10), ['12345678901'], 'aor.validation.maxLength');
        });
    });
    describe('minValue', () => {
        it('should return undefined if the value is empty', () => {
            test(minValue(5), [undefined, '', null], undefined);
        });
        it('should return undefined if the value is equal or higher than the given minimum', () => {
            test(minValue(5), [5, 10, 5.5, '10'], undefined);
        });
        it('should return an error message if the value is lower than the given minimum', () => {
            test(minValue(10), [1, 9.5, '5'], 'aor.validation.minValue');
        });
    });
    describe('maxValue', () => {
        it('should return undefined if the value is empty', () => {
            test(maxValue(5), [undefined, '', null], undefined);
        });
        it('should return undefined if the value is equal or less than the given maximum', () => {
            test(maxValue(5), [5, 4, 4.5, '4'], undefined);
        });
        it('should return an error message if the value is higher than the given maximum', () => {
            test(maxValue(10), [11, 10.5, '11'], 'aor.validation.maxValue');
        });
    });
    describe('number', () => {
        it('should return undefined if the value is empty', () => {
            test(number, [undefined, '', null], undefined);
        });
        it('should return undefined if the value is a number', () => {
            test(number, [123, '123', new Date(), 0, 2.5, -5], undefined);
        });
        it('should return an error message if the value is not a number', () => {
            test(number, ['foo'], 'aor.validation.number');
        });
    });
    describe('regex', () => {
        it('should return undefined if the value is empty', () => {
            test(regex(/foo/, 'not foo'), [undefined, '', null], undefined);
        });
        it('should return undefined if the value is not a string', () => {
            test(regex(/foo/, 'not foo'), [1234, new Date()], undefined);
        });
        it('should return undefined if the value matches the pattern', () => {
            test(regex(/foo/, 'not foo'), ['foobar', 'barfoo', 'barfoobar', 'foofoo'], undefined);
        });
        it('should return an error message if the value does not match the pattern', () => {
            test(regex(/foo/, 'not foo'), ['bar', 'barfo', 'hello, world'], 'not foo');
        });
    });
    describe('email', () => {
        it('should return undefined if the value is empty', () => {
            test(email, [undefined, '', null], undefined);
        });
        it('should return undefined if the value is not a string', () => {
            test(email, [1234, new Date()], undefined);
        });
        it('should return undefined if the value is a valid email', () => {
            test(email, ['foo@bar.com', 'john.doe@mydomain.co.uk'], undefined);
        });
        it('should return an error if the value is not a valid email', () => {
            test(email, ['foo@bar', 'hello, world'], 'aor.validation.email');
        });
    });
    describe('choices', () => {
        it('should return undefined if the value is empty', () => {
            test(choices([1, 2], 'error'), [undefined, '', null], undefined);
        });
        it('should return undefined if the value is in the choice list', () => {
            test(choices([1, 2], 'error'), [1, 2], undefined);
        });
        it('should return an error message if the value is not in the choice list', () => {
            test(choices([1, 2], 'error'), ['hello', 3], 'error');
        });
    });
});
