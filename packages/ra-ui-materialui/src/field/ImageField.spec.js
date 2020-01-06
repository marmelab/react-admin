import React from 'react';
import expect from 'expect';
import { render, cleanup } from '@testing-library/react';
import ImageField from './ImageField';

const defaultProps = {
    classes: {},
    source: 'url',
};

describe('<ImageField />', () => {
    afterEach(cleanup);

    it('should return an empty div when record is not set', () => {
        const { container } = render(<ImageField {...defaultProps} />);
        expect(container.firstChild.textContent).toEqual('');
    });

    it('should render an image with correct attributes based on `source` and `title`', () => {
        const { getByRole } = render(
            <ImageField
                {...defaultProps}
                record={{
                    url: 'http://foo.com/bar.jpg',
                    title: 'Hello world!',
                }}
                title="title"
            />
        );

        const img = getByRole('img');
        expect(img.src).toEqual('http://foo.com/bar.jpg');
        expect(img.alt).toEqual('Hello world!');
        expect(img.title).toEqual('Hello world!');
    });

    it('should support deep linking', () => {
        const { getByRole } = render(
            <ImageField
                {...defaultProps}
                record={{
                    picture: {
                        url: 'http://foo.com/bar.jpg',
                        title: 'Hello world!',
                    },
                }}
                source="picture.url"
                title="picture.title"
            />
        );

        const img = getByRole('img');
        expect(img.src).toEqual('http://foo.com/bar.jpg');
        expect(img.alt).toEqual('Hello world!');
        expect(img.title).toEqual('Hello world!');
    });

    it('should allow setting static string as title', () => {
        const { getByRole } = render(
            <ImageField
                {...defaultProps}
                record={{
                    url: 'http://foo.com/bar.jpg',
                }}
                title="Hello world!"
            />
        );

        const img = getByRole('img');
        expect(img.alt).toEqual('Hello world!');
        expect(img.title).toEqual('Hello world!');
    });

    it('should render a list of images with correct attributes based on `src` and `title`', () => {
        const { queryAllByRole } = render(
            <ImageField
                {...defaultProps}
                record={{
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

        const imgs = queryAllByRole('img');
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
                record={{ foo: 'http://example.com' }}
                className="foo"
            />
        );

        expect(container.firstChild.classList.contains('foo')).toBe(true);
    });
});
