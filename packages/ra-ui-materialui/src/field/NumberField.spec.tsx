import * as React from 'react';
import expect from 'expect';
import { render } from '@testing-library/react';
import { RecordContextProvider, I18nContextProvider } from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import { NumberField } from './NumberField';

const i18nProvider = polyglotI18nProvider(
    _locale => ({
        resources: {
            books: {
                name: 'Books',
                fields: {
                    id: 'Id',
                    title: 'Title',
                    author: 'Author',
                    year: 'Year',
                },
                not_found: 'Not found',
            },
        },
    }),
    'en'
);

describe('<NumberField />', () => {
    it('should return null when the record is not set', () => {
        const { container } = render(<NumberField source="foo" />);
        expect(container.firstChild).toBeNull();
    });

    it('should return null when the record has no value for the source', () => {
        const { container } = render(
            <NumberField record={{ id: 123 }} source="foo" />
        );
        expect(container.firstChild).toBeNull();
    });

    it('should render a number', () => {
        const { queryByText } = render(
            <NumberField record={{ id: 123, foo: 1 }} source="foo" />
        );
        expect(queryByText('1')).not.toBeNull();
    });

    it('should render a number string', () => {
        const { queryByText } = render(
            <NumberField record={{ id: 123, foo: '1' }} source="foo" />
        );
        expect(queryByText('1')).not.toBeNull();
    });

    it('should convert strings to numbers by default', () => {
        const { queryByText } = render(
            <NumberField
                record={{ id: 123, foo: '2.1' }}
                source="foo"
                options={{ minimumFractionDigits: 2 }}
            />
        );
        expect(queryByText('2.10')).not.toBeNull();
    });

    it('should use record from RecordContext', () => {
        const { queryByText } = render(
            <RecordContextProvider value={{ id: 123, foo: 1 }}>
                <NumberField source="foo" />
            </RecordContextProvider>
        );
        expect(queryByText('1')).not.toBeNull();
    });

    it('should pass the options prop to Intl.NumberFormat', () => {
        const { queryByText } = render(
            <NumberField
                record={{ id: 123, foo: 1 }}
                source="foo"
                locales="en-US"
                options={{ minimumFractionDigits: 2 }}
            />
        );
        expect(queryByText('1.00')).not.toBeNull();
    });

    it('should use the locales props as an argument to Intl.NumberFormat', () => {
        const { queryByText } = render(
            <NumberField
                record={{ id: 123, foo: 1 }}
                source="foo"
                locales="fr-FR"
                options={{ minimumFractionDigits: 2 }}
            />
        );
        expect(queryByText('1,00')).not.toBeNull();
    });

    it('should use custom className', () => {
        const { container } = render(
            <NumberField
                record={{ id: 123, foo: 45 }}
                source="foo"
                className="foo"
            />
        );
        expect(container.children[0].classList.contains('foo')).toBe(true);
    });

    it('should handle deep fields', () => {
        const { queryByText } = render(
            <NumberField
                record={{ id: 123, foo: { bar: 2 } }}
                source="foo.bar"
            />
        );

        expect(queryByText('2')).not.toBeNull();
    });

    describe('emptyText', () => {
        it.each([null, undefined])(
            'should render the emptyText when value is %s',
            foo => {
                const { getByText } = render(
                    <NumberField
                        record={{ id: 123, foo }}
                        emptyText="NA"
                        source="foo"
                    />
                );
                expect(getByText('NA')).not.toBeNull();
            }
        );
        it('should translate emptyText', () => {
            const { getByText } = render(
                <I18nContextProvider value={i18nProvider}>
                    <NumberField
                        record={{ id: 123 }}
                        source="foo.bar"
                        emptyText="resources.books.not_found"
                    />
                </I18nContextProvider>
            );

            expect(getByText('Not found')).not.toBeNull();
        });
    });

    describe('transform', () => {
        it('should accept a function', () => {
            const { queryByText } = render(
                <NumberField
                    record={{ id: 123, foo: 2 }}
                    source="foo"
                    transform={value => value * 100}
                />
            );
            expect(queryByText('200')).not.toBeNull();
        });
    });
});
