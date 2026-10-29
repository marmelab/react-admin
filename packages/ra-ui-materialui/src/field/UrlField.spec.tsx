import * as React from 'react';
import expect from 'expect';
import { render, screen } from '@testing-library/react';
import { I18nContextProvider } from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import { UrlField } from './UrlField';
import { Themed, UnsafeUrl } from './UrlField.stories';

const url = 'https://en.wikipedia.org/wiki/HAL_9000';

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

describe('<UrlField />', () => {
    it('should render a link', () => {
        const record = { id: 123, website: url };
        const { getByText } = render(
            <UrlField record={record} source="website" />
        );
        const link = getByText(url) as HTMLAnchorElement;
        expect(link.tagName).toEqual('A');
        expect(link.href).toEqual(url);
    });

    it('should handle deep fields', () => {
        const record = {
            id: 123,
            foo: { website: url },
        };
        const { getByText } = render(
            <UrlField record={record} source="foo.website" />
        );
        const link = getByText(url) as HTMLAnchorElement;
        expect(link.href).toEqual(url);
    });

    it.each([null, undefined])(
        'should render the emptyText when value is %s',
        url => {
            const { getByText } = render(
                <UrlField
                    record={{ id: 123, url }}
                    className="foo"
                    source="url"
                    emptyText="NA"
                />
            );
            expect(getByText('NA')).not.toEqual(null);
        }
    );

    it('should translate emptyText', () => {
        const { getByText } = render(
            <I18nContextProvider value={i18nProvider}>
                <UrlField
                    record={{ id: 123 }}
                    // @ts-expect-error source prop does not have a valid value
                    source="foo.bar"
                    emptyText="resources.books.not_found"
                />
            </I18nContextProvider>
        );

        expect(getByText('Not found')).not.toBeNull();
    });

    it('should not render a clickable link for javascript: URLs', () => {
        const consoleError = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        render(<UnsafeUrl />);
        const link = screen.getByText('javascript:alert(document.cookie)');
        expect(link.getAttribute('href')).toBeNull();
        expect(consoleError).toHaveBeenCalledWith(
            'Blocked unsafe URL: "javascript:alert(document.cookie)"'
        );
        consoleError.mockRestore();
    });

    it('should render relative URLs as links', () => {
        render(<UrlField record={{ id: 123, url: '/posts/1' }} source="url" />);
        const link = screen.getByText('/posts/1') as HTMLAnchorElement;
        expect(link.getAttribute('href')).toEqual('/posts/1');
    });

    it('should be customized by a theme', async () => {
        render(<Themed />);
        expect(screen.getByTestId('themed')).toBeDefined();
    });
});
