import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';

import { SingleFieldList } from './SingleFieldList';
import ChipField from '../field/ChipField';

describe('<SingleFieldList />', () => {
    it('should render a link to the Edit page of the related record by default', () => {
        const wrapper = shallow(
            <SingleFieldList
                ids={[1, 2]}
                data={[{ id: 1, title: 'foo' }, { id: 2, title: 'bar' }]}
                resource="bar"
                basePath="/bar"
            >
                <ChipField source="title" />
            </SingleFieldList>
        );
        const linkElements = wrapper.find('WithStyles(Link)');
        assert.equal(linkElements.length, 2);
        assert.deepEqual(linkElements.map(link => link.prop('to')), [
            '/bar/1',
            '/bar/2',
        ]);
    });

    it('should render a link to the Edit page of the related record when the resource contains slashes', () => {
        const wrapper = shallow(
            <SingleFieldList
                ids={[1, 2]}
                data={[{ id: 1, title: 'foo' }, { id: 2, title: 'bar' }]}
                resource="bar"
                basePath="/bar"
            >
                <ChipField source="title" />
            </SingleFieldList>
        );
        const linkElements = wrapper.find('WithStyles(Link)');
        assert.equal(linkElements.length, 2);
        assert.deepEqual(linkElements.map(link => link.prop('to')), [
            '/bar/1',
            '/bar/2',
        ]);
    });

    it('should render a link to the Show page of the related record when the linkType is show', () => {
        const wrapper = shallow(
            <SingleFieldList
                ids={[1, 2]}
                data={{
                    1: { id: 1, title: 'foo' },
                    2: { id: 2, title: 'bar' },
                }}
                resource="prefix/bar"
                basePath="/prefix/bar"
                linkType="show"
            >
                <ChipField source="title" />
            </SingleFieldList>
        );

        const linkElements = wrapper.find('WithStyles(Link)');
        assert.equal(linkElements.length, 2);
        assert.deepEqual(linkElements.map(link => link.prop('to')), [
            '/prefix/bar/1/show',
            '/prefix/bar/2/show',
        ]);
    });

    it('should render no link when the linkType is false', () => {
        const wrapper = shallow(
            <SingleFieldList
                ids={[1, 2]}
                data={[{ id: 1, title: 'foo' }, { id: 2, title: 'bar' }]}
                resource="bar"
                basePath="/bar"
                linkType={false}
            >
                <ChipField source="title" />
            </SingleFieldList>
        );

        const linkElements = wrapper.find('WithStyles(Link)');
        assert.equal(linkElements.length, 0);
        const chipElements = wrapper.find('WithStyles(pure(ChipField))');
        assert.equal(chipElements.length, 2);
    });
});
