import { HttpError } from '../../dataProvider';
import { hasValidationErrors } from './hasValidationErrors';

describe('hasValidationErrors', () => {
    it('should return true for an error with non-empty body.errors', () => {
        expect(
            hasValidationErrors(
                new HttpError('Invalid', 400, { errors: { title: 'Required' } })
            )
        ).toBe(true);
        expect(
            hasValidationErrors({ body: { errors: { title: 'Required' } } })
        ).toBe(true);
    });

    it.each([
        ['null', null],
        ['a string', 'error'],
        ['an Error', new Error('error')],
        ['a body without errors', { body: {} }],
        ['null errors', { body: { errors: null } }],
        ['empty errors', { body: { errors: {} } }],
    ])('should return false for %s', (_, error) => {
        expect(hasValidationErrors(error)).toBe(false);
    });
});
