import React from 'react';
import expect from 'expect';
import { cleanup, wait } from '@testing-library/react';
import ReferenceArrayInputController from './ReferenceArrayInputController';
import { renderWithRedux } from '../../util';
import { DataProviderContext } from '../../../lib';

describe('<ReferenceArrayInputController />', () => {
    const defaultProps = {
        children: jest.fn(),
        input: { value: undefined },
        record: undefined,
        basePath: '/tags',
        reference: 'tags',
        resource: 'posts',
        source: 'tag_ids',
    };

    afterEach(cleanup);

    it('should set loading to true as long as there are no references fetched and no selected references', () => {
        const children = jest.fn(() => <div />);
        renderWithRedux(
            <ReferenceArrayInputController
                {...defaultProps}
                input={{ value: [1, 2] }}
            >
                {children}
            </ReferenceArrayInputController>
        );

        expect(children.mock.calls[0][0].loading).toEqual(true);
    });

    it('should set loading to true as long as there are no references fetched and there are no data found for the references already selected', () => {
        const children = jest.fn(() => <div />);
        renderWithRedux(
            <ReferenceArrayInputController
                {...defaultProps}
                input={{ value: [1, 2] }}
            >
                {children}
            </ReferenceArrayInputController>
        );
        expect(children.mock.calls[0][0].loading).toEqual(true);
    });

    it('should set loading to false if the references are being searched but data from at least one selected reference was found', () => {
        const children = jest.fn(() => <div />);
        renderWithRedux(
            <ReferenceArrayInputController
                {...{
                    ...defaultProps,
                    input: { value: [1, 2] },
                }}
            >
                {children}
            </ReferenceArrayInputController>,
            {
                admin: {
                    resources: {
                        tags: {
                            data: {
                                1: {
                                    id: 1,
                                },
                            },
                            list: {
                                total: 42,
                            },
                        },
                    },
                },
            }
        );
        expect(children.mock.calls[0][0].loading).toEqual(false);
        expect(children.mock.calls[0][0].choices).toEqual([{ id: 1 }]);
    });

    it('should set error in case of references fetch error and there are no selected reference in the input value', async () => {
        const children = jest.fn(({ error }) => <div>{error}</div>);
        const { queryByText } = renderWithRedux(
            <DataProviderContext.Provider
                value={jest.fn((...args) => {
                    console.log(args);
                    return Promise.reject();
                })}
            >
                <ReferenceArrayInputController {...defaultProps}>
                    {children}
                </ReferenceArrayInputController>
            </DataProviderContext.Provider>
        );

        await wait(() =>
            expect(
                queryByText('ra.input.references.all_missing')
            ).not.toBeNull()
        );
    });

    it('should set error in case of references fetch error and there are no data found for the references already selected', () => {
        const children = jest.fn(() => <div />);
        renderWithRedux(
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
        expect(children.mock.calls[0][0].error).toEqual(
            '*ra.input.references.all_missing*'
        );
    });

    it('should not display an error in case of references fetch error but data from at least one selected reference was found', () => {
        const children = jest.fn(() => <div />);
        renderWithRedux(
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
        expect(children.mock.calls[0][0].error).toEqual(undefined);
        expect(children.mock.calls[0][0].choices).toEqual([{ id: 2 }]);
    });

    it('should set warning if references fetch fails but selected references are not empty', () => {
        const children = jest.fn(() => <div />);
        renderWithRedux(
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
        expect(children.mock.calls[0][0].warning).toEqual('*fetch error*');
    });

    it('should set warning if references were found but selected references are not complete', () => {
        const children = jest.fn(() => <div />);
        renderWithRedux(
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
        expect(children.mock.calls[0][0].warning).toEqual(
            '*ra.input.references.many_missing*'
        );
    });

    it('should set warning if references were found but selected references are empty', () => {
        const children = jest.fn(() => <div />);
        renderWithRedux(
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
        expect(children.mock.calls[0][0].warning).toEqual(
            '*ra.input.references.many_missing*'
        );
    });

    it('should not set warning if all references were found', () => {
        const children = jest.fn(() => <div />);
        renderWithRedux(
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
        expect(children.mock.calls[0][0].warning).toEqual(undefined);
    });

    it.skip('should call crudGetMatching on mount with default fetch values', () => {
        const crudGetMatching = jest.fn();
        renderWithRedux(
            <ReferenceArrayInputController {...defaultProps} allowEmpty />
        );
        expect(crudGetMatching.mock.calls[0]).toEqual([
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

    it.skip('should allow to customize crudGetMatching arguments with perPage, sort, and filter props', () => {
        const crudGetMatching = jest.fn();
        renderWithRedux(
            <ReferenceArrayInputController
                {...defaultProps}
                allowEmpty
                sort={{ field: 'foo', order: 'ASC' }}
                perPage={5}
                filter={{ q: 'foo' }}
            />
        );
        expect(crudGetMatching.mock.calls[0]).toEqual([
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

    it.skip('should call crudGetMatching when setFilter is called', () => {
        const wrapper = renderWithRedux(
            <ReferenceArrayInputController {...defaultProps} allowEmpty />
        );
        // wrapper.instance().setFilter('bar');
        // exp(crudGetMatching.mock.calls[1], [
        //     'tags',
        //     'posts@tag_ids',
        //     {
        //         page: 1,
        //         perPage: 25,
        //     },
        //     {
        //         field: 'id',
        //         order: 'DESC',
        //     },
        //     {
        //         q: 'bar',
        //     },
        // ]);
    });

    it.skip('should use custom filterToQuery function prop', () => {
        const wrapper = renderWithRedux(
            <ReferenceArrayInputController
                {...defaultProps}
                allowEmpty
                filterToQuery={searchText => ({ foo: searchText })}
            />
        );
        // wrapper.instance().setFilter('bar');
        // assert.deepEqual(crudGetMatching.mock.calls[1], [
        //     'tags',
        //     'posts@tag_ids',
        //     {
        //         page: 1,
        //         perPage: 25,
        //     },
        //     {
        //         field: 'id',
        //         order: 'DESC',
        //     },
        //     {
        //         foo: 'bar',
        //     },
        // ]);
    });

    it.skip('should call crudGetMany on mount if value is set', () => {
        // const crudGetMany = jest.fn();
        renderWithRedux(
            <ReferenceArrayInputController
                {...defaultProps}
                allowEmpty
                input={{ value: [5, 6] }}
            />
        );
        // expect(crudGetMany.mock.calls[0]).toEqual(['tags', [5, 6]]);
    });

    it.skip('should only call crudGetMatching when calling setFilter', () => {
        const wrapper = renderWithRedux(
            <ReferenceArrayInputController
                {...defaultProps}
                input={{ value: [5] }}
            />
        );
        // assert.equal(crudGetMatching.mock.calls.length, 1);
        // assert.equal(crudGetMany.mock.calls.length, 1);

        // wrapper.instance().setFilter('bar');
        // assert.equal(crudGetMatching.mock.calls.length, 2);
        // assert.equal(crudGetMany.mock.calls.length, 1);
    });

    it.skip('should only call crudGetMatching when props are changed from outside', () => {
        const wrapper = renderWithRedux(
            <ReferenceArrayInputController
                {...defaultProps}
                allowEmpty
                input={{ value: [5] }}
            />
        );
        // assert.equal(crudGetMatching.mock.calls.length, 1);
        // assert.equal(crudGetMany.mock.calls.length, 1);

        // wrapper.setProps({ filter: { foo: 'bar' } });
        // assert.deepEqual(crudGetMatching.mock.calls[1], [
        //     'tags',
        //     'posts@tag_ids',
        //     { page: 1, perPage: 25 },
        //     { field: 'id', order: 'DESC' },
        //     { foo: 'bar' },
        // ]);
        // assert.equal(crudGetMany.mock.calls.length, 1);

        // wrapper.setProps({ sort: { field: 'foo', order: 'ASC' } });
        // assert.deepEqual(crudGetMatching.mock.calls[2], [
        //     'tags',
        //     'posts@tag_ids',
        //     { page: 1, perPage: 25 },
        //     { field: 'foo', order: 'ASC' },
        //     { foo: 'bar' },
        // ]);
        // assert.equal(crudGetMany.mock.calls.length, 1);

        // wrapper.setProps({ perPage: 42 });
        // assert.deepEqual(crudGetMatching.mock.calls[3], [
        //     'tags',
        //     'posts@tag_ids',
        //     { page: 1, perPage: 42 },
        //     { field: 'foo', order: 'ASC' },
        //     { foo: 'bar' },
        // ]);
        // assert.equal(crudGetMany.mock.calls.length, 1);
    });

    it.skip('should call crudGetMany when input value changes', () => {
        const wrapper = renderWithRedux(
            <ReferenceArrayInputController
                {...defaultProps}
                input={{ value: [5] }}
                allowEmpty
            />
        );
        // assert.equal(crudGetMany.mock.calls.length, 1);
        // wrapper.setProps({ input: { value: [6] } });
        // assert.equal(crudGetMany.mock.calls.length, 2);
    });

    it.skip('should call crudGetMany when input value changes only with the additional input values', () => {
        const wrapper = renderWithRedux(
            <ReferenceArrayInputController
                {...defaultProps}
                input={{ value: [5] }}
                allowEmpty
            />
        );
        // expect(
        //     crudGetMany.mock.calls[crudGetMany.mock.calls.length - 1]
        // ).toEqual([defaultProps.reference, [5]]);
        // wrapper.setProps({ input: { value: [5, 6] } });
        // expect(
        //     crudGetMany.mock.calls[crudGetMany.mock.calls.length - 1]
        // ).toEqual([defaultProps.reference, [6]]);
    });

    it.skip('should not call crudGetMany when already fetched input value changes', () => {
        const wrapper = renderWithRedux(
            <ReferenceArrayInputController
                {...defaultProps}
                input={{ value: [5, 6] }}
                allowEmpty
            />
        );
        // expect(crudGetMany.mock.calls[0]).toEqual([
        //     defaultProps.reference,
        //     [5, 6],
        // ]);
        // wrapper.setProps({ input: { value: [6] } });
        // expect(crudGetMany.mock.calls.length).toEqual(1);
    });

    it.skip('should only call crudGetOne and not crudGetMatching when only the record changes', () => {
        const wrapper = renderWithRedux(
            <ReferenceArrayInputController
                {...defaultProps}
                allowEmpty
                input={{ value: [5] }}
            />
        );
        // assert.equal(crudGetMatching.mock.calls.length, 1);
        // assert.equal(crudGetMany.mock.calls.length, 1);
        // wrapper.setProps({ record: { id: 1 } });
        // assert.equal(crudGetMatching.mock.calls.length, 2);
        // assert.equal(crudGetMany.mock.calls.length, 1);
    });
});
