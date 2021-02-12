import { getFormGroupState } from './useFormGroup';

describe('useFormGroup', () => {
    test.each([
        [
            'some fields are dirty and invalid',
            [
                {
                    valid: true,
                    invalid: false,
                    dirty: false,
                    pristine: true,
                    blur: jest.fn(),
                    change: jest.fn(),
                    focus: jest.fn(),
                    name: 'title',
                },
                {
                    valid: false,
                    invalid: true,
                    dirty: true,
                    pristine: false,
                    error: 'Invalid',
                    blur: jest.fn(),
                    change: jest.fn(),
                    focus: jest.fn(),
                    name: 'description',
                },
            ],
            {
                valid: false,
                invalid: true,
                dirty: true,
                pristine: false,
                errors: {
                    description: 'Invalid',
                },
            },
        ],
        [
            'none of the fields is invalid nor dirty',
            [
                {
                    valid: true,
                    invalid: false,
                    dirty: false,
                    pristine: true,
                    blur: jest.fn(),
                    change: jest.fn(),
                    focus: jest.fn(),
                    name: 'title',
                },
                {
                    valid: true,
                    invalid: false,
                    dirty: false,
                    pristine: true,
                    blur: jest.fn(),
                    change: jest.fn(),
                    focus: jest.fn(),
                    name: 'description',
                },
            ],
            {
                valid: true,
                invalid: false,
                dirty: false,
                pristine: true,
                errors: {},
            },
        ],
        [
            'none of the fields is invalid but some are dirty',
            [
                {
                    valid: true,
                    invalid: false,
                    dirty: false,
                    pristine: true,
                    blur: jest.fn(),
                    change: jest.fn(),
                    focus: jest.fn(),
                    name: 'title',
                },
                {
                    valid: true,
                    invalid: false,
                    dirty: true,
                    pristine: false,
                    blur: jest.fn(),
                    change: jest.fn(),
                    focus: jest.fn(),
                    name: 'description',
                },
            ],
            {
                valid: true,
                invalid: false,
                dirty: true,
                pristine: false,
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
