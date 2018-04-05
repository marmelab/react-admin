import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { ReferenceArrayFieldController } from './ReferenceArrayFieldController';

describe('<ReferenceArrayFieldController />', () => {
    it('should set the isLoading prop to true when related records are not yet fetched', () => {
        const children = jest.fn();

        shallow(
            <ReferenceArrayFieldController
                record={{ barIds: [1, 2] }}
                resource="foo"
                reference="bar"
                source="barIds"
                basePath=""
                data={null}
                ids={[1, 2]}
                crudGetManyAccumulate={() => {}}
            >
                {children}
            </ReferenceArrayFieldController>
        );
        assert.equal(children.mock.calls[0][0].isLoading, true);
    });

    it('should set the isLoading prop to false when at least one related record is found', () => {
        const children = jest.fn();

        shallow(
            <ReferenceArrayFieldController
                record={{ barIds: [1, 2] }}
                resource="foo"
                reference="bar"
                source="barIds"
                basePath=""
                data={{ 1: { id: 1 } }}
                ids={[1, 2]}
                crudGetManyAccumulate={() => {}}
            >
                {children}
            </ReferenceArrayFieldController>
        );

        assert.equal(children.mock.calls[0][0].isLoading, false);
    });

    it('should set the data prop to the loaded data when it has been fetched', () => {
        const children = jest.fn();
        const data = {
            1: { id: 1, title: 'hello' },
            2: { id: 2, title: 'world' },
        };
        shallow(
            <ReferenceArrayFieldController
                record={{ barIds: [1, 2] }}
                resource="foo"
                reference="bar"
                source="barIds"
                basePath=""
                data={data}
                ids={[1, 2]}
                crudGetManyAccumulate={() => {}}
            >
                {children}
            </ReferenceArrayFieldController>
        );
        assert.equal(children.mock.calls[0][0].isLoading, false);
        assert.deepEqual(children.mock.calls[0][0].data, data);
        assert.deepEqual(children.mock.calls[0][0].ids, [1, 2]);
    });

    it('should support record with string identifier', () => {
        const children = jest.fn();
        const data = {
            'abc-1': { id: 'abc-1', title: 'hello' },
            'abc-2': { id: 'abc-2', title: 'world' },
        };
        shallow(
            <ReferenceArrayFieldController
                record={{ barIds: ['abc-1', 'abc-2'] }}
                resource="foo"
                reference="bar"
                source="barIds"
                basePath=""
                data={data}
                ids={['abc-1', 'abc-2']}
                crudGetManyAccumulate={() => {}}
            >
                {children}
            </ReferenceArrayFieldController>
        );
        assert.equal(children.mock.calls[0][0].isLoading, false);
        assert.deepEqual(children.mock.calls[0][0].data, data);
        assert.deepEqual(children.mock.calls[0][0].ids, ['abc-1', 'abc-2']);
    });

    it('should support record with number identifier', () => {
        const children = jest.fn();
        const data = {
            1: { id: 1, title: 'hello' },
            2: { id: 2, title: 'world' },
        };
        shallow(
            <ReferenceArrayFieldController
                record={{ barIds: [1, 2] }}
                resource="foo"
                reference="bar"
                source="barIds"
                basePath=""
                data={data}
                ids={[1, 2]}
                crudGetManyAccumulate={() => {}}
            >
                {children}
            </ReferenceArrayFieldController>
        );
        assert.equal(children.mock.calls[0][0].isLoading, false);
        assert.deepEqual(children.mock.calls[0][0].data, data);
        assert.deepEqual(children.mock.calls[0][0].ids, [1, 2]);
    });
});
