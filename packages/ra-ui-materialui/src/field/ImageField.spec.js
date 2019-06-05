import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { ImageField } from './ImageField';

const defaultProps = {
    classes: {},
    source: 'url',
};

describe('<ImageField />', () => {
    it('should return an empty div when record is not set', () => {
        assert.equal(shallow(<ImageField {...defaultProps} />).html(), '<div></div>');
    });

    it('should render an image with correct attributes based on `source` and `title`', () => {
        const wrapper = shallow(
            <ImageField
                {...defaultProps}
                record={{
                    url: 'http://foo.com/bar.jpg',
                    title: 'Hello world!',
                }}
                title="title"
            />
        );

        const img = wrapper.find('img');
        assert.equal(img.prop('src'), 'http://foo.com/bar.jpg');
        assert.equal(img.prop('alt'), 'Hello world!');
        assert.equal(img.prop('title'), 'Hello world!');
    });

    it('should support deep linking', () => {
        const wrapper = shallow(
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

        const img = wrapper.find('img');
        assert.equal(img.prop('src'), 'http://foo.com/bar.jpg');
        assert.equal(img.prop('alt'), 'Hello world!');
        assert.equal(img.prop('title'), 'Hello world!');
    });

    it('should allow setting static string as title', () => {
        const wrapper = shallow(
            <ImageField
                {...defaultProps}
                record={{
                    url: 'http://foo.com/bar.jpg',
                }}
                title="Hello world!"
            />
        );

        const img = wrapper.find('img');
        assert.equal(img.prop('alt'), 'Hello world!');
        assert.equal(img.prop('title'), 'Hello world!');
    });

    it('should render a list of images with correct attributes based on `src` and `title`', () => {
        const wrapper = shallow(
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

        const imgs = wrapper.find('img');
        assert.equal(imgs.at(0).prop('src'), 'http://foo.com/bar.jpg');
        assert.equal(imgs.at(0).prop('alt'), 'Hello world!');
        assert.equal(imgs.at(0).prop('title'), 'Hello world!');
        assert.equal(imgs.at(1).prop('src'), 'http://bar.com/foo.jpg');
        assert.equal(imgs.at(1).prop('alt'), 'Bye world!');
        assert.equal(imgs.at(1).prop('title'), 'Bye world!');
    });

    it('should use custom className', () =>
        assert.deepEqual(
            shallow(<ImageField {...defaultProps} source="foo" record={{ foo: true }} className="foo" />).prop(
                'className'
            ),
            'foo'
        ));
});
