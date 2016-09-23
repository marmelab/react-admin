import assert from 'assert';
import validate from './validate';

describe('Validator', () => {
    it('should not return any error message if no constraint is given', () => {
        assert.equal(validate({}, 'name', []), '');
    });

    it('should apply all given constraints if several are given', () => {
        const constraints = [
            { required: true },
            { min: 1 },
        ];

        assert.equal(validate({ rate: null }, 'rate', constraints), 'Required field');
        assert.equal(validate({ rate: 0 }, 'rate', constraints), 'Minimum value: 1');
    });

    describe('Required Validator', () => {
        it('should return error message if field is either null or empty', () => {
            assert.equal(validate({}, 'name', [{ required: true }]), 'Required field');
            assert.equal(validate({ name: null }, 'name', [{ required: true }]), 'Required field');
            assert.equal(validate({ name: '' }, 'name', [{ required: true }]), 'Required field');
        });

        it('should return empty string if field is not null', () => {
            assert.equal(validate({ name: 0 }, 'name', [{ required: true }]), '');
            assert.equal(validate({ name: 'Raphael' }, 'name', [{ required: true }]), '');
        });
    });

    describe('Extrema', () => {
        it('should return error message if field is lower than min', () => {
            assert.equal(validate({ note: -1 }, 'note', [{ min: 0 }]), 'Minimum value: 0');
        });

        it('should return empty string if field is greater or equal to min', () => {
            assert.equal(validate({ note: 0 }, 'name', [{ min: 0 }]), '');
            assert.equal(validate({ note: 1 }, 'name', [{ min: 0 }]), '');
        });

        it('should return error message if field is greater than max', () => {
            assert.equal(validate({ note: 15 }, 'note', [{ max: 10 }]), 'Maximum value: 10');
        });

        it('should return empty string if field is lower or equal to max', () => {
            assert.equal(validate({ note: 8 }, 'note', [{ max: 10 }]), '');
            assert.equal(validate({ note: 10 }, 'note', [{ max: 10 }]), '');
        });
    });

    describe('Custom Function', () => {
        it('should return custom function result', () => {
            assert.equal(validate({ note: -1 }, 'note', [{ custom: () => 'Error' }]), 'Error');
            assert.equal(validate({ note: -1 }, 'note', [{ custom: () => '' }]), '');
        });

        it('should pass field value and whole record as parameters', () => {
            let passedArguments;

            const record = { react: 15, angular: 2 };
            validate(record, 'react', [{ custom: (...args) => { passedArguments = args; } }]);

            assert.deepEqual(passedArguments, [15, record]);
        });
    });
});
