import assert from 'assert';
import validate from './validate';

describe('Validator', () => {
    describe('Required Validator', () => {
        it('should return error message if field is either null or empty', () => {
            assert.equal(validate({}, 'name', {
                name: {
                    required: true,
                },
            }), 'Required field');

            assert.equal(validate({ name: null }, 'name', {
                name: {
                    required: true,
                },
            }), 'Required field');

            assert.equal(validate({ name: '' }, 'name', {
                name: {
                    required: true,
                },
            }), 'Required field');
        });

        it('should return empty string if field is a non-null string', () => {
            assert.equal(validate({ name: 'Raphael' }, 'name', {
                name: {
                    required: true,
                },
            }), '');
        });
    });

    describe('Extrema', () => {
        it('should return error message if field is lower than min', () => {
            assert.equal(validate({ note: -1 }, 'note', {
                note: {
                    min: 0,
                },
            }), 'Minimum value: 0');
        });

        it('should return empty string if field is greater or equal to min', () => {
            assert.equal(validate({ note: 0 }, 'name', {
                note: {
                    min: 0,
                },
            }), '');

            assert.equal(validate({ note: 1 }, 'name', {
                note: {
                    min: 0,
                },
            }), '');
        });

        it('should return error message if field is greater than max', () => {
            assert.equal(validate({ note: 15 }, 'note', {
                note: {
                    max: 10,
                },
            }), 'Maximum value: 10');
        });

        it('should return empty string if field is lower or equal to max', () => {
            assert.equal(validate({ note: 8 }, 'note', {
                note: {
                    max: 10,
                },
            }), '');

            assert.equal(validate({ note: 10 }, 'note', {
                note: {
                    max: 10,
                },
            }), '');
        });
    });

    describe('Custom Function', () => {
        it('should return custom function result', () => {
            assert.equal(validate({ note: -1 }, 'note', {
                note: {
                    custom: () => 'Error',
                },
            }), 'Error');

            assert.equal(validate({ note: -1 }, 'note', {
                note: {
                    custom: () => '',
                },
            }), '');
        });

        it('should pass field value and whole record as parameters', () => {
            let passedArguments;

            const record = { react: 15, angular: 2 };
            validate(record, 'react', {
                react: {
                    custom: (...args) => { passedArguments = args; },
                },
            });

            assert.deepEqual(passedArguments, [15, record]);
        });
    });
});
