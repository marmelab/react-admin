import * as React from 'react';
import expect from 'expect';
import { render } from '@testing-library/react';
import { RecordContextProvider, I18nContextProvider } from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import { DateField } from './DateField';

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

describe('<DateField />', () => {
    it('should return null when the record is not set', () => {
        const { container } = render(<DateField source="foo" />);
        expect(container.firstChild).toBeNull();
    });

    it('should return null when the record has no value for the source', () => {
        const { container } = render(
            <DateField record={{ id: 123 }} source="foo" />
        );
        expect(container.firstChild).toBeNull();
    });

    it('should render a date', () => {
        const { queryByText } = render(
            <DateField
                record={{ id: 123, foo: new Date('2017-04-23') }}
                source="foo"
                locales="en-US"
            />
        );

        const date = new Date('2017-04-23').toLocaleDateString('en-US');
        expect(queryByText(date)).not.toBeNull();
    });

    it('should render a date string', () => {
        const { queryByText } = render(
            <DateField
                record={{ id: 123, foo: '2017-04-23' }}
                source="foo"
                locales="en-US"
            />
        );

        const date = new Date('2017-04-23').toLocaleDateString('en-US');
        expect(queryByText(date)).not.toBeNull();
    });

    it('should use record from RecordContext', () => {
        const { queryByText } = render(
            <RecordContextProvider
                value={{ id: 123, foo: new Date('2017-04-23') }}
            >
                <DateField source="foo" locales="en-US" />
            </RecordContextProvider>
        );

        const date = new Date('2017-04-23').toLocaleDateString('en-US');
        expect(queryByText(date)).not.toBeNull();
    });

    it('should handle deep fields', () => {
        const { queryByText } = render(
            <DateField
                record={{ id: 123, foo: { bar: new Date('01/01/2016') } }}
                source="foo.bar"
                locales="en-US"
            />
        );

        const date = new Date('1/1/2016').toLocaleDateString('en-US');
        expect(queryByText(date)).not.toBeNull();
    });

    it('should use custom className', () => {
        const { container } = render(
            <DateField
                record={{ id: 123, foo: new Date('01/01/2016') }}
                source="foo"
                locales="en-US"
                className="foo"
            />
        );

        expect(container.children[0].classList.contains('foo')).toBe(true);
    });

    describe('showTime', () => {
        it('should render a date and time when the showtime prop is passed', () => {
            const { queryByText } = render(
                <DateField
                    record={{ id: 123, foo: new Date('2017-04-23 23:05') }}
                    showTime
                    source="foo"
                    locales="en-US"
                />
            );

            const date = new Date('2017-04-23 23:05').toLocaleString('en-US');
            expect(queryByText(date)).not.toBeNull();
        });

        it('should render only a time when the showtime prop is true and showdate is false', () => {
            const { queryByText } = render(
                <DateField
                    record={{ id: 123, foo: new Date('2017-04-23 23:05') }}
                    showTime
                    showDate={false}
                    source="foo"
                    locales="en-US"
                />
            );

            const date = new Date('2017-04-23 23:05').toLocaleTimeString(
                'en-US'
            );
            expect(queryByText(date)).not.toBeNull();
        });
    });

    describe('options', () => {
        it('should pass the options prop to toLocaleString', () => {
            const date = new Date('2017-04-23');
            const options: Intl.DateTimeFormatOptions = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            };

            const { queryByText } = render(
                <DateField
                    record={{ id: 123, foo: date }}
                    source="foo"
                    locales="en-US"
                    options={options}
                />
            );
            expect(
                queryByText(date.toLocaleDateString('en-US', options))
            ).not.toBeNull();
        });
    });

    describe('locales', () => {
        it('should use the locales props as an argument to toLocaleString', () => {
            const { queryByText } = render(
                <DateField
                    record={{ id: 123, foo: new Date('2017-04-23') }}
                    source="foo"
                    locales="fr-FR"
                />
            );

            const date = new Date('2017-04-23').toLocaleDateString('fr-FR');
            expect(queryByText(date)).not.toBeNull();
        });
    });

    describe('emptyText', () => {
        it.each([null, undefined])(
            'should render the emptyText when value is %s',
            foo => {
                const { queryByText } = render(
                    <DateField
                        record={{ id: 123, foo }}
                        source="foo"
                        locales="fr-FR"
                        emptyText="NA"
                    />
                );
                expect(queryByText('NA')).not.toBeNull();
            }
        );

        it('should translate emptyText', () => {
            const { getByText } = render(
                <I18nContextProvider value={i18nProvider}>
                    <DateField
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
        it('should turn the value into a date', () => {
            const { queryByText } = render(
                <DateField
                    record={{ id: 123, date: '01-23-16' }}
                    source="date"
                    locales="en-US"
                    transform={value =>
                        new Date(
                            value.replace(
                                /(\d{2})-(\d{2})-(\d{2})/,
                                '20$3-$1-$2'
                            )
                        )
                    }
                />
            );

            const renderedDate = new Date('01/23/2016').toLocaleDateString(
                'en-US'
            );
            expect(queryByText(renderedDate)).not.toBeNull();
        });
    });
});
