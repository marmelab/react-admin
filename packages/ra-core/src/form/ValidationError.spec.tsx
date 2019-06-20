import React from 'react';
import { render, cleanup } from 'react-testing-library';

import ValidationError from './ValidationError';
import { TranslationProvider } from '../i18n';
import TestContext from '../util/TestContext';

const translate = jest.fn(key => key);

const renderWithTranslations = content =>
    render(
        <TestContext
            initialState={{
                i18n: {
                    locale: 'en',
                    messages: {
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
                            constants: {
                                match: 'IAmMatch',
                            },
                            targets: {
                                foo: 'Foo',
                            },
                        },
                    },
                },
            }}
        >
            <TranslationProvider>{content}</TranslationProvider>
        </TestContext>
    );

describe('ValidationError', () => {
    afterEach(() => {
        cleanup();
        translate.mockClear();
    });

    it('It renders the error message translated if it is a string', () => {
        const { getByText } = renderWithTranslations(
            <ValidationError error="ra.validation.required" />
        );

        expect(getByText('Required')).toBeTruthy();
    });

    it('It renders the error message translated if it is an object, with all its arguments translated as well, fallbacking to the arg value', () => {
        const { getByText } = renderWithTranslations(
            <ValidationError
                error={{
                    message: 'ra.validation.minValue',
                    args: { value: 10 },
                }}
            />
        );

        expect(getByText('Min Value 10')).toBeDefined();
    });

    it('It renders the error message translated if it is an object, with all its arguments translated as well', () => {
        const { getByText } = renderWithTranslations(
            <ValidationError
                error={{
                    message: 'myapp.validation.match',
                    args: { match: 'myapp.constants.match' },
                }}
            />
        );

        expect(getByText('Must match IAmMatch')).toBeDefined();
    });

    it('It renders the error message translated if it is an object, translating array arguments as well, fallbacking to the arg value', () => {
        const { getByText } = renderWithTranslations(
            <ValidationError
                error={{
                    message: 'ra.validation.oneOf',
                    args: { list: ['myapp.targets.foo', 'bar'] },
                }}
            />
        );

        expect(getByText('Must be one of Foo, bar')).toBeDefined();
    });
});
