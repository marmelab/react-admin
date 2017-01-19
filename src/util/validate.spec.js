import React from 'react';
import assert from 'assert';
import { coreConstraints, getErrorsForForm, getErrorsForFieldConstraints, getConstraintsFunctionFromFunctionOrObject, validateForm } from './validate';
import TextInput from '../mui/input/TextInput';

describe('Validator', () => {
    describe('Core Constraints', () => {
        it('.required should return error message if field is empty', () => {
            assert.equal(coreConstraints.required(), 'Required field');
            assert.equal(coreConstraints.required(''), 'Required field');
            assert.equal(coreConstraints.required(null), 'Required field');

            assert.equal(coreConstraints.required('foo'), null);
            assert.equal(coreConstraints.required(12), null);
        });

        // coreConstraints.min(value, _, minimumValue)
        it('.min should return an error message including min value if value is lower than given minimum', () => {
            assert.equal(coreConstraints.min(undefined, {}, 1), null);
            assert.equal(coreConstraints.min(null, {}, 1), null);
            assert.equal(coreConstraints.min('', {}, 1), null);
            assert.equal(coreConstraints.min(1, {}, 1), null);
            assert.equal(coreConstraints.min(2, {}, 1), null);
            assert.equal(coreConstraints.min(1.2, {}, 1), null);
            assert.equal(coreConstraints.min('12', {}, 1), null);
            assert.equal(coreConstraints.min('12aqd', {}, 1), null);

            assert.equal(coreConstraints.min('foobar', {}, 1), 'Minimum value: 1');
            assert.equal(coreConstraints.min(0, {}, 1), 'Minimum value: 1');
        });

        // coreConstraints.max(value, _, minimumValue)
        it('.min should return an error message including max value if value is greater than given maximum', () => {
            assert.equal(coreConstraints.max(undefined, {}, 10), null);
            assert.equal(coreConstraints.max(null, {}, 10), null);
            assert.equal(coreConstraints.max('', {}, 10), null);
            assert.equal(coreConstraints.max(0, {}, 10), null);
            assert.equal(coreConstraints.max(1, {}, 10), null);
            assert.equal(coreConstraints.max(1.2, {}, 10), null);
            assert.equal(coreConstraints.max('2', {}, 10), null);
            assert.equal(coreConstraints.max('2aqd', {}, 10), null);

            assert.equal(coreConstraints.max('foobar', {}, 10), 'Maximum value: 10');
            assert.equal(coreConstraints.max(12, {}, 10), 'Maximum value: 10');
        });

        it('.minLength should return an error message including length if string is too short', () => {
            assert.equal(coreConstraints.minLength(undefined, {}, 5), 'Minimum length: 5');
            assert.equal(coreConstraints.minLength(null, {}, 5), 'Minimum length: 5');
            assert.equal(coreConstraints.minLength(10, {}, 5), 'Minimum length: 5');
            assert.equal(coreConstraints.minLength('', {}, 5), 'Minimum length: 5');
            assert.equal(coreConstraints.minLength('tiny', {}, 5), 'Minimum length: 5');
            assert.equal(coreConstraints.minLength('small', {}, 5), null);
            assert.equal(coreConstraints.minLength('quite long', {}, 5), null);
        });

        it('.maxLength should return an error message including length if string is too long', () => {
            assert.equal(coreConstraints.maxLength(undefined, {}, 5), null);
            assert.equal(coreConstraints.maxLength(null, {}, 5), null);
            assert.equal(coreConstraints.maxLength(10, {}, 5), null);
            assert.equal(coreConstraints.maxLength('', {}, 5), null);
            assert.equal(coreConstraints.maxLength('tiny', {}, 5), null);
            assert.equal(coreConstraints.maxLength('small', {}, 5), null);
            assert.equal(coreConstraints.maxLength('quite long', {}, 5), 'Maximum length: 5');
        });

        it('.email should test entered email address is a valid one', () => {
            assert.equal(coreConstraints.email(undefined), null);
            assert.equal(coreConstraints.email(null), null);
            assert.equal(coreConstraints.email(10), 'Must be a valid email');
            assert.equal(coreConstraints.email(''), null);
            assert.equal(coreConstraints.email('foobar'), 'Must be a valid email');
            assert.equal(coreConstraints.email('john.doe@mycompany.com'), null);
        });

        it('.regex should return given error message if given value does not match the passed regex', () => {
            const regex = { pattern: /a{2,}$/, message: 'Must finish by (at least) two a' };

            assert.equal(coreConstraints.regex(undefined, {}, regex), null);
            assert.equal(coreConstraints.regex(null, {}, regex), null);
            assert.equal(coreConstraints.regex(10, {}, regex), 'Must finish by (at least) two a');
            assert.equal(coreConstraints.regex('hello', {}, regex), 'Must finish by (at least) two a');
            assert.equal(coreConstraints.regex('Time for teaaa', {}, regex), null);
            assert.equal(coreConstraints.regex('Time for tea!', {}, {
                ...regex,
                message: 'Another error message',
            }), 'Another error message');
        });

        it('.choices should return given error message if given value is not in given list', () => {
            const params = {
                list: ['Koa', 'Express'],
                message: 'Should be a Node.js framework',
            };

            assert.equal(coreConstraints.choices(undefined, {}, params), null);
            assert.equal(coreConstraints.choices(null, {}, params), null);
            assert.equal(coreConstraints.choices(10, {}, params), 'Should be a Node.js framework');
            assert.equal(coreConstraints.choices('Symfony', {}, params), 'Should be a Node.js framework');
            assert.equal(coreConstraints.choices('Express', {}, params), null);
            assert.equal(coreConstraints.choices('Spip', {}, {
                ...params,
                message: 'Should be either Koa or Express',
            }), 'Should be either Koa or Express');
        });

        describe('.custom', () => {
            it('should return result of given function', () => {
                assert.equal(coreConstraints.custom(1, {}, () => 'Error'), 'Error');
                assert.equal(coreConstraints.custom(1, {}, () => ''), '');
            });

            it('should pass edited value and whole record values as arguments', () => {
                let passedArguments;
                const record = { react: 15, angular: 2 };

                coreConstraints.custom('foo', record, (...args) => { passedArguments = args; });
                assert.deepEqual(passedArguments, ['foo', record]);
            });
        });
    });

    describe('getConstraintsFunctionFromFunctionOrObject', () => {
        it('should return passed function if given constraint is already a function', () => {
            const barFactory = () => 'bar';
            const constraintsFunction = getConstraintsFunctionFromFunctionOrObject(barFactory);
            assert.equal(constraintsFunction, barFactory);
        });

        it('should return a function checking all given constraints as single function', () => {
            const constraints = {
                required: true,
                min: 100,
            };

            const constraintsFunction = getConstraintsFunctionFromFunctionOrObject(constraints);
            assert.equal(constraintsFunction(''), 'Required field');
            assert.equal(constraintsFunction(10), 'Minimum value: 100');
        });

        it('should throw an error if validation is neither a function nor an object', () => {
            [false, true, '', 'foobar', 12, [1, 2]].forEach(constraints => {
                try {
                    getConstraintsFunctionFromFunctionOrObject(constraints);
                } catch (e) {
                    assert.equal(e.message, 'Unsupported validation type');
                    return;
                }

                throw new Error(`Passing ${constraints} to getConstraintsFunction should throw an error`);
            });
        });
    });

    describe('validateForm', () => {
        it('should return empty object if no validator return error message', () => {
            const props = {
                validation: {
                    title: {
                        custom: () => '',
                    },
                },
            };

            const errors = validateForm({ title: 'We <3 React!' }, props);
            assert.deepEqual(errors, []);
        });

        it('should return validation function result if validation function is passed to the form', () => {
            const props = {
                validation: (values) => {
                    const errors = {};
                    if (!values.title) {
                        errors.title = 'Required field';
                    }

                    if (values.rate < 0 || values.rate > 5) {
                        errors.rate = 'Rate should be between 0 and 5.';
                    }

                    return errors;
                },
            };

            const errors = validateForm({ title: '', rate: 12 }, props);
            assert.deepEqual(errors, {
                title: 'Required field',
                rate: 'Rate should be between 0 and 5.',
            });
        });

        it('should allow to specify validators on inputs directly', () => {
            const props = {
                children: <TextInput source="title" validation={{ required: true }} />,
            };

            const errors = validateForm({ title: '' }, props);
            assert.deepEqual(errors, {
                title: ['Required field'],
            });
        });

        it('should apply both input and form validators', () => {
            const props = {
                children: <TextInput source="rate" validation={{ required: true }} />,
                validation: (values) => (values.rate > 5 ? { rate: 'Maximum value: 5' } : {}),
            };

            const nullError = validateForm({ rate: '' }, props);
            assert.deepEqual(nullError, { rate: ['Required field'] });

            const valueError = validateForm({ rate: 6 }, props);
            assert.deepEqual(valueError, { rate: 'Maximum value: 5' });
        });
    });

    describe('getErrorsForForm', () => {
        const values = { foo: 1, bar: 2, hello: 'world' };

        it('should return an empty object when no validation function is passed', () => {
            assert.deepEqual({}, getErrorsForForm(null, values));
        });

        it('should return an empty object when all values are correct', () => {
            const validate = v => v.foo !== 1 ? { foo: ['error'] } : {}; // eslint-disable-line no-confusing-arrow
            assert.deepEqual({}, getErrorsForForm(validate, values));
        });

        it('should return an error object for incorrect values', () => {
            const validate = v => v.foo !== 2 ? { foo: ['error'] } : {}; // eslint-disable-line no-confusing-arrow
            assert.deepEqual({ foo: ['error'] }, getErrorsForForm(validate, values));
        });

    });

    describe('getErrorsForFieldConstraints', () => {
        const values = { foo: 1, bar: 2, hello: 'world' };

        it('should return an empty object when all values are correct', () => {
            const constraints = {
                foo: _ => [],
            };
            assert.deepEqual({}, getErrorsForFieldConstraints(constraints, values));
        });

        it('should return an error object for incorrect values', () => {
            const constraints = {
                foo: _ => [],
                bar: _ => ['error'],
            };
            assert.deepEqual({ bar: ['error'] }, getErrorsForFieldConstraints(constraints, values));
        });
    });

});
