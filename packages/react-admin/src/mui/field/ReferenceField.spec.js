import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';

import { ReferenceField } from './ReferenceField';
import TextField from './TextField';

describe('<ReferenceField />', () => {
    test('should call crudGetManyAccumulate on componentDidMount if reference source is defined', () => {
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
    test('should not call crudGetManyAccumulate on componentDidMount if reference source is null or undefined', () => {
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
    test('should render a link to the Edit page of the related record by default', () => {
        const wrapper = shallow(
            <ReferenceField
                record={{ fooId: 123 }}
                source="fooId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="bar"
                basePath=""
                crudGetManyAccumulate={() => {}}
            >
                <TextField source="title" />
            </ReferenceField>
        );
        const linkElement = wrapper.find('withStyles(Link)');
        assert.equal(linkElement.prop('to'), '/bar/123');
    });
    test('should render a link to the Show page of the related record when the linkType is show', () => {
        const wrapper = shallow(
            <ReferenceField
                record={{ fooId: 123 }}
                source="fooId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="bar"
                basePath=""
                linkType="show"
                crudGetManyAccumulate={() => {}}
            >
                <TextField source="title" />
            </ReferenceField>
        );
        const linkElement = wrapper.find('withStyles(Link)');
        assert.equal(linkElement.prop('to'), '/bar/123/show');
    });
    test('should render no link when the linkType is false', () => {
        const wrapper = shallow(
            <ReferenceField
                record={{ fooId: 123 }}
                source="fooId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="bar"
                basePath=""
                linkType={false}
                crudGetManyAccumulate={() => {}}
            >
                <TextField source="title" />
            </ReferenceField>
        );
        const linkElement = wrapper.find('withStyles(Link)');
        assert.equal(linkElement.length, 0);
    });
});
