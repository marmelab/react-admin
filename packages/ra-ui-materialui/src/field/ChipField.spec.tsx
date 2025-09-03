import * as React from 'react';
import expect from 'expect';
import { ChipField } from './ChipField';
import { render, screen } from '@testing-library/react';
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
    it('should display the record value added as source', async () => {
        render(<ChipField source="name" record={{ id: 123, name: 'foo' }} />);
        await screen.findByText('foo');
    });

    it('should use record from RecordContext', async () => {
        render(
            <RecordContextProvider value={{ id: 123, name: 'foo' }}>
                <ChipField source="name" />
            </RecordContextProvider>
        );
        await screen.findByText('foo');
    });

    it('should not display any label added as props', async () => {
        render(
            <ChipField
                source="name"
                record={{ id: 123, name: 'foo' }}
                label="bar"
            />
        );
        await screen.findByText('foo');
    });

    it.each([null, undefined])(
        'should render the emptyText when value is %s',
        async name => {
            render(
                <ChipField
                    source="name"
                    record={{ id: 123, name }}
                    emptyText="NA"
                />
            );
            await screen.findByText('NA');
        }
    );

    it('should not render the emptyText when value is zero', async () => {
        render(
            <ChipField
                source="name"
                record={{ id: 123, name: 0 }}
                emptyText="NA"
            />
        );

        expect(screen.queryByText('NA')).toBeNull();
    });

    it('should translate emptyText', async () => {
        render(
            <I18nContextProvider value={i18nProvider}>
                <ChipField
                    record={{ id: 123 }}
                    // @ts-expect-error source prop does not have a valid value
                    source="foo.bar"
                    emptyText="resources.books.not_found"
                />
            </I18nContextProvider>
        );

        await screen.findByText('Not found');
    });

    it('should return null when value and emptyText are an empty string', () => {
        const { container } = render(
            <ChipField
                source="name"
                record={{ id: 123, name: '' }}
                emptyText=""
            />
        );
        expect(container.firstChild).toBeNull();
    });

    it('should display the emptyText when value is an empty string', async () => {
        render(
            <ChipField
                source="name"
                record={{ id: 123, name: '' }}
                emptyText="NA"
            />
        );
        await screen.findByText('NA');
    });

    it('should return null when value is an empty string and emptyText is null', () => {
        const { container } = render(
            <ChipField source="name" record={{ id: 123, name: '' }} />
        );
        expect(container.firstChild).toBeNull();
    });
});
