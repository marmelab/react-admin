import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { render } from 'react-testing-library';
import { UnconnectedReferenceInputController as ReferenceInputController } from './ReferenceInputController';

describe('<ReferenceInputController />', () => {
    const defaultProps = {
        basePath: '/comments',
        children: jest.fn(),
        crudGetManyAccumulate: jest.fn(),
        crudGetMatchingAccumulate: jest.fn(),
        meta: {},
        input: { value: undefined },
        onChange: jest.fn(),
        reference: 'posts',
        resource: 'comments',
        source: 'post_id',
        translate: x => `*${x}*`,
    };

    it('should set isLoading to true if the references are being searched and a selected reference does not have data', () => {
        const children = jest.fn();
        shallow(
            <ReferenceInputController
                {...{
                    ...defaultProps,
                    input: { value: 1 },
                    isLoading: true,
                }}
            >
                {children}
            </ReferenceInputController>
        );

        assert.equal(children.mock.calls[0][0].isLoading, true);
    });

    it('should set isLoading to true if the references are being searched and there is no reference already selected', () => {
        const children = jest.fn();
        shallow(
            <ReferenceInputController
                {...{
                    ...defaultProps,
                    matchingReferences: null,
                    referenceRecord: null,
                }}
            >
                {children}
            </ReferenceInputController>
        );
        assert.equal(children.mock.calls[0][0].isLoading, true);
    });

    it('should set isLoading to false if the references are being searched but a selected reference have data', () => {
        const children = jest.fn();
        shallow(
            <ReferenceInputController
                {...{
                    ...defaultProps,
                    matchingReferences: null,
                    referenceRecord: { id: 1 },
                    input: { value: 1 },
                }}
            >
                {children}
            </ReferenceInputController>
        );
        assert.equal(children.mock.calls[0][0].isLoading, false);
        assert.deepEqual(children.mock.calls[0][0].choices, [{ id: 1 }]);
    });

    it('should set isLoading to false if the references were found but a selected reference does not have data', () => {
        const children = jest.fn();
        shallow(
            <ReferenceInputController
                {...{
                    ...defaultProps,
                    matchingReferences: [{ id: 2 }],
                    referenceRecord: null,
                    input: { value: 1 },
                }}
            >
                {children}
            </ReferenceInputController>
        );
        assert.equal(children.mock.calls[0][0].isLoading, false);
        assert.deepEqual(children.mock.calls[0][0].choices, [{ id: 2 }]);
    });

    it('should set error in case of references fetch error and selected reference does not have data', () => {
        const children = jest.fn();
        shallow(
            <ReferenceInputController
                {...{
                    ...defaultProps,
                    matchingReferences: { error: 'fetch error' },
                    referenceRecord: null,
                    input: { value: 1 },
                }}
            >
                {children}
            </ReferenceInputController>
        );
        assert.equal(children.mock.calls[0][0].error, '*ra.input.references.single_missing*');
    });

    it('should set error in case of references fetch error and there is no reference already selected', () => {
        const children = jest.fn();
        shallow(
            <ReferenceInputController
                {...{
                    ...defaultProps,
                    matchingReferences: { error: 'fetch error' },
                    referenceRecord: null,
                }}
            >
                {children}
            </ReferenceInputController>
        );
        assert.equal(children.mock.calls[0][0].error, '*fetch error*');
    });

    it('should not set error in case of references fetch error but selected reference have data', () => {
        const children = jest.fn();
        shallow(
            <ReferenceInputController
                {...{
                    ...defaultProps,
                    matchingReferences: { error: 'fetch error' },
                    referenceRecord: { id: 1 },
                    input: { value: 1 },
                }}
            >
                {children}
            </ReferenceInputController>
        );

        assert.equal(children.mock.calls[0][0].error, undefined);
    });

    it('should not set error if the references are empty (but fetched without error) and a selected reference does not have data', () => {
        const children = jest.fn();
        shallow(
            <ReferenceInputController
                {...{
                    ...defaultProps,
                    matchingReferences: [],
                    referenceRecord: null,
                    input: { value: 1 },
                }}
            >
                {children}
            </ReferenceInputController>
        );
        assert.equal(children.mock.calls[0][0].error, undefined);
    });

    it('should set warning in case of references fetch error and there selected reference with data', () => {
        const children = jest.fn();
        shallow(
            <ReferenceInputController
                {...{
                    ...defaultProps,
                    matchingReferences: { error: 'fetch error' },
                    referenceRecord: { id: 1 },
                    input: { value: 1 },
                }}
            >
                {children}
            </ReferenceInputController>
        );
        assert.equal(children.mock.calls[0][0].warning, '*fetch error*');
    });

    it('should set warning if references were found but not the already selected one', () => {
        const children = jest.fn();
        shallow(
            <ReferenceInputController
                {...{
                    ...defaultProps,
                    matchingReferences: [],
                    referenceRecord: null,
                    input: { value: 1 },
                }}
            >
                {children}
            </ReferenceInputController>
        );
        assert.equal(children.mock.calls[0][0].warning, '*ra.input.references.single_missing*');
    });

    it('should not set warning if all references were found', () => {
        const children = jest.fn();
        shallow(
            <ReferenceInputController
                {...{
                    ...defaultProps,
                    matchingReferences: [{ id: 1 }, { id: 2 }],
                    referenceRecord: { id: 1 },
                    input: { value: 1 },
                }}
            >
                {children}
            </ReferenceInputController>
        );
        assert.equal(children.mock.calls[0][0].warning, undefined);
    });

    it('should call crudGetMatchingAccumulate on mount with default fetch values', () => {
        const crudGetMatchingAccumulate = jest.fn();
        shallow(
            <ReferenceInputController
                {...defaultProps}
                allowEmpty
                crudGetMatchingAccumulate={crudGetMatchingAccumulate}
            />
        );
        assert.deepEqual(crudGetMatchingAccumulate.mock.calls[0], [
            'posts',
            'comments@post_id',
            {
                page: 1,
                perPage: 25,
            },
            {
                field: 'id',
                order: 'DESC',
            },
            {},
        ]);
    });

    it('should allow to customize crudGetMatchingAccumulate arguments with perPage, sort, and filter props', () => {
        const crudGetMatchingAccumulate = jest.fn();
        shallow(
            <ReferenceInputController
                {...defaultProps}
                allowEmpty
                crudGetMatchingAccumulate={crudGetMatchingAccumulate}
                sort={{ field: 'foo', order: 'ASC' }}
                perPage={5}
                filter={{ q: 'foo' }}
            />
        );
        assert.deepEqual(crudGetMatchingAccumulate.mock.calls[0], [
            'posts',
            'comments@post_id',
            {
                page: 1,
                perPage: 5,
            },
            {
                field: 'foo',
                order: 'ASC',
            },
            {
                q: 'foo',
            },
        ]);
    });

    it('should allow to customize crudGetMatchingAccumulate arguments with perPage, sort, and filter props without loosing original default filter', () => {
        const crudGetMatchingAccumulate = jest.fn();
        const wrapper = shallow(
            <ReferenceInputController
                {...defaultProps}
                allowEmpty
                crudGetMatchingAccumulate={crudGetMatchingAccumulate}
                sort={{ field: 'foo', order: 'ASC' }}
                perPage={5}
                filter={{ foo: 'bar' }}
            />
        );

        wrapper.instance().setFilter('search_me');

        assert.deepEqual(crudGetMatchingAccumulate.mock.calls[1], [
            'posts',
            'comments@post_id',
            {
                page: 1,
                perPage: 5,
            },
            {
                field: 'foo',
                order: 'ASC',
            },
            {
                foo: 'bar',
                q: 'search_me',
            },
        ]);
    });

    it('should call crudGetMatchingAccumulate when setFilter is called', () => {
        const crudGetMatchingAccumulate = jest.fn();
        const wrapper = shallow(
            <ReferenceInputController
                {...defaultProps}
                allowEmpty
                crudGetMatchingAccumulate={crudGetMatchingAccumulate}
            />
        );
        wrapper.instance().setFilter('bar');
        assert.deepEqual(crudGetMatchingAccumulate.mock.calls[1], [
            'posts',
            'comments@post_id',
            {
                page: 1,
                perPage: 25,
            },
            {
                field: 'id',
                order: 'DESC',
            },
            {
                q: 'bar',
            },
        ]);
    });

    it('should use custom filterToQuery function prop', () => {
        const crudGetMatchingAccumulate = jest.fn();
        const wrapper = shallow(
            <ReferenceInputController
                {...defaultProps}
                allowEmpty
                crudGetMatchingAccumulate={crudGetMatchingAccumulate}
                filterToQuery={searchText => ({ foo: searchText })}
            />
        );
        wrapper.instance().setFilter('bar');
        assert.deepEqual(crudGetMatchingAccumulate.mock.calls[1], [
            'posts',
            'comments@post_id',
            {
                page: 1,
                perPage: 25,
            },
            {
                field: 'id',
                order: 'DESC',
            },
            {
                foo: 'bar',
            },
        ]);
    });

    it('should call crudGetManyAccumulate on mount if value is set', () => {
        const crudGetManyAccumulate = jest.fn();
        shallow(
            <ReferenceInputController
                {...defaultProps}
                allowEmpty
                crudGetManyAccumulate={crudGetManyAccumulate}
                input={{ value: 5 }}
            />
        );
        assert.deepEqual(crudGetManyAccumulate.mock.calls[0], ['posts', [5]]);
    });

    it('should pass onChange down to child component', () => {
        const children = jest.fn();
        const onChange = jest.fn();
        shallow(
            <ReferenceInputController {...defaultProps} allowEmpty onChange={onChange}>
                {children}
            </ReferenceInputController>
        );
        assert.deepEqual(children.mock.calls[0][0].onChange, onChange);
    });

    it('should only call crudGetMatchingAccumulate when calling setFilter', () => {
        const crudGetMatchingAccumulate = jest.fn();
        const crudGetManyAccumulate = jest.fn();
        const wrapper = shallow(
            <ReferenceInputController
                {...defaultProps}
                allowEmpty
                input={{ value: 5 }}
                crudGetManyAccumulate={crudGetManyAccumulate}
                crudGetMatchingAccumulate={crudGetMatchingAccumulate}
            />
        );
        assert.equal(crudGetMatchingAccumulate.mock.calls.length, 1);
        assert.equal(crudGetManyAccumulate.mock.calls.length, 1);

        wrapper.instance().setFilter('bar');
        assert.equal(crudGetMatchingAccumulate.mock.calls.length, 2);
        assert.equal(crudGetManyAccumulate.mock.calls.length, 1);
    });

    it('should only call crudGetMatching when props are changed from outside', () => {
        const crudGetMatchingAccumulate = jest.fn();
        const crudGetManyAccumulate = jest.fn();
        const ControllerWrapper = props => (
            <ReferenceInputController
                {...defaultProps}
                allowEmpty
                input={{ value: 5 }}
                crudGetManyAccumulate={crudGetManyAccumulate}
                crudGetMatchingAccumulate={crudGetMatchingAccumulate}
                {...props}
            >
                {() => null}
            </ReferenceInputController>
        );

        const { rerender } = render(<ControllerWrapper />);
        assert.equal(crudGetMatchingAccumulate.mock.calls.length, 1);
        assert.equal(crudGetManyAccumulate.mock.calls.length, 1);

        rerender(<ControllerWrapper filter={{ foo: 'bar' }} />);

        assert.equal(crudGetManyAccumulate.mock.calls.length, 1);
        assert.deepEqual(crudGetMatchingAccumulate.mock.calls[1], [
            'posts',
            'comments@post_id',
            { page: 1, perPage: 25 },
            { field: 'id', order: 'DESC' },
            { foo: 'bar' },
        ]);

        rerender(<ControllerWrapper filter={{ foo: 'bar' }} sort={{ field: 'foo', order: 'ASC' }} />);

        assert.equal(crudGetManyAccumulate.mock.calls.length, 1);
        assert.deepEqual(crudGetMatchingAccumulate.mock.calls[2], [
            'posts',
            'comments@post_id',
            { page: 1, perPage: 25 },
            { field: 'foo', order: 'ASC' },
            { foo: 'bar' },
        ]);

        rerender(<ControllerWrapper filter={{ foo: 'bar' }} sort={{ field: 'foo', order: 'ASC' }} perPage={42} />);

        assert.equal(crudGetManyAccumulate.mock.calls.length, 1);
        assert.deepEqual(crudGetMatchingAccumulate.mock.calls[3], [
            'posts',
            'comments@post_id',
            { page: 1, perPage: 42 },
            { field: 'foo', order: 'ASC' },
            { foo: 'bar' },
        ]);
    });

    it('should only call crudGetMatchingAccumulate when props are changed from outside', () => {
        const crudGetMatchingAccumulate = jest.fn();
        const crudGetManyAccumulate = jest.fn();
        const wrapper = shallow(
            <ReferenceInputController
                {...defaultProps}
                allowEmpty
                input={{ value: 5 }}
                crudGetManyAccumulate={crudGetManyAccumulate}
                crudGetMatchingAccumulate={crudGetMatchingAccumulate}
            />
        );
        expect(crudGetMatchingAccumulate).toHaveBeenCalledTimes(1);
        expect(crudGetManyAccumulate).toHaveBeenCalledTimes(1);

        wrapper.setProps({ filter: { foo: 'bar' } });
        expect(crudGetMatchingAccumulate.mock.calls.length).toBe(2);
        expect(crudGetManyAccumulate).toHaveBeenCalledTimes(1);

        wrapper.setProps({ sort: { field: 'foo', order: 'ASC' } });
        expect(crudGetMatchingAccumulate.mock.calls.length).toBe(3);
        expect(crudGetManyAccumulate).toHaveBeenCalledTimes(1);

        wrapper.setProps({ perPage: 42 });
        expect(crudGetMatchingAccumulate.mock.calls.length).toBe(4);
        expect(crudGetManyAccumulate).toHaveBeenCalledTimes(1);
    });

    it('should call crudGetManyAccumulate when input value changes', () => {
        const crudGetManyAccumulate = jest.fn();
        const wrapper = shallow(
            <ReferenceInputController
                {...defaultProps}
                input={{ value: 5 }}
                allowEmpty
                crudGetManyAccumulate={crudGetManyAccumulate}
            />
        );
        assert.equal(crudGetManyAccumulate.mock.calls.length, 1);
        wrapper.setProps({ input: { value: 6 } });
        assert.equal(crudGetManyAccumulate.mock.calls.length, 2);
    });

    it('should call crudGetManyAccumulate and crudGetMatchingAccumulate when record changes', () => {
        const crudGetManyAccumulate = jest.fn();
        const crudGetMatchingAccumulate = jest.fn();
        const wrapper = shallow(
            <ReferenceInputController
                {...defaultProps}
                allowEmpty
                input={{ value: 5 }}
                crudGetManyAccumulate={crudGetManyAccumulate}
                crudGetMatchingAccumulate={crudGetMatchingAccumulate}
            />
        );
        assert.equal(crudGetMatchingAccumulate.mock.calls.length, 1);
        assert.equal(crudGetManyAccumulate.mock.calls.length, 1);
        wrapper.setProps({ record: { id: 1 } });
        assert.equal(crudGetMatchingAccumulate.mock.calls.length, 2);
        assert.equal(crudGetManyAccumulate.mock.calls.length, 2);
    });
});
