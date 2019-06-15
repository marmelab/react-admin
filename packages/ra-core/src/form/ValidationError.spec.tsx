import React from 'react';
import { render } from 'react-testing-library';

import { useTranslate } from '../i18n';
import ValidationError from './ValidationError';

const translate = jest.fn(key => key);

jest.mock('../i18n', () => ({
    useTranslate: () => translate,
}));

describe('ValidationError', () => {
    it('It renders the error message translated if it is a string', () => {
        const { getByText } = render(<ValidationError error="ra.validation.required" />)
        const element = getByText('ra.validation.required');

        expect(translate).toHaveBeenCalledWith(
            'ra.validation.required',
            { _: 'ra.validation.required' }
        );
        expect(element).toBeTruthy();
    });

    it('It renders the error message translated if it is an object, with all its arguments translated as well', () => {
        const { getByText } = render(<ValidationError error={{
            message: "ra.validation.minValue",
            args: { value: 10 }
        }} />)
        const element = getByText('ra.validation.minValue');

        expect(translate).toHaveBeenCalledWith(10, { _: '10' });
        expect(translate).toHaveBeenCalledWith(
            'ra.validation.minValue',
            { 'value': '10' }
        );
        expect(element).toBeTruthy();
    });
});