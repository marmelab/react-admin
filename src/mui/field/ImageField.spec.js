import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import ImageField from './ImageField';

describe('<ImageField />', () => {
    it('should return an empty div when record is not set', () => {
        assert.equal(shallow(<ImageField source="url" />).html(), '<div></div>');
    });

    it('should render an image with correct attributes based on `source` and `title`', () => {
        const wrapper = shallow((
            <ImageField
                record={{
                    url: 'http://foo.com/bar.jpg',
                    title: 'Hello world!',
                }}
                source="url"
                title="title"
            />
        ));

        const img = wrapper.find('img');
        assert.equal(img.prop('src'), 'http://foo.com/bar.jpg');
        assert.equal(img.prop('alt'), 'Hello world!');
        assert.equal(img.prop('title'), 'Hello world!');
    });

    it('should support deep linking', () => {
        const wrapper = shallow((
            <ImageField
                record={{
                    picture: {
                        url: 'http://foo.com/bar.jpg',
                        title: 'Hello world!',
                    },
                }}
                source="picture.url"
                title="picture.title"
            />
        ));

        const img = wrapper.find('img');
        assert.equal(img.prop('src'), 'http://foo.com/bar.jpg');
        assert.equal(img.prop('alt'), 'Hello world!');
        assert.equal(img.prop('title'), 'Hello world!');
    });

    it('should allow setting static string as title', () => {
        const wrapper = shallow((
            <ImageField
                record={{
                    url: 'http://foo.com/bar.jpg',
                }}
                source="url"
                title="Hello world!"
            />
        ));

        const img = wrapper.find('img');
        assert.equal(img.prop('alt'), 'Hello world!');
        assert.equal(img.prop('title'), 'Hello world!');
    });
});
