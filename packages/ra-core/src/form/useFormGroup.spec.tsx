import { getFormGroupState } from './useFormGroup';

describe('useFormGroup', () => {
    test.each([
        [
            'some fields are dirty and invalid',
            [
                {
                    isValid: true,
                    isDirty: false,
                    isTouched: false,
                    name: 'title',
                },
                {
                    isValid: false,
                    isDirty: true,
                    isTouched: true,
                    error: 'Invalid',
                    name: 'description',
                },
            ],
            {
                isValid: false,
                isDirty: true,
                isTouched: true,
                errors: {
                    description: 'Invalid',
                },
            },
        ],
        [
            'none of the fields is invalid nor dirty',
            [
                {
                    isValid: true,
                    isDirty: false,
                    isTouched: false,
                    name: 'title',
                },
                {
                    isValid: true,
                    isDirty: false,
                    isTouched: false,
                    name: 'description',
                },
            ],
            {
                isValid: true,
                isDirty: false,
                isTouched: false,
                errors: {},
            },
        ],
        [
            'none of the fields is invalid but some are dirty',
            [
                {
                    isValid: true,
                    isDirty: false,
                    isTouched: false,
                    name: 'title',
                },
                {
                    isValid: true,
                    isDirty: true,
                    isTouched: true,
                    name: 'description',
                },
            ],
            {
                isValid: true,
                isDirty: true,
                isTouched: true,
                errors: {},
            },
        ],
    ])(
        'should return a correct form group state when %s',
        (_, fieldStates, expectedGroupState) => {
            expect(getFormGroupState(fieldStates)).toEqual(expectedGroupState);
        }
    );
});
