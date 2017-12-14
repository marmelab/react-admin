import assert from 'assert';
import {
    required,
    minLength,
    maxLength,
    minValue,
    maxValue,
    number,
    regex,
    email,
    choices,
} from './validate';

describe('Validators', () => {
    const testValidator = (validator, inputs, message) =>
        assert.deepEqual(
            inputs
                .map(input => validator(input, null, { translate: x => x }))
                .filter(m => m === message),
            Array(...Array(inputs.length)).map(() => message)
        );

    describe('required', () => {
        test('should return undefined if the value is not empty', () => {
            testValidator(required, ['foo', 12], undefined);
        });
        test('should return an error message if the value is empty', () => {
            testValidator(
                required,
                [undefined, '', null],
                'ra.validation.required'
            );
        });
    });
    describe('minLength', () => {
        test('should return undefined if the value is empty', () => {
            testValidator(minLength(5), [undefined, '', null], undefined);
        });
        test('should return undefined if the value is not a string', () => {
            testValidator(minLength(5), [1234, 123456], undefined);
        });
        test('should return undefined if the value has equal or higher length than the given minimum', () => {
            testValidator(minLength(5), ['12345', '123456'], undefined);
        });
        test('should return an error message if the value has smaller length than the given minimum', () => {
            testValidator(
                minLength(5),
                ['1234', '12'],
                'ra.validation.minLength'
            );
        });
    });
    describe('maxLength', () => {
        test('should return undefined if the value is empty', () => {
            testValidator(maxLength(5), [undefined, '', null], undefined);
        });
        test('should return undefined if the value is not a string', () => {
            testValidator(maxLength(5), [1234, 123456], undefined);
        });
        test('should return undefined if the value has equal or smaller length than the given maximum', () => {
            testValidator(maxLength(5), ['12345', '123'], undefined);
        });
        test('should return an error message if the value has higher length than the given maximum', () => {
            testValidator(
                maxLength(10),
                ['12345678901'],
                'ra.validation.maxLength'
            );
        });
    });
    describe('minValue', () => {
        test('should return undefined if the value is empty', () => {
            testValidator(minValue(5), [undefined, '', null], undefined);
        });
        test('should return undefined if the value is equal or higher than the given minimum', () => {
            testValidator(minValue(5), [5, 10, 5.5, '10'], undefined);
        });
        test('should return an error message if the value is lower than the given minimum', () => {
            testValidator(
                minValue(10),
                [1, 9.5, '5'],
                'ra.validation.minValue'
            );
        });
        test('should return an error message if the value is 0', () => {
            testValidator(minValue(10), [0], 'ra.validation.minValue');
        });
    });
    describe('maxValue', () => {
        test('should return undefined if the value is empty', () => {
            testValidator(maxValue(5), [undefined, '', null], undefined);
        });
        test('should return undefined if the value is equal or less than the given maximum', () => {
            testValidator(maxValue(5), [5, 4, 4.5, '4'], undefined);
        });
        test('should return an error message if the value is higher than the given maximum', () => {
            testValidator(
                maxValue(10),
                [11, 10.5, '11'],
                'ra.validation.maxValue'
            );
        });
        test('should return undefined if the value is 0', () => {
            testValidator(maxValue(10), [0], undefined);
        });
    });
    describe('number', () => {
        test('should return undefined if the value is empty', () => {
            testValidator(number, [undefined, '', null], undefined);
        });
        test('should return undefined if the value is a number', () => {
            testValidator(
                number,
                [123, '123', new Date(), 0, 2.5, -5],
                undefined
            );
        });
        test('should return an error message if the value is not a number', () => {
            testValidator(number, ['foo'], 'ra.validation.number');
        });
    });
    describe('regex', () => {
        test('should return undefined if the value is empty', () => {
            testValidator(
                regex(/foo/, 'not foo'),
                [undefined, '', null],
                undefined
            );
        });
        test('should return undefined if the value is not a string', () => {
            testValidator(
                regex(/foo/, 'not foo'),
                [1234, new Date()],
                undefined
            );
        });
        test('should return undefined if the value matches the pattern', () => {
            testValidator(
                regex(/foo/, 'not foo'),
                ['foobar', 'barfoo', 'barfoobar', 'foofoo'],
                undefined
            );
        });
        test('should return an error message if the value does not match the pattern', () => {
            testValidator(
                regex(/foo/, 'not foo'),
                ['bar', 'barfo', 'hello, world'],
                'not foo'
            );
        });
    });
    describe('email', () => {
        test('should return undefined if the value is empty', () => {
            testValidator(email, [undefined, '', null], undefined);
        });
        test('should return undefined if the value is not a string', () => {
            testValidator(email, [1234, new Date()], undefined);
        });
        test('should return undefined if the value is a valid email', () => {
            testValidator(
                email,
                ['foo@bar.com', 'john.doe@mydomain.co.uk'],
                undefined
            );
        });
        test('should return an error if the value is not a valid email', () => {
            testValidator(
                email,
                ['foo@bar', 'hello, world'],
                'ra.validation.email'
            );
        });
    });
    describe('choices', () => {
        test('should return undefined if the value is empty', () => {
            testValidator(
                choices([1, 2], 'error'),
                [undefined, '', null],
                undefined
            );
        });
        test('should return undefined if the value is in the choice list', () => {
            testValidator(choices([1, 2], 'error'), [1, 2], undefined);
        });
        test('should return an error message if the value is not in the choice list', () => {
            testValidator(choices([1, 2], 'error'), ['hello', 3], 'error');
        });
    });
});
