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
            </ReferenceManyField>,
            { disableLifecycleMethods: true }
        );
        const ProgressElements = wrapper.find('WithStyles(LinearProgress)');
        assert.equal(ProgressElements.length, 1);
        const SingleFieldListElement = wrapper.find(
            'WithStyles(SingleFieldList)'
        );
        assert.equal(SingleFieldListElement.length, 0);
    });

    it('should render a list of the child component', () => {
        const data = {
            1: { id: 1, title: 'hello' },
            2: { id: 2, title: 'world' },
        };
        const wrapper = shallow(
            <ReferenceManyField
                resource="foo"
                reference="bar"
                target="foo_id"
                basePath=""
                data={data}
                ids={[1, 2]}
                crudGetManyReference={() => {}}
            >
                <SingleFieldList>
                    <TextField source="title" />
                </SingleFieldList>
            </ReferenceManyField>,
            { disableLifecycleMethods: true }
        );
        const ProgressElements = wrapper.find('WithStyles(LinearProgress)');
        assert.equal(ProgressElements.length, 0);
        const SingleFieldListElement = wrapper.find(
            'WithStyles(SingleFieldList)'
        );
        assert.equal(SingleFieldListElement.length, 1);
        assert.equal(SingleFieldListElement.at(0).prop('resource'), 'bar');
        assert.deepEqual(SingleFieldListElement.at(0).prop('data'), data);
        assert.deepEqual(SingleFieldListElement.at(0).prop('ids'), [1, 2]);
    });

    it('should render nothing when there are no related records', () => {
        const wrapper = shallow(
            <ReferenceManyField
                resource="foo"
                reference="bar"
                target="foo_id"
                basePath=""
                data={{}}
                ids={[]}
                crudGetManyReference={() => {}}
            >
                <SingleFieldList>
                    <TextField source="title" />
                </SingleFieldList>
            </ReferenceManyField>,
            { disableLifecycleMethods: true }
        );
        const ProgressElements = wrapper.find('WithStyles(LinearProgress)');
        assert.equal(ProgressElements.length, 0);
        const SingleFieldListElement = wrapper.find(
            'WithStyles(SingleFieldList)'
        );
        assert.equal(SingleFieldListElement.length, 1);
        assert.equal(SingleFieldListElement.at(0).prop('resource'), 'bar');
        assert.deepEqual(SingleFieldListElement.at(0).prop('data'), {});
        assert.deepEqual(SingleFieldListElement.at(0).prop('ids'), []);
    });

    it('should support record with string identifier', () => {
        const data = {
            'abc-1': { id: 'abc-1', title: 'hello' },
            'abc-2': { id: 'abc-2', title: 'world' },
        };
        const wrapper = shallow(
            <ReferenceManyField
                resource="foo"
                reference="bar"
                target="foo_id"
                basePath=""
                data={data}
                ids={['abc-1', 'abc-2']}
                crudGetManyReference={() => {}}
            >
                <SingleFieldList>
                    <TextField source="title" />
                </SingleFieldList>
            </ReferenceManyField>,
            { disableLifecycleMethods: true }
        );
        const ProgressElements = wrapper.find('widthStyles(LinearProgress)');
        assert.equal(ProgressElements.length, 0);
        const SingleFieldListElement = wrapper.find(
            'WithStyles(SingleFieldList)'
        );
        assert.equal(SingleFieldListElement.length, 1);
        assert.equal(SingleFieldListElement.at(0).prop('resource'), 'bar');
        assert.deepEqual(SingleFieldListElement.at(0).prop('data'), data);
        assert.deepEqual(SingleFieldListElement.at(0).prop('ids'), [
            'abc-1',
            'abc-2',
        ]);
    });

    it('should support record with number identifier', () => {
        const data = {
            1: { id: 1, title: 'hello' },
            2: { id: 2, title: 'world' },
        };
        const wrapper = shallow(
            <ReferenceManyField
                resource="foo"
                reference="bar"
                target="foo_id"
                basePath=""
                data={data}
                ids={[1, 2]}
                crudGetManyReference={() => {}}
            >
                <SingleFieldList>
                    <TextField source="title" />
                </SingleFieldList>
            </ReferenceManyField>,
            { disableLifecycleMethods: true }
        );
        const ProgressElements = wrapper.find('WithStyles(LinearProgress)');
        assert.equal(ProgressElements.length, 0);
        const SingleFieldListElement = wrapper.find(
            'WithStyles(SingleFieldList)'
        );
        assert.equal(SingleFieldListElement.length, 1);
        assert.equal(SingleFieldListElement.at(0).prop('resource'), 'bar');
        assert.deepEqual(SingleFieldListElement.at(0).prop('data'), data);
        assert.deepEqual(SingleFieldListElement.at(0).prop('ids'), [1, 2]);
    });

    it('should support custom source', () => {
        const crudGetManyReference = jest.fn(() => {});

        shallow(
            <ReferenceManyField
                resource="posts"
                reference="comments"
                target="post_id"
                basePath=""
                record={{ id: 'not me', customId: 1 }}
                source="customId"
                crudGetManyReference={crudGetManyReference}
            >
                <SingleFieldList>
                    <TextField source="title" />
                </SingleFieldList>
            </ReferenceManyField>
        );

        assert.equal(crudGetManyReference.mock.calls[0][2], 1);
    });
});
