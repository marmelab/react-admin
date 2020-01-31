import React from 'react';
import expect from 'expect';
import FileField from './FileField';
import { render, cleanup } from '@testing-library/react';

const defaultProps = {
    classes: {},
    source: 'url',
};

describe('<FileField />', () => {
    afterEach(cleanup);

    it('should return an empty div when record is not set', () => {
        const { container } = render(<FileField {...defaultProps} />);
        expect(container.firstChild.textContent).toEqual('');
    });

    it('should render a link with correct attributes based on `source` and `title`', () => {
        const { getByTitle } = render(
            <FileField
                {...defaultProps}
                record={{
                    url: 'http://foo.com/bar.jpg',
                    title: 'Hello world!',
                }}
                title="title"
            />
        );

        const link = getByTitle('Hello world!');
        expect(link.href).toEqual('http://foo.com/bar.jpg');
        expect(link.title).toEqual('Hello world!');
    });

    it('should support deep linking', () => {
        const { getByTitle } = render(
            <FileField
                {...defaultProps}
                record={{
                    file: {
                        url: 'http://foo.com/bar.jpg',
                        title: 'Hello world!',
                    },
                }}
                source="file.url"
                title="file.title"
            />
        );

        const link = getByTitle('Hello world!');
        expect(link.href).toEqual('http://foo.com/bar.jpg');
        expect(link.title).toEqual('Hello world!');
    });

    it('should allow setting static string as title', () => {
        const { getByTitle } = render(
            <FileField
                {...defaultProps}
                record={{
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
                    url: 'http://foo.com/bar.jpg',
                    title: 'Hello world!',
                }}
                target="_blank"
                title="title"
            />
        );

        const link = getByTitle('Hello world!');
        expect(link.target).toEqual('_blank');
    });

    it('should render a list of links with correct attributes based on `src` and `title`', () => {
        const { getByTitle } = render(
            <FileField
                {...defaultProps}
                record={{
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

        const firstLink = getByTitle('Hello world!');
        const secondLink = getByTitle('Bye world!');
        expect(firstLink.href).toEqual('http://foo.com/bar.jpg');
        expect(firstLink.title).toEqual('Hello world!');
        expect(secondLink.href).toEqual('http://bar.com/foo.jpg');
        expect(secondLink.title).toEqual('Bye world!');
    });

    it('should use custom className', () => {
        const { container } = render(
            <FileField
                {...defaultProps}
                record={{ foo: true }}
                source="email"
                className="foo"
            />
        );
        expect(container.firstChild.classList.contains('foo')).toBe(true);
    });
});
