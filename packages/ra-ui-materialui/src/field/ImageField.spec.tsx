import * as React from 'react';
import expect from 'expect';
import { render } from '@testing-library/react';
import { RecordContextProvider, I18nContextProvider } from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { ImageField } from './ImageField';

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

describe('<ImageField />', () => {
    it('should return an empty div when record is not set', () => {
        const { container } = render(<ImageField {...defaultProps} />);
        expect(container.firstChild?.textContent).toEqual('');
    });

    it.each([null, undefined])(
        'should render the emptyText when value is %s',
        url => {
            const { queryByText } = render(
                <ImageField
                    record={{ id: 123, url }}
                    emptyText="NA"
                    {...defaultProps}
                />
            );
            expect(queryByText('NA')).not.toBeNull();
        }
    );

    it('should render an image with correct attributes based on `source` and `title`', () => {
        const { getByRole } = render(
            <ImageField
                {...defaultProps}
                record={{
                    id: 123,
                    url: 'http://foo.com/bar.jpg',
                    title: 'Hello world!',
                }}
                title="title"
            />
        );

        const img = getByRole('img') as HTMLImageElement;
        expect(img.src).toEqual('http://foo.com/bar.jpg');
        expect(img.alt).toEqual('Hello world!');
        expect(img.title).toEqual('Hello world!');
    });

    it('should use record from RecordContext', () => {
        const { getByRole } = render(
            <RecordContextProvider
                value={{
                    id: 123,
                    url: 'http://foo.com/bar.jpg',
                    title: 'Hello world!',
                }}
            >
                <ImageField {...defaultProps} title="title" />
            </RecordContextProvider>
        );

        const img = getByRole('img') as HTMLImageElement;
        expect(img.src).toEqual('http://foo.com/bar.jpg');
        expect(img.alt).toEqual('Hello world!');
        expect(img.title).toEqual('Hello world!');
    });

    it('should support deep linking', () => {
        const { getByRole } = render(
            <ImageField
                {...defaultProps}
                record={{
                    id: 123,
                    picture: {
                        url: 'http://foo.com/bar.jpg',
                        title: 'Hello world!',
                    },
                }}
                source="picture.url"
                title="picture.title"
            />
        );

        const img = getByRole('img') as HTMLImageElement;
        expect(img.src).toEqual('http://foo.com/bar.jpg');
        expect(img.alt).toEqual('Hello world!');
        expect(img.title).toEqual('Hello world!');
    });

    it('should allow setting static string as title', () => {
        const { getByRole } = render(
            <ImageField
                {...defaultProps}
                record={{
                    id: 123,
                    url: 'http://foo.com/bar.jpg',
                }}
                title="Hello world!"
            />
        );

        const img = getByRole('img') as HTMLImageElement;
        expect(img.alt).toEqual('Hello world!');
        expect(img.title).toEqual('Hello world!');
    });

    it('should render a list of images with correct attributes based on `src` and `title`', () => {
        const { queryAllByRole } = render(
            <ImageField
                {...defaultProps}
                record={{
                    id: 123,
                    pictures: [
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
                source="pictures"
                src="url"
                title="title"
            />
        );

        const imgs = queryAllByRole('img') as HTMLImageElement[];
        expect(imgs[0].src).toEqual('http://foo.com/bar.jpg');
        expect(imgs[0].alt).toEqual('Hello world!');
        expect(imgs[0].title).toEqual('Hello world!');
        expect(imgs[1].src).toEqual('http://bar.com/foo.jpg');
        expect(imgs[1].alt).toEqual('Bye world!');
        expect(imgs[1].title).toEqual('Bye world!');
    });

    it('should use custom className', () => {
        const { container } = render(
            <ImageField
                {...defaultProps}
                source="foo"
                record={{ id: 123, foo: 'http://example.com' }}
                className="foo"
            />
        );

        expect(container.children[0].classList.contains('foo')).toBe(true);
    });

    it('should translate emptyText', () => {
        const { getByText } = render(
            <I18nContextProvider value={i18nProvider}>
                <ImageField
                    record={{ id: 123, foo: { bar: undefined } }}
                    source="foo.bar"
                    emptyText="resources.books.not_found"
                />
            </I18nContextProvider>
        );

        expect(getByText('Not found')).not.toBeNull();
    });
});
