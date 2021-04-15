import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import ValidationError from './ValidationError';
import { TranslationProvider } from '../i18n';

import { renderWithRedux } from 'ra-test';

const translate = jest.fn(key => key);

const renderWithTranslations = content =>
    renderWithRedux(
        <TranslationProvider
            i18nProvider={polyglotI18nProvider(() => ({
                ra: {
                    validation: {
                        required: 'Required',
                        minValue: 'Min Value %{value}',
                        oneOf: 'Must be one of %{list}',
                    },
                },
                myapp: {
                    validation: {
                        match: 'Must match %{match}',
                    },
                },
            }))}
        >
            {content}
        </TranslationProvider>
    );

describe('ValidationError', () => {
    afterEach(() => {
        translate.mockClear();
    });

    it('renders the error message if it is a string and no translation is found', () => {
        const { getByText } = renderWithTranslations(
            <ValidationError error="message_missing" />
        );

        expect(getByText('message_missing')).toBeTruthy();
    });

    it('renders the error message translated if it is a string', () => {
        const { getByText } = renderWithTranslations(
            <ValidationError error="ra.validation.required" />
        );

        expect(getByText('Required')).toBeTruthy();
    });

    it('renders the error message if it is an object and no translation is found', () => {
        const { getByText } = renderWithTranslations(
            <ValidationError
                error={{
                    message: 'message_missing',
                    args: { foo: 123 },
                }}
            />
        );

        expect(getByText('message_missing')).toBeTruthy();
    });

    it('renders the error message translated if it is an object, interpolating numbers', () => {
        const { getByText } = renderWithTranslations(
            <ValidationError
                error={{
                    message: 'ra.validation.minValue',
                    args: { value: 10 },
                }}
            />
        );

        expect(getByText('Min Value 10')).not.toBeNull();
    });

    it('renders the error message translated if it is an object, interpolating strings', () => {
        const { getByText } = renderWithTranslations(
            <ValidationError
                error={{
                    message: 'myapp.validation.match',
                    args: { match: 'IAmMatch' },
                }}
            />
        );

        expect(getByText('Must match IAmMatch')).not.toBeNull();
    });

    it('renders the error message translated if it is an object, interpolating arrays', () => {
        const { getByText } = renderWithTranslations(
            <ValidationError
                error={{
                    message: 'ra.validation.oneOf',
                    args: { list: ['foo', 'bar'] },
                }}
            />
        );

        expect(getByText('Must be one of foo,bar')).not.toBeNull();
    });
});
