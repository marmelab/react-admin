import * as React from 'react';
import expect from 'expect';
import { screen, render, getNodeText } from '@testing-library/react';
import { RecordContextProvider, I18nContextProvider } from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import { TextField } from './TextField';

describe('<TextField />', () => {
    it('should display record specific value as plain text', () => {
        const record = {
            id: 123,
            title: "I'm sorry, Dave. I'm afraid I can't do that.",
        };
        const { queryByText } = render(
            <TextField record={record} source="title" />
        );
        expect(
            queryByText("I'm sorry, Dave. I'm afraid I can't do that.")
        ).not.toBeNull();
    });
    it('should use record from RecordContext', () => {
        const record = {
            id: 123,
            title: "I'm sorry, Dave. I'm afraid I can't do that.",
        };
        const { queryByText } = render(
            <RecordContextProvider value={record}>
                <TextField source="title" />
            </RecordContextProvider>
        );
        expect(
            queryByText("I'm sorry, Dave. I'm afraid I can't do that.")
        ).not.toBeNull();
    });

    it.each([null, undefined])(
        'should display emptyText prop if provided for %s value',
        value => {
            const record = { id: 123, title: value };
            render(
                <TextField
                    emptyText="Sorry, there's nothing here"
                    record={record}
                    source="title"
                />
            );
            expect("Sorry, there's nothing here").not.toBeNull();
        }
    );

    it.each([null, undefined])(
        'should display nothing for %s value without emptyText prop',
        value => {
            const record = { id: 123, title: value };
            const { container } = render(
                <TextField record={record} source="title" />
            );
            expect(getNodeText(container)).toStrictEqual('');
        }
    );

    it('should handle deep fields', () => {
        const record = {
            id: 123,
            foo: { title: "I'm sorry, Dave. I'm afraid I can't do that." },
        };
        const { queryByText } = render(
            <TextField record={record} source="foo.title" />
        );
        expect(
            queryByText("I'm sorry, Dave. I'm afraid I can't do that.")
        ).not.toBeNull();
    });

    it('should render the emptyText when value is null', () => {
        const record = { id: 123, title: null };
        const { queryByText } = render(
            <TextField record={record} source="title" emptyText="NA" />
        );
        expect(queryByText('NA')).not.toBeNull();
    });

    it('should translate emptyText', () => {
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
        render(
            <I18nContextProvider value={i18nProvider}>
                <TextField
                    record={{ id: 123 }}
                    // @ts-expect-error source prop does not have a valid value
                    source="foo.bar"
                    emptyText="resources.books.not_found"
                />
            </I18nContextProvider>
        );

        expect(screen.getByText('Not found')).not.toBeNull();
    });

    it('should call toString on a value that is not a string', () => {
        const record = {
            id: 123,
            type: ['Rock', 'Folk Rock'],
        };
        const { queryByText } = render(
            <TextField record={record} source="type" />
        );
        expect(queryByText('Rock,Folk Rock')).not.toBeNull();
    });
});
