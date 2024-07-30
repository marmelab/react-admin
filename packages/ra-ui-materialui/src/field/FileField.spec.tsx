import * as React from 'react';
import expect from 'expect';
import { render } from '@testing-library/react';
import { RecordContextProvider, I18nContextProvider } from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { FileField } from './FileField';

const defaultProps = {
    classes: {},
    source: 'url' as const,
};

const i18nProvider = polyglotI18nProvider(
    _locale => ({
        ...englishMessages,
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

describe('<FileField />', () => {
    it('should return an empty div when record is not set', () => {
        const { container } = render(<FileField {...defaultProps} />);
        expect(container.firstChild?.textContent).toEqual('');
    });

    it.each([null, undefined])(
        'should render the emptyText when value is %s',
        url => {
            const { queryByText } = render(
                <FileField
                    record={{ id: 123, url }}
                    emptyText="NA"
                    {...defaultProps}
                />
            );
            expect(queryByText('NA')).not.toBeNull();
        }
    );

    it('should render a link with correct attributes based on `source` and `title`', () => {
        const { getByTitle } = render(
            <FileField
                {...defaultProps}
                record={{
                    id: 123,
                    url: 'http://foo.com/bar.jpg',
                    title: 'Hello world!',
                }}
                title="title"
            />
        );

        const link = getByTitle('Hello world!') as HTMLAnchorElement;
        expect(link.href).toEqual('http://foo.com/bar.jpg');
        expect(link.title).toEqual('Hello world!');
    });

    it('should use record from RecordContext', () => {
        const { getByTitle } = render(
            <RecordContextProvider
                value={{
                    id: 123,
                    url: 'http://foo.com/bar.jpg',
                    title: 'Hello world!',
                }}
            >
                <FileField {...defaultProps} title="title" />
            </RecordContextProvider>
        );

        const link = getByTitle('Hello world!') as HTMLAnchorElement;
        expect(link.href).toEqual('http://foo.com/bar.jpg');
        expect(link.title).toEqual('Hello world!');
    });

    it('should support deep linking', () => {
        const { getByTitle } = render(
            <FileField
                {...defaultProps}
                record={{
                    id: 123,
                    file: {
                        url: 'http://foo.com/bar.jpg',
                        title: 'Hello world!',
                    },
                }}
                source="file.url"
                title="file.title"
            />
        );

        const link = getByTitle('Hello world!') as HTMLAnchorElement;
        expect(link.href).toEqual('http://foo.com/bar.jpg');
        expect(link.title).toEqual('Hello world!');
    });

    it('should allow setting static string as title', () => {
        const { getByTitle } = render(
            <FileField
                {...defaultProps}
                record={{
                    id: 123,
                    url: 'http://foo.com/bar.jpg',
                }}
                title="Hello world!"
            />
        );

        const link = getByTitle('Hello world!');
        expect(link.title).toEqual('Hello world!');
    });

    it('should allow setting target string', () => {
        const { getByTitle } = render(
            <FileField
                {...defaultProps}
                record={{
                    id: 123,
                    url: 'http://foo.com/bar.jpg',
                    title: 'Hello world!',
                }}
                target="_blank"
                title="title"
            />
        );

        const link = getByTitle('Hello world!') as HTMLAnchorElement;
        expect(link.target).toEqual('_blank');
    });

    it('should render a list of links with correct attributes based on `src` and `title`', () => {
        const { getByTitle } = render(
            <FileField
                {...defaultProps}
                record={{
                    id: 123,
                    files: [
                        {
                            url: 'http://foo.com/bar.jpg',
                            title: 'Hello world!',
                        },
                        {
                            url: 'http://bar.com/foo.jpg',
                            title: 'Bye world!',
                        },
                    ],
                }}
                source="files"
                src="url"
                title="title"
            />
        );

        const firstLink = getByTitle('Hello world!') as HTMLAnchorElement;
        const secondLink = getByTitle('Bye world!') as HTMLAnchorElement;
        expect(firstLink.href).toEqual('http://foo.com/bar.jpg');
        expect(firstLink.title).toEqual('Hello world!');
        expect(secondLink.href).toEqual('http://bar.com/foo.jpg');
        expect(secondLink.title).toEqual('Bye world!');
    });

    it('should use custom className', () => {
        const { container } = render(
            <FileField
                {...defaultProps}
                record={{ id: 123, foo: true }}
                source="foo"
                className="foo"
            />
        );
        expect(container.children[0].classList.contains('foo')).toBe(true);
    });

    it('should translate emptyText', () => {
        const { getByText } = render(
            <I18nContextProvider value={i18nProvider}>
                <FileField
                    record={{ id: 123, foo: { bar: undefined } }}
                    source="foo.bar"
                    emptyText="resources.books.not_found"
                />
            </I18nContextProvider>
        );

        expect(getByText('Not found')).not.toBeNull();
    });
});
