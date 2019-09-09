import checkForInitialValues from './checkForInitialValues';

describe('checkForInitialValues', () => {
    test('uses an empty string for undefined values', () => {
        const initialValues = {
            firstName: 'John',
            lastName: 'Smith',
            age: 30,
            email: 'john.smith@example.com',
            job: { title: 'Software Engineer' },
        };
        const values = {
            firstName: 'John',
            lastName: undefined,
            age: 30,
            email: null,
            job: { title: undefined },
        };
        const finalValues = checkForInitialValues(initialValues, values);
        expect(finalValues).toStrictEqual({
            firstName: 'John',
            lastName: '',
            age: 30,
            email: null,
            job: { title: '' },
        });
    });
});
