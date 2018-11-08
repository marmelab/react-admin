import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { render } from 'react-testing-library';
import { ReferenceManyFieldController } from './ReferenceManyFieldController';

describe('<ReferenceManyFieldController />', () => {
    it('should set isLoading to true when related records are not yet fetched', () => {
        const children = jest.fn();
        shallow(
            <ReferenceManyFieldController
                resource="foo"
                reference="bar"
                target="foo_id"
                basePath=""
                crudGetManyReference={() => {}}
            >
                {children}
            </ReferenceManyFieldController>,
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
            <ReferenceManyFieldController
                resource="foo"
                reference="bar"
                target="foo_id"
                basePath=""
                data={data}
                ids={[1, 2]}
                crudGetManyReference={() => {}}
            >
                {children}
            </ReferenceManyFieldController>,
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
            <ReferenceManyFieldController
                resource="foo"
                reference="bar"
                target="foo_id"
                basePath=""
                data={data}
                ids={['abc-1', 'abc-2']}
                crudGetManyReference={() => {}}
            >
                {children}
            </ReferenceManyFieldController>,
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
            <ReferenceManyFieldController
                resource="foo"
                reference="bar"
                target="foo_id"
                basePath=""
                data={data}
                ids={[1, 2]}
                crudGetManyReference={() => {}}
            >
                {children}
            </ReferenceManyFieldController>,
            { disableLifecycleMethods: true }
        );
        assert.deepEqual(children.mock.calls[0][0].data, data);
        assert.deepEqual(children.mock.calls[0][0].ids, [1, 2]);
    });

    it('should support custom source', () => {
        const children = jest.fn();
        const crudGetManyReference = jest.fn();

        shallow(
            <ReferenceManyFieldController
                resource="posts"
                reference="comments"
                target="post_id"
                basePath=""
                record={{ id: 'not me', customId: 1 }}
                source="customId"
                crudGetManyReference={crudGetManyReference}
            >
                {children}
            </ReferenceManyFieldController>
        );

        assert.equal(crudGetManyReference.mock.calls[0][2], 1);
    });

    it('should call crudGetManyReference when its props changes', () => {
        const children = jest.fn();
        const crudGetManyReference = jest.fn();
        const { rerender } = render(
            <ReferenceManyFieldView record={{ id: 1 }}
            resource="foo"
            reference="bar"
            target="foo_id"
            basePath=""
            data={{
                1: { id: 1, title: 'hello' },
                2: { id: 2, title: 'world' },
            }}
            ids={[1, 2]}
            crudGetManyReference={crudGetManyReference}>
                {children}
            </ReferenceManyFieldView>
        );

        rerender(
            <ReferenceManyFieldView record={{ id: 1 }}
            resource="foo"
            reference="bar"
            target="foo_id"
            basePath=""
            data={{
                1: { id: 1, title: 'hello' },
                2: { id: 2, title: 'world' },
            }}
            ids={[1, 2]}
            sort={{ field: 'id', order: 'ASC' }}
            crudGetManyReference={crudGetManyReference}>
                {children}
            </ReferenceManyFieldView>
        );
        assert.deepEqual(crudGetManyReference.mock.calls[1], [
            'bar',
            'foo_id',
            1,
            'foo_bar@foo_id_1',
            { page: 1, perPage: 25 },
            { field: 'id', order: 'ASC' },
            {},
        ]);
    });
});

class ReferenceManyFieldView extends ReferenceManyFieldController {
    render() {
        return (<div></div>);
    }
}