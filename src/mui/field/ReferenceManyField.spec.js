import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { ReferenceManyField } from './ReferenceManyField';
import TextField from './TextField';
import SingleFieldList from '../list/SingleFieldList';

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
                <SingleFieldList>
                    <TextField source="title" />
                </SingleFieldList>
            </ReferenceManyField>
        );
        const ProgressElements = wrapper.find('LinearProgress');
        assert.equal(ProgressElements.length, 1);
        const SingleFieldListElement = wrapper.find('SingleFieldList');
        assert.equal(SingleFieldListElement.length, 0);
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
                <SingleFieldList>
                    <TextField source="title" />
                </SingleFieldList>
            </ReferenceManyField>
        );
        const ProgressElements = wrapper.find('LinearProgress');
        assert.equal(ProgressElements.length, 0);
        const SingleFieldListElement = wrapper.find('SingleFieldList');
        assert.equal(SingleFieldListElement.length, 1);
        assert.equal(SingleFieldListElement.at(0).prop('resource'), 'bar');
        assert.deepEqual(SingleFieldListElement.at(0).prop('data'), referenceRecords);
        assert.deepEqual(SingleFieldListElement.at(0).prop('ids'), [1, 2]);
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
                <SingleFieldList>
                    <TextField source="title" />
                </SingleFieldList>
            </ReferenceManyField>
        );
        const ProgressElements = wrapper.find('LinearProgress');
        assert.equal(ProgressElements.length, 0);
        const SingleFieldListElement = wrapper.find('SingleFieldList');
        assert.equal(SingleFieldListElement.length, 1);
        assert.equal(SingleFieldListElement.at(0).prop('resource'), 'bar');
        assert.deepEqual(SingleFieldListElement.at(0).prop('data'), {});
        assert.deepEqual(SingleFieldListElement.at(0).prop('ids'), []);
    });

    it('should support record with string identifier', () => {
        const referenceRecords = {
            "abc-1": { id: "abc-1", title: 'hello' },
            "abc-2": { id: "abc-2", title: 'world' },
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
                <SingleFieldList>
                    <TextField source="title" />
                </SingleFieldList>
            </ReferenceManyField>
        );
        const ProgressElements = wrapper.find('LinearProgress');
        assert.equal(ProgressElements.length, 0);
        const SingleFieldListElement = wrapper.find('SingleFieldList');
        assert.equal(SingleFieldListElement.length, 1);
        assert.equal(SingleFieldListElement.at(0).prop('resource'), 'bar');
        assert.deepEqual(SingleFieldListElement.at(0).prop('data'), referenceRecords);
        assert.deepEqual(SingleFieldListElement.at(0).prop('ids'), ["abc-1", "abc-2"]);
    });
    
    it('should support record with number identifier', () => {
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
               <SingleFieldList>
                   <TextField source="title" />
               </SingleFieldList>
           </ReferenceManyField>
       );
       const ProgressElements = wrapper.find('LinearProgress');
       assert.equal(ProgressElements.length, 0);
       const SingleFieldListElement = wrapper.find('SingleFieldList');
       assert.equal(SingleFieldListElement.length, 1);
       assert.equal(SingleFieldListElement.at(0).prop('resource'), 'bar');
       assert.deepEqual(SingleFieldListElement.at(0).prop('data'), referenceRecords);
       assert.deepEqual(SingleFieldListElement.at(0).prop('ids'), [1,2]);
   });
});
