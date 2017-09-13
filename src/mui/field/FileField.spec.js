import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import FileField from './FileField';

describe('<FileField />', () => {
    it('should return an empty div when record is not set', () => {
        assert.equal(shallow(<FileField source="url" />).html(), '<div></div>');
    });

    it('should render a link with correct attributes based on `source` and `title`', () => {
        const wrapper = shallow(
            <FileField
                record={{
                    url: 'http://foo.com/bar.jpg',
                    title: 'Hello world!',
                }}
                source="url"
                title="title"
            />
        );

        const link = wrapper.find('a');
        assert.equal(link.prop('href'), 'http://foo.com/bar.jpg');
        assert.equal(link.prop('title'), 'Hello world!');
    });

    it('should support deep linking', () => {
        const wrapper = shallow(
            <FileField
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

        const link = wrapper.find('a');
        assert.equal(link.prop('href'), 'http://foo.com/bar.jpg');
        assert.equal(link.prop('title'), 'Hello world!');
    });

    it('should allow setting static string as title', () => {
        const wrapper = shallow(
            <FileField
                record={{
                    url: 'http://foo.com/bar.jpg',
                }}
                source="url"
                title="Hello world!"
            />
        );

        const link = wrapper.find('a');
        assert.equal(link.prop('title'), 'Hello world!');
    });

    it('should render a list of links with correct attributes based on `src` and `title`', () => {
        const wrapper = shallow(
            <FileField
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

        const links = wrapper.find('a');
        assert.equal(links.at(0).prop('href'), 'http://foo.com/bar.jpg');
        assert.equal(links.at(0).prop('title'), 'Hello world!');
        assert.equal(links.at(1).prop('href'), 'http://bar.com/foo.jpg');
        assert.equal(links.at(1).prop('title'), 'Bye world!');
    });
});
