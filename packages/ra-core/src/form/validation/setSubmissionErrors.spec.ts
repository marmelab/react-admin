import { setSubmissionErrors } from './setSubmissionErrors';

describe('setSubmissionErrors', () => {
    it('calls setError for simple form schema', () => {
        const setError = jest.fn();

        setSubmissionErrors(
            {
                name: 'invalid',
                age: 'invalid too',
            },
            setError
        );

        expect(setError).toHaveBeenCalledWith('name', {
            message: 'invalid',
            type: 'server',
        });
        expect(setError).toHaveBeenCalledWith('age', {
            message: 'invalid too',
            type: 'server',
        });
    });
    it('calls setError for form schema with deep paths', () => {
        const setError = jest.fn();

        setSubmissionErrors(
            {
                people: {
                    name: {
                        firstName: 'invalid',
                    },
                    age: 'invalid too',
                },
                another: 'also invalid',
            },
            setError
        );

        expect(setError).toHaveBeenCalledWith('people.name.firstName', {
            message: 'invalid',
            type: 'server',
        });
        expect(setError).toHaveBeenCalledWith('people.age', {
            message: 'invalid too',
            type: 'server',
        });
        expect(setError).toHaveBeenCalledWith('another', {
            message: 'also invalid',
            type: 'server',
        });
    });
    it('calls setError for form schema containing arrays', () => {
        const setError = jest.fn();

        setSubmissionErrors(
            {
                collaborators: [
                    {}, // A valid entry
                    {
                        name: 'invalid',
                        age: 'invalid too',
                    },
                ],
            },
            setError
        );

        expect(setError).toHaveBeenCalledWith('collaborators.1.name', {
            message: 'invalid',
            type: 'server',
        });
        expect(setError).toHaveBeenCalledWith('collaborators.1.age', {
            message: 'invalid too',
            type: 'server',
        });
    });
    it('calls setError for form schema containing nested arrays', () => {
        const setError = jest.fn();

        setSubmissionErrors(
            {
                user: {
                    friends: [
                        {
                            name: 'invalid name',
                        },
                    ],
                },
            },
            setError
        );

        expect(setError).toHaveBeenCalledWith('user.friends.0.name', {
            message: 'invalid name',
            type: 'server',
        });
    });
});
