import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { FileField } from './FileField';

const defaultProps = {
    classes: {},
    source: 'url',
};

describe('<FileField />', () => {
    it('should return an empty div when record is not set', () => {
        assert.equal(shallow(<FileField {...defaultProps} />).html(), '<div class=""></div>');
    });

    it('should render a link with correct attributes based on `source` and `title`', () => {
        const wrapper = shallow(
            <FileField
                {...defaultProps}
                record={{
                    url: 'http://foo.com/bar.jpg',
                    title: 'Hello world!',
                }}
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

        const link = wrapper.find('a');
        assert.equal(link.prop('href'), 'http://foo.com/bar.jpg');
        assert.equal(link.prop('title'), 'Hello world!');
    });

    it('should allow setting static string as title', () => {
        const wrapper = shallow(
            <FileField
                {...defaultProps}
                record={{
                    url: 'http://foo.com/bar.jpg',
                }}
                title="Hello world!"
            />
        );

        const link = wrapper.find('a');
        assert.equal(link.prop('title'), 'Hello world!');
    });

    it('should allow setting target string', () => {
        const wrapper = shallow(
            <FileField
                {...defaultProps}
                record={{
                    url: 'http://foo.com/bar.jpg',
                }}
                target="_blank"
            />
        );

        const link = wrapper.find('a');
        assert.equal(link.prop('target'), '_blank');
    });

    it('should render a list of links with correct attributes based on `src` and `title`', () => {
        const wrapper = shallow(
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

        const links = wrapper.find('a');
        assert.equal(links.at(0).prop('href'), 'http://foo.com/bar.jpg');
        assert.equal(links.at(0).prop('title'), 'Hello world!');
        assert.equal(links.at(1).prop('href'), 'http://bar.com/foo.jpg');
        assert.equal(links.at(1).prop('title'), 'Bye world!');
    });

    it('should use custom className', () =>
        assert.deepEqual(
            shallow(<FileField {...defaultProps} record={{ foo: true }} source="email" className="foo" />).prop(
                'className'
            ),
            'foo'
        ));
});
