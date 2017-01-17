import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import ImageField from './ImageField';

describe('<ImageField />', () => {
    it('should return null when the record is not set', () => assert.equal(
        shallow(<ImageField source="url" />).html(),
        null,
    ));

    it('should return null when the record has no value for the source', () => assert.equal(
        shallow(<ImageField record={{}} source="url" />).html(),
        null,
    ));

    it('should render an image with `alt` and `title` using `title` prop', () => {
        const wrapper = shallow((
            <ImageField
                record={{
                    picture: {
                        url: 'http://foo.com/bar.jpg',
                    },
                }}
                source="picture.url"
                title="Hello world!"
            />
        ));

        const img = wrapper.find('img');
        assert.equal(img.prop('alt'), 'Hello world!');
        assert.equal(img.prop('title'), 'Hello world!');
    });

    it('should render an image with `alt` and `title` using `record[source][title]` prop if existing', () => {
        const wrapper = shallow((
            <ImageField
                record={{
                    picture: {
                        url: 'http://foo.com/bar.jpg',
                        title: 'All our base are belong to us',
                    },
                }}
                source="picture.url"
                title="picture.title"
            />
        ));

        const img = wrapper.find('img');
        assert.equal(img.prop('alt'), 'All our base are belong to us');
        assert.equal(img.prop('title'), 'All our base are belong to us');
    });
});
