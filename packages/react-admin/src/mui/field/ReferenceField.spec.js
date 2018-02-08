import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';

import { ReferenceField } from './ReferenceField';
import TextField from './TextField';

describe('<ReferenceField />', () => {
    it('should call crudGetManyAccumulate on componentDidMount if reference source is defined', () => {
        const crudGetManyAccumulate = jest.fn();
        shallow(
            <ReferenceField
                record={{ fooId: 123 }}
                source="fooId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="bar"
                basePath=""
                crudGetManyAccumulate={crudGetManyAccumulate}
            >
                <TextField source="title" />
            </ReferenceField>
        );
        assert.equal(crudGetManyAccumulate.mock.calls.length, 1);
    });
    it('should not call crudGetManyAccumulate on componentDidMount if reference source is null or undefined', () => {
        const crudGetManyAccumulate = jest.fn();
        shallow(
            <ReferenceField
                record={{ fooId: null }}
                source="fooId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="bar"
                basePath=""
                crudGetManyAccumulate={crudGetManyAccumulate}
            >
                <TextField source="title" />
            </ReferenceField>
        );
        assert.equal(crudGetManyAccumulate.mock.calls.length, 0);
    });
    it('should render a link to the Edit page of the related record by default', () => {
        const wrapper = shallow(
            <ReferenceField
                record={{ fooId: 123 }}
                source="fooId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="bar"
                resource="foo"
                basePath="/foo"
                crudGetManyAccumulate={() => {}}
            >
                <TextField source="title" />
            </ReferenceField>
        );
        const linkElement = wrapper.find('WithStyles(Link)');
        assert.equal(linkElement.prop('to'), '/bar/123');
    });
    it('should render a link to the Edit page of the related record when the resource contains slashes', () => {
        const wrapper = shallow(
            <ReferenceField
                record={{ fooId: 123 }}
                source="fooId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="prefix/bar"
                resource="prefix/foo"
                basePath="/prefix/foo"
                crudGetManyAccumulate={() => {}}
            >
                <TextField source="title" />
            </ReferenceField>
        );
        const linkElement = wrapper.find('WithStyles(Link)');
        assert.equal(linkElement.prop('to'), '/prefix/bar/123');
    });
    it('should render a link to the Edit page of the related record when the resource is named edit or show', () => {
        let wrapper = shallow(
            <ReferenceField
                record={{ fooId: 123 }}
                source="fooId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="edit"
                resource="show"
                basePath="/edit"
                crudGetManyAccumulate={() => {}}
            >
                <TextField source="title" />
            </ReferenceField>
        );
        let linkElement = wrapper.find('WithStyles(Link)');
        assert.equal(linkElement.prop('to'), '/edit/123');

        wrapper = shallow(
            <ReferenceField
                record={{ fooId: 123 }}
                source="fooId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="show"
                resource="edit"
                basePath="/edit"
                crudGetManyAccumulate={() => {}}
            >
                <TextField source="title" />
            </ReferenceField>
        );
        linkElement = wrapper.find('WithStyles(Link)');
        assert.equal(linkElement.prop('to'), '/show/123');
    });
    it('should render a link to the Show page of the related record when the linkType is show', () => {
        const wrapper = shallow(
            <ReferenceField
                record={{ fooId: 123 }}
                source="fooId"
                referenceRecord={{ id: 123, title: 'foo' }}
                resource="foo"
                reference="bar"
                basePath="/foo"
                linkType="show"
                crudGetManyAccumulate={() => {}}
            >
                <TextField source="title" />
            </ReferenceField>
        );
        const linkElement = wrapper.find('WithStyles(Link)');
        assert.equal(linkElement.prop('to'), '/bar/123/show');
    });
    it('should render a link to the Show page of the related record when the resource is named edit or show and linkType is show', () => {
        let wrapper = shallow(
            <ReferenceField
                record={{ fooId: 123 }}
                source="fooId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="edit"
                resource="show"
                basePath="/edit"
                linkType="show"
                crudGetManyAccumulate={() => {}}
            >
                <TextField source="title" />
            </ReferenceField>
        );
        let linkElement = wrapper.find('WithStyles(Link)');
        assert.equal(linkElement.prop('to'), '/edit/123/show');

        wrapper = shallow(
            <ReferenceField
                record={{ fooId: 123 }}
                source="fooId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="show"
                resource="edit"
                basePath="/edit"
                linkType="show"
                crudGetManyAccumulate={() => {}}
            >
                <TextField source="title" />
            </ReferenceField>
        );
        linkElement = wrapper.find('WithStyles(Link)');
        assert.equal(linkElement.prop('to'), '/show/123/show');
    });
    it('should render no link when the linkType is false', () => {
        const wrapper = shallow(
            <ReferenceField
                record={{ fooId: 123 }}
                source="fooId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="bar"
                basePath="/foo"
                linkType={false}
                crudGetManyAccumulate={() => {}}
            >
                <TextField source="title" />
            </ReferenceField>
        );
        const linkElement = wrapper.find('WithStyles(Link)');
        assert.equal(linkElement.length, 0);
    });
});
