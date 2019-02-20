import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { UnconnectedReferenceArrayFieldController as ReferenceArrayFieldController } from './ReferenceArrayFieldController';

describe('<ReferenceArrayFieldController />', () => {
    const crudGetManyAccumulate = jest.fn();

    it('should set the loadedOnce prop to false when related records are not yet fetched', () => {
        const children = jest.fn();

        shallow(
            <ReferenceArrayFieldController
                record={{ id: 1, barIds: [1, 2] }}
                resource="foo"
                reference="bar"
                source="barIds"
                basePath=""
                data={null}
                ids={[1, 2]}
                crudGetManyAccumulate={crudGetManyAccumulate}
            >
                {children}
            </ReferenceArrayFieldController>
        );
        assert.equal(children.mock.calls[0][0].loadedOnce, false);
    });

    it('should set the loadedOnce prop to true when at least one related record is found', () => {
        const children = jest.fn();

        shallow(
            <ReferenceArrayFieldController
                record={{ id: 1, barIds: [1, 2] }}
                resource="foo"
                reference="bar"
                source="barIds"
                basePath=""
                data={{ 1: { id: 1 } }}
                ids={[1, 2]}
                crudGetManyAccumulate={crudGetManyAccumulate}
            >
                {children}
            </ReferenceArrayFieldController>
        );

        assert.equal(children.mock.calls[0][0].loadedOnce, true);
    });

    it('should set the data prop to the loaded data when it has been fetched', () => {
        const children = jest.fn();
        const data = {
            1: { id: 1, title: 'hello' },
            2: { id: 2, title: 'world' },
        };
        shallow(
            <ReferenceArrayFieldController
                record={{ id: 1, barIds: [1, 2] }}
                resource="foo"
                reference="bar"
                source="barIds"
                basePath=""
                data={data}
                ids={[1, 2]}
                crudGetManyAccumulate={crudGetManyAccumulate}
            >
                {children}
            </ReferenceArrayFieldController>
        );
        assert.equal(children.mock.calls[0][0].loadedOnce, true);
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
                record={{ id: 1, barIds: ['abc-1', 'abc-2'] }}
                resource="foo"
                reference="bar"
                source="barIds"
                basePath=""
                data={data}
                ids={['abc-1', 'abc-2']}
                crudGetManyAccumulate={crudGetManyAccumulate}
            >
                {children}
            </ReferenceArrayFieldController>
        );
        assert.equal(children.mock.calls[0][0].loadedOnce, true);
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
                record={{ id: 1, barIds: [1, 2] }}
                resource="foo"
                reference="bar"
                source="barIds"
                basePath=""
                data={data}
                ids={[1, 2]}
                crudGetManyAccumulate={crudGetManyAccumulate}
            >
                {children}
            </ReferenceArrayFieldController>
        );
        assert.equal(children.mock.calls[0][0].loadedOnce, true);
        assert.deepEqual(children.mock.calls[0][0].data, data);
        assert.deepEqual(children.mock.calls[0][0].ids, [1, 2]);
    });
});
