import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { ReferenceManyField } from './ReferenceManyField';
import TextField from './TextField';

describe('<ReferenceManyField />', () => {
    it('should render a loading indicator when related records are not yet fetched', () => {
        const wrapper = shallow(
            <ReferenceManyField
                resource="foo"
                reference="bar"
                target="foo_id"
                basePath=""
                crudGetManyReference={() => {}}
            >
                <TextField source="title" />
            </ReferenceManyField>
        );
        const ProgressElements = wrapper.find('LinearProgress');
        assert.equal(ProgressElements.length, 1);
        const TextFieldElements = wrapper.find('TextField');
        assert.equal(TextFieldElements.length, 0);
    });

    it('should render a list of the child component', () => {
        const referenceRecords = {
            1: { id: 1, title: 'hello' },
            2: { id: 2, title: 'world' },
        };
        const wrapper = shallow(
            <ReferenceManyField
                resource="foo"
                reference="bar"
                target="foo_id"
                basePath=""
                referenceRecords={referenceRecords}
                crudGetManyReference={() => {}}
            >
                <TextField source="title" />
            </ReferenceManyField>
        );
        const ProgressElements = wrapper.find('LinearProgress');
        assert.equal(ProgressElements.length, 0);
        const TextFieldElements = wrapper.find('TextField');
        assert.equal(TextFieldElements.length, 2);
        assert.equal(TextFieldElements.at(0).prop('resource'), 'bar');
        assert.deepEqual(TextFieldElements.at(0).prop('record'), { id: 1, title: 'hello' });
        assert.equal(TextFieldElements.at(1).prop('resource'), 'bar');
        assert.deepEqual(TextFieldElements.at(1).prop('record'), { id: 2, title: 'world' });
    });

    it('should render nothing when there are no related records', () => {
        const wrapper = shallow(
            <ReferenceManyField
                resource="foo"
                reference="bar"
                target="foo_id"
                basePath=""
                referenceRecords={{}}
                crudGetManyReference={() => {}}
            >
                <TextField source="title" />
            </ReferenceManyField>
        );
        const ProgressElements = wrapper.find('LinearProgress');
        assert.equal(ProgressElements.length, 0);
        const TextFieldElements = wrapper.find('TextField');
        assert.equal(TextFieldElements.length, 0);
    });
});
