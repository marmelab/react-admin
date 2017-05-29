import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { ReferenceField } from './ReferenceField';
import TextField from './TextField';

describe('<ReferenceField />', () => {
    it('should call crudGetOneReference on componentDidMount if reference source is defined', () => {
        const crudGetOneReference = sinon.spy();
        shallow(
            <ReferenceField
                record={{ fooId: 123 }}
                source="fooId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="bar"
                basePath=""
                crudGetOneReference={crudGetOneReference}
            >
                <TextField source="title" />
            </ReferenceField>,
            { lifecycleExperimental: true },
        );
        assert(crudGetOneReference.calledOnce);
    });
    it('should not call crudGetOneReference on componentDidMount if reference source is null or undefined', () => {
        const crudGetOneReference = sinon.spy();
        shallow(
            <ReferenceField
                record={{ fooId: null }}
                source="fooId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="bar"
                basePath=""
                crudGetOneReference={crudGetOneReference}
            >
                <TextField source="title" />
            </ReferenceField>,
            { lifecycleExperimental: true },
        );
        assert(crudGetOneReference.notCalled);
    });
    it('should render a link to the Edit page of the related record by default', () => {
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
            </ReferenceField>,
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
                crudGetManyAccumulate={() => {}}
            >
                <TextField source="title" />
            </ReferenceField>,
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
                crudGetManyAccumulate={() => {}}
            >
                <TextField source="title" />
            </ReferenceField>,
        );
        const linkElement = wrapper.find('Link');
        assert.equal(linkElement.length, 0);
    });
});
