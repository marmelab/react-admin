import { getIn, setIn } from 'final-form';

import { resetSubmitErrors } from './submitErrorsMutators';

const makeFormState = ({
    submitErrors,
    submitError,
}: {
    submitErrors?: any;
    submitError?: any;
}) => ({
    formState: {
        submitError,
        submitErrors,
    },
});

describe('submitErrorsMutators', () => {
    test('should ignore when no changes occur', () => {
        const prev = {
            value: 'hello',
        };

        const current = {
            value: 'hello',
        };

        const state = makeFormState({
            submitErrors: {
                value: 'error',
            },
        });

        resetSubmitErrors([{ prev, current }], state, { getIn, setIn });

        expect(state.formState.submitErrors).toEqual({
            value: 'error',
        });
    });

    test('should reset errors for basic types', () => {
        const prev = {
            bool: true,
            null: null,
            number: 1,
            string: 'one',
        };

        const current = {
            bool: false,
            null: undefined,
            number: 2,
            string: 'two',
        };

        const state = makeFormState({
            submitErrors: {
                bool: 'error',
                null: 'error',
                number: 'error',
                string: 'error',
            },
        });

        resetSubmitErrors([{ prev, current }], state, { getIn, setIn });

        expect(state.formState.submitErrors).toEqual({});
    });

    test('should reset errors for nested objects', () => {
        const prev = {
            nested: {
                deep: {
                    field: 'one',
                    other: {
                        field: 'two',
                    },
                },
            },
        };

        const current = {
            nested: {
                deep: {
                    field: 'two',
                },
            },
        };

        const state = makeFormState({
            submitErrors: {
                nested: {
                    deep: {
                        field: 'error',
                        other: 'error',
                    },
                },
            },
        });

        resetSubmitErrors([{ prev, current }], state, { getIn, setIn });

        expect(state.formState.submitErrors).toEqual({});
    });

    test('should reset errors for arrays', () => {
        const prev = {
            array: [
                {
                    some: [1, 2],
                },
                {
                    value: 'one',
                },
                1,
            ],
        };

        const current = {
            array: [
                {
                    some: [2],
                },
                {
                    value: 'one',
                },
                2,
            ],
        };

        const state = makeFormState({
            submitErrors: {
                array: [
                    {
                        some: ['error', 'error'],
                    },
                    {
                        value: 'error',
                    },
                    'error',
                ],
            },
        });

        resetSubmitErrors([{ prev, current }], state, { getIn, setIn });

        expect(state.formState.submitErrors).toEqual({
            array: [undefined, { value: 'error' }],
        });
    });

    test('should reset errors for validation error objects', () => {
        const prev = {
            field: 'aaaa',
        };

        const current = {
            field: 'aaaaa',
        };

        const state = makeFormState({
            submitErrors: {
                field: {
                    message: 'ra.validation.min_length',
                    args: { min: 5 },
                },
            },
        });

        resetSubmitErrors([{ prev, current }], state, { getIn, setIn });

        expect(state.formState.submitErrors).toEqual({});
    });
});
