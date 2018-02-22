import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { ReferenceArrayInputController } from './ReferenceArrayInputController';

describe('<ReferenceArrayInputController />', () => {
    const defaultProps = {
        children: jest.fn(),
        crudGetMatching: () => true,
        crudGetMany: () => true,
        input: {},
        matchingReferences: [],
        meta: {},
        record: {},
        reference: 'tags',
        resource: 'posts',
        source: 'tag_ids',
        translate: x => `*${x}*`,
    };

    it('should set isLoading to true as long as there are no references fetched and no selected references', () => {
        const children = jest.fn();
        shallow(
            <ReferenceArrayInputController
                {...{
                    ...defaultProps,
                    matchingReferences: null,
                    input: {},
                }}
            >
                {children}
            </ReferenceArrayInputController>
        );

        assert.equal(children.mock.calls[0][0].isLoading, true);
    });

    it('should set isLoading to true as long as there are no references fetched and there are no data found for the references already selected', () => {
        const children = jest.fn();
        shallow(
            <ReferenceArrayInputController
                {...{
                    ...defaultProps,
                    matchingReferences: null,
                    input: { value: [1, 2] },
                    referenceRecords: [],
                }}
            >
                {children}
            </ReferenceArrayInputController>
        );
        assert.equal(children.mock.calls[0][0].isLoading, true);
    });

    it('should set isLoading to false if the references are being searched but data from at least one selected reference was found', () => {
        const children = jest.fn();
        shallow(
            <ReferenceArrayInputController
                {...{
                    ...defaultProps,
                    matchingReferences: null,
                    input: { value: [1, 2] },
                    referenceRecords: [{ id: 1 }],
                }}
            >
                {children}
            </ReferenceArrayInputController>
        );
        assert.equal(children.mock.calls[0][0].isLoading, false);
        assert.deepEqual(children.mock.calls[0][0].choices, [{ id: 1 }]);
    });

    it('should set error in case of references fetch error and there are no selected reference in the input value', () => {
        const children = jest.fn();
        shallow(
            <ReferenceArrayInputController
                {...{
                    ...defaultProps,
                    matchingReferences: { error: 'fetch error' },
                    input: {},
                    referenceRecords: [],
                }}
            >
                {children}
            </ReferenceArrayInputController>
        );
        assert.equal(
            children.mock.calls[0][0].error,
            '*ra.input.references.all_missing*'
        );
    });

    it('should set error in case of references fetch error and there are no data found for the references already selected', () => {
        const children = jest.fn();
        shallow(
            <ReferenceArrayInputController
                {...{
                    ...defaultProps,
                    matchingReferences: { error: 'fetch error' },
                    input: { value: [1] },
                    referenceRecords: [],
                }}
            >
                {children}
            </ReferenceArrayInputController>
        );
        assert.equal(
            children.mock.calls[0][0].error,
            '*ra.input.references.all_missing*'
        );
    });

    it('should not display an error in case of references fetch error but data from at least one selected reference was found', () => {
        const children = jest.fn();
        shallow(
            <ReferenceArrayInputController
                {...{
                    ...defaultProps,
                    matchingReferences: { error: 'fetch error' },
                    input: { value: [1, 2] },
                    referenceRecords: [{ id: 2 }],
                }}
            >
                {children}
            </ReferenceArrayInputController>
        );
        assert.equal(children.mock.calls[0][0].error, undefined);
        assert.deepEqual(children.mock.calls[0][0].choices, [{ id: 2 }]);
    });

    it('should set warning if references fetch fails but selected references are not empty', () => {
        const children = jest.fn();
        shallow(
            <ReferenceArrayInputController
                {...{
                    ...defaultProps,
                    matchingReferences: { error: 'fetch error' },
                    input: { value: [1, 2] },
                    referenceRecords: [{ id: 2 }],
                }}
            >
                {children}
            </ReferenceArrayInputController>
        );
        assert.equal(children.mock.calls[0][0].warning, '*fetch error*');
    });

    it('should set warning if references were found but selected references are not complete', () => {
        const children = jest.fn();
        shallow(
            <ReferenceArrayInputController
                {...{
                    ...defaultProps,
                    matchingReferences: [],
                    input: { value: [1, 2] },
                    referenceRecords: [{ id: 2 }],
                }}
            >
                {children}
            </ReferenceArrayInputController>
        );
        assert.equal(
            children.mock.calls[0][0].warning,
            '*ra.input.references.many_missing*'
        );
    });

    it('should set warning if references were found but selected references are empty', () => {
        const children = jest.fn();
        shallow(
            <ReferenceArrayInputController
                {...{
                    ...defaultProps,
                    matchingReferences: [],
                    input: { value: [1, 2] },
                    referenceRecords: [],
                }}
            >
                {children}
            </ReferenceArrayInputController>
        );
        assert.equal(
            children.mock.calls[0][0].warning,
            '*ra.input.references.many_missing*'
        );
    });

    it('should not set warning if all references were found', () => {
        const children = jest.fn();
        shallow(
            <ReferenceArrayInputController
                {...{
                    ...defaultProps,
                    matchingReferences: [],
                    input: { value: [1, 2] },
                    referenceRecords: [{ id: 1 }, { id: 2 }],
                }}
            >
                {children}
            </ReferenceArrayInputController>
        );
        assert.equal(children.mock.calls[0][0].warning, undefined);
    });

    it('should pass onChange down to child component', () => {
        const onChange = jest.fn();
        const children = jest.fn();
        shallow(
            <ReferenceArrayInputController
                {...defaultProps}
                allowEmpty
                onChange={onChange}
            >
                {children}
            </ReferenceArrayInputController>
        );
        assert.equal(children.mock.calls[0][0].onChange, onChange);
    });

    it('should call crudGetMatching on mount with default fetch values', () => {
        const crudGetMatching = jest.fn();
        shallow(
            <ReferenceArrayInputController
                {...defaultProps}
                allowEmpty
                crudGetMatching={crudGetMatching}
            />
        );
        assert.deepEqual(crudGetMatching.mock.calls[0], [
            'tags',
            'posts@tag_ids',
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

    it('should allow to customize crudGetMatching arguments with perPage, sort, and filter props', () => {
        const crudGetMatching = jest.fn();
        shallow(
            <ReferenceArrayInputController
                {...defaultProps}
                allowEmpty
                crudGetMatching={crudGetMatching}
                sort={{ field: 'foo', order: 'ASC' }}
                perPage={5}
                filter={{ q: 'foo' }}
            />
        );
        assert.deepEqual(crudGetMatching.mock.calls[0], [
            'tags',
            'posts@tag_ids',
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

    it('should call crudGetMatching when setFilter is called', () => {
        const crudGetMatching = jest.fn();
        const wrapper = shallow(
            <ReferenceArrayInputController
                {...defaultProps}
                allowEmpty
                crudGetMatching={crudGetMatching}
            />
        );
        wrapper.instance().setFilter('bar');
        assert.deepEqual(crudGetMatching.mock.calls[1], [
            'tags',
            'posts@tag_ids',
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
        const crudGetMatching = jest.fn();
        const wrapper = shallow(
            <ReferenceArrayInputController
                {...defaultProps}
                allowEmpty
                crudGetMatching={crudGetMatching}
                filterToQuery={searchText => ({ foo: searchText })}
            />
        );
        wrapper.instance().setFilter('bar');
        assert.deepEqual(crudGetMatching.mock.calls[1], [
            'tags',
            'posts@tag_ids',
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

    it('should call crudGetMany on mount if value is set', () => {
        const crudGetMany = jest.fn();
        shallow(
            <ReferenceArrayInputController
                {...defaultProps}
                allowEmpty
                crudGetMany={crudGetMany}
                input={{ value: [5, 6] }}
            />
        );
        assert.deepEqual(crudGetMany.mock.calls[0], ['tags', [5, 6]]);
    });

    it('should only call crudGetMatching when calling setFilter', () => {
        const crudGetMatching = jest.fn();
        const crudGetMany = jest.fn();
        const wrapper = shallow(
            <ReferenceArrayInputController
                {...defaultProps}
                input={{ value: [5] }}
                crudGetMany={crudGetMany}
                crudGetMatching={crudGetMatching}
            />
        );
        expect(crudGetMatching).toHaveBeenCalledTimes(1);
        expect(crudGetMany).toHaveBeenCalledTimes(1);

        wrapper.instance().setFilter('bar');
        expect(crudGetMatching).toHaveBeenCalledTimes(2);
        expect(crudGetMany).toHaveBeenCalledTimes(1);
    });

    it('should call crudGetMany when input value changes', () => {
        const crudGetMany = jest.fn();
        const wrapper = shallow(
            <ReferenceArrayInputController
                {...defaultProps}
                input={{ value: [5] }}
                allowEmpty
                crudGetMany={crudGetMany}
            />
        );
        expect(crudGetMany.mock.calls.length).toBe(1);
        wrapper.setProps({ input: { value: [6] } });
        expect(crudGetMany.mock.calls.length).toBe(2);
    });

    it('should call crudGetOne and crudGetMatching when record changes', () => {
        const crudGetMany = jest.fn();
        const crudGetMatching = jest.fn();
        const wrapper = shallow(
            <ReferenceArrayInputController
                {...defaultProps}
                allowEmpty
                input={{ value: [5] }}
                crudGetMany={crudGetMany}
                crudGetMatching={crudGetMatching}
            />
        );
        expect(crudGetMany.mock.calls.length).toBe(1);
        expect(crudGetMatching.mock.calls.length).toBe(1);
        wrapper.setProps({ record: { id: 1 } });
        expect(crudGetMany.mock.calls.length).toBe(2);
        expect(crudGetMatching.mock.calls.length).toBe(2);
    });
});
