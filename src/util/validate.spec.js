import assert from 'assert';
import { coreConstraints } from './validate';

describe.only('Validator', () => {
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
});
