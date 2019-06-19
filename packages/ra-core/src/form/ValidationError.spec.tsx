import React from 'react';
import { render, cleanup } from 'react-testing-library';

import ValidationError from './ValidationError';

const translate = jest.fn(key => key);

jest.mock('../i18n', () => ({
    useTranslate: () => translate,
}));

describe('ValidationError', () => {
    afterEach(() => {
        cleanup();
        translate.mockClear();
    });

    it('It renders the error message translated if it is a string', () => {
        const { getByText } = render(
            <ValidationError error="ra.validation.required" />
        );

        expect(getByText('ra.validation.required')).toBeTruthy();
        expect(translate).toHaveBeenCalledWith('ra.validation.required', {
            _: 'ra.validation.required',
        });
    });

    it('It renders the error message translated if it is an object, with all its arguments translated as well', () => {
        const { getByText } = render(
            <ValidationError
                error={{
                    message: 'ra.validation.minValue',
                    args: { value: 10 },
                }}
            />
        );

        expect(getByText('ra.validation.minValue')).toBeDefined();
        expect(translate).toHaveBeenCalledWith('ra.validation.minValue', {
            value: '10',
        });
        expect(translate).toHaveBeenCalledWith('10', { _: '10' });
    });
});
