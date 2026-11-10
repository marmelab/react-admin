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
    it('sets a single error on the field for an array of string messages', () => {
        const setError = jest.fn();

        setSubmissionErrors(
            { label: ['Too short', 'Invalid characters'] },
            setError
        );

        expect(setError).toHaveBeenCalledTimes(1);
        expect(setError).toHaveBeenCalledWith('label', {
            message: 'Too short, Invalid characters',
            type: 'server',
        });
    });
    it('ignores null and undefined values', () => {
        const setError = jest.fn();

        setSubmissionErrors(
            { title: 'Required', body: null, author: undefined },
            setError
        );

        expect(setError).toHaveBeenCalledTimes(1);
        expect(setError).toHaveBeenCalledWith('title', {
            message: 'Required',
            type: 'server',
        });
    });
    it('ignores empty arrays', () => {
        const setError = jest.fn();

        setSubmissionErrors({ tags: [] }, setError);

        expect(setError).not.toHaveBeenCalled();
    });
    it('supports arrays of string messages in nested paths', () => {
        const setError = jest.fn();

        setSubmissionErrors(
            { user: { email: ['Invalid', 'Already taken'] } },
            setError
        );

        expect(setError).toHaveBeenCalledWith('user.email', {
            message: 'Invalid, Already taken',
            type: 'server',
        });
    });
});
