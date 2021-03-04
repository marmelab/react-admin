import * as React from 'react';
import expect from 'expect';
import { render } from '@testing-library/react';
import { RecordContextProvider } from 'ra-core';

import RichTextField, { removeTags } from './RichTextField';

describe('stripTags', () => {
    it('should strip HTML tags from input', () => {
        expect(removeTags('<h1>Hello world!</h1>')).toEqual('Hello world!');
        expect(removeTags('<p>Cake is a lie</p>')).toEqual('Cake is a lie');
    });

    it('should strip HTML tags even with attributes', () => {
        expect(removeTags('<a href="http://www.zombo.com">Zombo</a>')).toEqual(
            'Zombo'
        );
        expect(
            removeTags(
                '<a target="_blank" href="http://www.zombo.com">Zombo</a>'
            )
        ).toEqual('Zombo');
    });

    it('should strip HTML tags splitted on several lines', () => {
        expect(
            removeTags(`<a
            href="http://www.zombo.com"
        >Zombo</a>`)
        ).toEqual('Zombo');
    });

    it('should strip HTML embedded tags', () => {
        expect(
            removeTags(
                '<marquee><a href="http://www.zombo.com">Zombo</a></marquee>'
            )
        ).toEqual('Zombo');
    });

    it('should strip HTML tags even if they are malformed', () => {
        expect(removeTags('<p>All our base is belong to us.<p>')).toEqual(
            'All our base is belong to us.'
        );
    });
});

describe('<RichTextField />', () => {
    it('should render as HTML', () => {
        const record = { id: 123, body: '<h1>Hello world!</h1>' };
        const { container } = render(
            <RichTextField record={record} source="body" />
        );
        expect(container.children[0].innerHTML).toEqual(
            '<span><h1>Hello world!</h1></span>'
        );
    });

    it('should use record from RecordContext', () => {
        const record = { id: 123, body: '<h1>Hello world!</h1>' };
        const { container } = render(
            <RecordContextProvider value={record}>
                <RichTextField source="body" />
            </RecordContextProvider>
        );
        expect(container.children[0].innerHTML).toEqual(
            '<span><h1>Hello world!</h1></span>'
        );
    });

    it('should handle deep fields', () => {
        const record = { id: 123, foo: { body: '<h1>Hello world!</h1>' } };
        const { container } = render(
            <RichTextField record={record} source="foo.body" />
        );
        expect(container.children[0].innerHTML).toEqual(
            '<span><h1>Hello world!</h1></span>'
        );
    });

    it('should strip HTML tags if stripTags is set to true', () => {
        const record = { id: 123, body: '<h1>Hello world!</h1>' };
        const { container } = render(
            <RichTextField stripTags={true} record={record} source="body" />
        );
        expect(container.children[0].innerHTML).toEqual('Hello world!');
    });

    it('should not strip HTML tags if stripTags is set to false', () => {
        const record = { id: 123, body: '<h1>Hello world!</h1>' };
        const { container } = render(
            <RichTextField stripTags={false} record={record} source="body" />
        );
        expect(container.children[0].innerHTML).toEqual(
            '<span><h1>Hello world!</h1></span>'
        );
    });

    it('should use custom className', () => {
        const { container } = render(
            <RichTextField
                record={{ id: 123, foo: true }}
                source="body"
                className="foo"
            />
        );
        expect(container.children[0].classList.contains('foo')).toBe(true);
    });

    it.each([null, undefined])(
        'should render the emptyText when value is %s and stripTags is set to false',
        body => {
            const { queryByText } = render(
                <RichTextField
                    record={{ id: 123, body }}
                    emptyText="NA"
                    source="body"
                />
            );
            expect(queryByText('NA')).not.toBeNull();
        }
    );

    it.each([null, undefined])(
        'should render the emptyText when value is %s and stripTags is set to true',
        body => {
            const { queryByText } = render(
                <RichTextField
                    record={{ id: 123, body }}
                    emptyText="NA"
                    source="body"
                    stripTags
                />
            );
            expect(queryByText('NA')).not.toBeNull();
        }
    );
});
