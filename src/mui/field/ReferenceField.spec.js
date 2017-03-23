import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { ReferenceField } from './ReferenceField';
import TextField from './TextField';

describe('<ReferenceField />', () => {
    it('should render a link to the Edit page of the related record by default', () => {
        const wrapper = shallow(
            <ReferenceField
                record={{ fooId: 123 }}
                source="fooId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="bar"
                basePath=""
                crudGetOneReference={() => {}}
            >
                    <TextField source="title" />
            </ReferenceField>
        );
        const linkElement = wrapper.find('Link');
        assert.equal(linkElement.prop('to'), '/bar/123');
    });
    it('should render a link to the Show page of the related record when the linkType is show', () => {
        const wrapper = shallow(
            <ReferenceField
                record={{ fooId: 123 }}
                source="fooId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="bar"
                basePath=""
                linkType="show"
                crudGetOneReference={() => {}}
            >
                    <TextField source="title" />
            </ReferenceField>
        );
        const linkElement = wrapper.find('Link');
        assert.equal(linkElement.prop('to'), '/bar/123/show');
    });
    it('should render no link when the linkType is false', () => {
        const wrapper = shallow(
            <ReferenceField
                record={{ fooId: 123 }}
                source="fooId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="bar"
                basePath=""
                linkType={false}
                crudGetOneReference={() => {}}
            >
                    <TextField source="title" />
            </ReferenceField>
        );
        const linkElement = wrapper.find('Link');
        assert.equal(linkElement.length, 0);
    });
});
