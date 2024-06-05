import * as React from 'react';
import expect from 'expect';
import { ChipField } from './ChipField';
import { render } from '@testing-library/react';
import { RecordContextProvider, I18nContextProvider } from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';

const i18nProvider = polyglotI18nProvider(
    _locale =>
        ({
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
        }) as any,
    'en'
);

describe('<ChipField />', () => {
    it('should display the record value added as source', () => {
        const { getByText } = render(
            <ChipField
                className="className"
                classes={{}}
                source="name"
                record={{ id: 123, name: 'foo' }}
            />
        );
        expect(getByText('foo')).not.toBeNull();
    });

    it('should use record from RecordContext', () => {
        const { getByText } = render(
            <RecordContextProvider value={{ id: 123, name: 'foo' }}>
                <ChipField className="className" classes={{}} source="name" />
            </RecordContextProvider>
        );
        expect(getByText('foo')).not.toBeNull();
    });

    it('should not display any label added as props', () => {
        const { getByText } = render(
            <ChipField
                className="className"
                classes={{}}
                source="name"
                record={{ id: 123, name: 'foo' }}
                label="bar"
            />
        );
        expect(getByText('foo')).not.toBeNull();
    });

    it.each([null, undefined])(
        'should render the emptyText when value is %s',
        name => {
            const { getByText } = render(
                <ChipField
                    className="className"
                    classes={{}}
                    source="name"
                    record={{ id: 123, name }}
                    emptyText="NA"
                />
            );
            expect(getByText('NA')).not.toBeNull();
        }
    );

    it('should translate emptyText', () => {
        const { getByText } = render(
            <I18nContextProvider value={i18nProvider}>
                <ChipField
                    record={{ id: 123 }}
                    // @ts-expect-error source prop does not have a valid value
                    source="foo.bar"
                    emptyText="resources.books.not_found"
                />
            </I18nContextProvider>
        );

        expect(getByText('Not found')).not.toBeNull();
    });
});
