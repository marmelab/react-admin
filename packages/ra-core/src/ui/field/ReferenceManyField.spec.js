import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { ReferenceManyField } from './ReferenceManyField';

describe('<CoreReferenceManyField />', () => {
    it('should set isLoading to true when related records are not yet fetched', () => {
        const children = jest.fn();
        shallow(
            <ReferenceManyField
                resource="foo"
                reference="bar"
                target="foo_id"
                basePath=""
                crudGetManyReference={() => {}}
            >
                {children}
            </ReferenceManyField>,
            { disableLifecycleMethods: true }
        );
        assert.equal(children.mock.calls[0][0].isLoading, true);
    });

    it('should pass data and ids to children function', () => {
        const children = jest.fn();
        const data = {
            1: { id: 1, title: 'hello' },
            2: { id: 2, title: 'world' },
        };
        shallow(
            <ReferenceManyField
                resource="foo"
                reference="bar"
                target="foo_id"
                basePath=""
                data={data}
                ids={[1, 2]}
                crudGetManyReference={() => {}}
            >
                {children}
            </ReferenceManyField>,
            { disableLifecycleMethods: true }
        );
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
            <ReferenceManyField
                resource="foo"
                reference="bar"
                target="foo_id"
                basePath=""
                data={data}
                ids={['abc-1', 'abc-2']}
                crudGetManyReference={() => {}}
            >
                {children}
            </ReferenceManyField>,
            { disableLifecycleMethods: true }
        );
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
            <ReferenceManyField
                resource="foo"
                reference="bar"
                target="foo_id"
                basePath=""
                data={data}
                ids={[1, 2]}
                crudGetManyReference={() => {}}
            >
                {children}
            </ReferenceManyField>,
            { disableLifecycleMethods: true }
        );
        assert.deepEqual(children.mock.calls[0][0].data, data);
        assert.deepEqual(children.mock.calls[0][0].ids, [1, 2]);
    });

    it('should support custom source', () => {
        const children = jest.fn();
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
                {children}
            </ReferenceManyField>
        );

        assert.equal(crudGetManyReference.mock.calls[0][2], 1);
    });
});
