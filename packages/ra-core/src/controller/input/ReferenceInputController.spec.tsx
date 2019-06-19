import React from 'react';
import { WrappedFieldInputProps } from 'redux-form';
import { cleanup } from 'react-testing-library';
import omit from 'lodash/omit';

import renderWithRedux from '../../util/renderWithRedux';
import ReferenceInputController from './ReferenceInputController';
import { crudGetMatchingAccumulate } from '../../actions';
import * as referenceDataStatus from './referenceDataStatus';

describe('<ReferenceInputController />', () => {
    const defaultProps = {
        basePath: '/comments',
        children: jest.fn(),
        meta: {},
        input: { value: undefined } as WrappedFieldInputProps,
        onChange: jest.fn(),
        reference: 'posts',
        resource: 'comments',
        source: 'post_id',
        translate: x => `*${x}*`,
    };

    afterEach(cleanup);

    // it('should fetch reference and matchingReferences', () => {
    //     const children = jest.fn().mockReturnValue(<p>child</p>);
    //     const { dispatch } = renderWithRedux(
    //         <ReferenceInputController
    //             {...{
    //                 ...defaultProps,
    //                 input: { value: 1 } as WrappedFieldInputProps,
    //                 isLoading: true,
    //             }}
    //         >
    //             {children}
    //         </ReferenceInputController>,
    //         {
    //             admin: {
    //                 resources: { posts: { data: { 1: { id: 1 } } } },
    //                 references: {
    //                     possibleValues: { 'comments@post_id': [2, 1] },
    //                 },
    //             },
    //         }
    //     );

    //     expect(
    //         omit(children.mock.calls[0][0], [
    //             'onChange',
    //             'setPagination',
    //             'setFilter',
    //             'setSort',
    //         ])
    //     ).toEqual({
    //         choices: [{ id: 1 }],
    //         error: null,
    //         filter: {},
    //         isLoading: false,
    //         pagination: { page: 1, perPage: 25 },
    //         sort: { field: 'id', order: 'DESC' },
    //         warning: null,
    //     });

    //     expect(dispatch).toBeCalledTimes(2);
    //     expect(dispatch.mock.calls[0][0].type).toBe(
    //         'RA/CRUD_GET_MATCHING_ACCUMULATE'
    //     );
    //     expect(dispatch.mock.calls[1][0].type).toBe(
    //         'RA/CRUD_GET_MANY_ACCUMULATE'
    //     );
    // });

    // it('should set isLoading to true if the references are being searched and there is no reference already selected', () => {
    //     const children = jest.fn().mockReturnValue(<p>child</p>);
    //     renderWithRedux(
    //         <ReferenceInputController
    //             {...{
    //                 ...defaultProps,
    //             }}
    //         >
    //             {children}
    //         </ReferenceInputController>,
    //         {
    //             admin: {
    //                 resources: { posts: { data: { 1: { id: 1 } } } },
    //                 references: {
    //                     possibleValues: { 'comments@post_id': null },
    //                 },
    //             },
    //         }
    //     );
    //     expect(children.mock.calls[0][0].isLoading).toBe(true);
    // });

    // it('should set isLoading to false if the references are being searched but a selected reference have data', () => {
    //     const children = jest.fn().mockReturnValue(<p>child</p>);
    //     renderWithRedux(
    //         <ReferenceInputController
    //             {...{
    //                 ...defaultProps,
    //                 input: { value: 1 } as WrappedFieldInputProps,
    //             }}
    //         >
    //             {children}
    //         </ReferenceInputController>,
    //         {
    //             admin: {
    //                 resources: { posts: { data: { 1: { id: 1 } } } },
    //                 references: {
    //                     possibleValues: { 'comments@post_id': null },
    //                 },
    //             },
    //         }
    //     );
    //     expect(children.mock.calls[0][0].isLoading).toBe(false);
    //     expect(children.mock.calls[0][0].choices).toEqual([{ id: 1 }]);
    // });

    // it('should set isLoading to false if the references were found but a selected reference does not have data', () => {
    //     const children = jest.fn().mockReturnValue(<p>child</p>);
    //     renderWithRedux(
    //         <ReferenceInputController
    //             {...{
    //                 ...defaultProps,
    //                 input: { value: 1 } as WrappedFieldInputProps,
    //             }}
    //         >
    //             {children}
    //         </ReferenceInputController>,
    //         {
    //             admin: {
    //                 resources: {
    //                     posts: { data: { 1: { id: 1 }, 2: { id: 2 } } },
    //                 },
    //                 references: {
    //                     possibleValues: { 'comments@post_id': [2, 1, 3] },
    //                 },
    //             },
    //         }
    //     );
    //     expect(children.mock.calls[0][0].isLoading).toBe(false);
    //     expect(children.mock.calls[0][0].choices).toEqual([
    //         { id: 2 },
    //         { id: 1 },
    //     ]);
    // });

    it('should call getDataStatus with referenceRecord and matchingReferences', () => {
        const children = jest.fn().mockReturnValue(<p>child</p>);
        const spy = jest.spyOn(referenceDataStatus, 'getStatusForInput');
        renderWithRedux(
            <ReferenceInputController
                {...{
                    ...defaultProps,
                    input: { value: 5 } as WrappedFieldInputProps,
                }}
            >
                {children}
            </ReferenceInputController>,
            {
                admin: {
                    resources: {
                        posts: {
                            data: { 5: { id: 5 } },
                        },
                    },
                    references: {
                        possibleValues: {
                            'comments@post_id': [2, 1],
                        },
                    },
                },
            }
        );
        expect(spy.mock.calls[0][0].input).toEqual({ value: 5 });
        expect(spy.mock.calls[0][0].matchingReferences).toEqual([2, 1]);
        expect(spy.mock.calls[0][0].referenceRecord).toEqual({ id: 5 });
    });

    it('should call useReferenceSearch', () => {
        // const crudGetMatchingAccumulate = jest.fn();
        const { dispatch } = renderWithRedux(
            <ReferenceInputController {...defaultProps} allowEmpty />
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

    // it('should allow to customize crudGetMatchingAccumulate arguments with perPage, sort, and filter props', () => {
    //     const crudGetMatchingAccumulate = jest.fn();
    //     renderWithRedux(
    //         <ReferenceInputController
    //             {...defaultProps}
    //             allowEmpty
    //             sort={{ field: 'foo', order: 'ASC' }}
    //             perPage={5}
    //             filter={{ q: 'foo' }}
    //         />
    //     );
    //     assert.deepEqual(crudGetMatchingAccumulate.mock.calls[0], [
    //         'posts',
    //         'comments@post_id',
    //         {
    //             page: 1,
    //             perPage: 5,
    //         },
    //         {
    //             field: 'foo',
    //             order: 'ASC',
    //         },
    //         {
    //             q: 'foo',
    //         },
    //     ]);
    // });

    // it('should allow to customize crudGetMatchingAccumulate arguments with perPage, sort, and filter props without loosing original default filter', () => {
    //     const crudGetMatchingAccumulate = jest.fn();
    //     const wrapper = renderWithRedux(
    //         <ReferenceInputController
    //             {...defaultProps}
    //             allowEmpty
    //             sort={{ field: 'foo', order: 'ASC' }}
    //             perPage={5}
    //             filter={{ foo: 'bar' }}
    //         />
    //     );

    //     wrapper.instance().setFilter('search_me');

    //     assert.deepEqual(crudGetMatchingAccumulate.mock.calls[1], [
    //         'posts',
    //         'comments@post_id',
    //         {
    //             page: 1,
    //             perPage: 5,
    //         },
    //         {
    //             field: 'foo',
    //             order: 'ASC',
    //         },
    //         {
    //             foo: 'bar',
    //             q: 'search_me',
    //         },
    //     ]);
    // });

    // it('should call crudGetMatchingAccumulate when setFilter is called', () => {
    //     const crudGetMatchingAccumulate = jest.fn();
    //     const wrapper = renderWithRedux(
    //         <ReferenceInputController {...defaultProps} allowEmpty />
    //     );
    //     wrapper.instance().setFilter('bar');
    //     assert.deepEqual(crudGetMatchingAccumulate.mock.calls[1], [
    //         'posts',
    //         'comments@post_id',
    //         {
    //             page: 1,
    //             perPage: 25,
    //         },
    //         {
    //             field: 'id',
    //             order: 'DESC',
    //         },
    //         {
    //             q: 'bar',
    //         },
    //     ]);
    // });

    // it('should use custom filterToQuery function prop', () => {
    //     const crudGetMatchingAccumulate = jest.fn();
    //     const wrapper = renderWithRedux(
    //         <ReferenceInputController
    //             {...defaultProps}
    //             allowEmpty
    //             filterToQuery={searchText => ({ foo: searchText })}
    //         />
    //     );
    //     wrapper.instance().setFilter('bar');
    //     assert.deepEqual(crudGetMatchingAccumulate.mock.calls[1], [
    //         'posts',
    //         'comments@post_id',
    //         {
    //             page: 1,
    //             perPage: 25,
    //         },
    //         {
    //             field: 'id',
    //             order: 'DESC',
    //         },
    //         {
    //             foo: 'bar',
    //         },
    //     ]);
    // });

    // it('should call crudGetManyAccumulate on mount if value is set', () => {
    //     const crudGetManyAccumulate = jest.fn();
    //     renderWithRedux(
    //         <ReferenceInputController
    //             {...defaultProps}
    //             allowEmpty
    //             input={{ value: 5 } as WrappedFieldInputProps}
    //         />
    //     );
    //     assert.deepEqual(crudGetManyAccumulate.mock.calls[0], ['posts', [5]]);
    // });

    // it('should pass onChange down to child component', () => {
    //     const children = jest.fn().mockReturnValue(<p>child</p>);
    //     const onChange = jest.fn();
    //     renderWithRedux(
    //         <ReferenceInputController
    //             {...defaultProps}
    //             allowEmpty
    //             onChange={onChange}
    //         >
    //             {children}
    //         </ReferenceInputController>
    //     );
    //     assert.deepEqual(children.mock.calls[0][0].onChange, onChange);
    // });

    // it('should only call crudGetMatchingAccumulate when calling setFilter', () => {
    //     const crudGetMatchingAccumulate = jest.fn();
    //     const crudGetManyAccumulate = jest.fn();
    //     const wrapper = renderWithRedux(
    //         <ReferenceInputController
    //             {...defaultProps}
    //             allowEmpty
    //             input={{ value: 5 } as WrappedFieldInputProps}
    //         />
    //     );
    //     assert.equal(crudGetMatchingAccumulate.mock.calls.length, 1);
    //     assert.equal(crudGetManyAccumulate.mock.calls.length, 1);

    //     wrapper.instance().setFilter('bar');
    //     assert.equal(crudGetMatchingAccumulate.mock.calls.length, 2);
    //     assert.equal(crudGetManyAccumulate.mock.calls.length, 1);
    // });

    // it('should only call crudGetMatching when props are changed from outside', () => {
    //     const crudGetMatchingAccumulate = jest.fn();
    //     const crudGetManyAccumulate = jest.fn();
    //     const ControllerWrapper = props => (
    //         <ReferenceInputController
    //             {...defaultProps}
    //             allowEmpty
    //             input={{ value: 5 }}
    //             crudGetManyAccumulate={crudGetManyAccumulate}
    //             crudGetMatchingAccumulate={crudGetMatchingAccumulate}
    //             {...props}
    //         >
    //             {() => null}
    //         </ReferenceInputController>
    //     );

    //     const { rerender } = render(<ControllerWrapper />);
    //     assert.equal(crudGetMatchingAccumulate.mock.calls.length, 1);
    //     assert.equal(crudGetManyAccumulate.mock.calls.length, 1);

    //     rerender(<ControllerWrapper filter={{ foo: 'bar' }} />);

    //     assert.equal(crudGetManyAccumulate.mock.calls.length, 1);
    //     assert.deepEqual(crudGetMatchingAccumulate.mock.calls[1], [
    //         'posts',
    //         'comments@post_id',
    //         { page: 1, perPage: 25 },
    //         { field: 'id', order: 'DESC' },
    //         { foo: 'bar' },
    //     ]);

    //     rerender(
    //         <ControllerWrapper
    //             filter={{ foo: 'bar' }}
    //             sort={{ field: 'foo', order: 'ASC' }}
    //         />
    //     );

    //     assert.equal(crudGetManyAccumulate.mock.calls.length, 1);
    //     assert.deepEqual(crudGetMatchingAccumulate.mock.calls[2], [
    //         'posts',
    //         'comments@post_id',
    //         { page: 1, perPage: 25 },
    //         { field: 'foo', order: 'ASC' },
    //         { foo: 'bar' },
    //     ]);

    //     rerender(
    //         <ControllerWrapper
    //             filter={{ foo: 'bar' }}
    //             sort={{ field: 'foo', order: 'ASC' }}
    //             perPage={42}
    //         />
    //     );

    //     assert.equal(crudGetManyAccumulate.mock.calls.length, 1);
    //     assert.deepEqual(crudGetMatchingAccumulate.mock.calls[3], [
    //         'posts',
    //         'comments@post_id',
    //         { page: 1, perPage: 42 },
    //         { field: 'foo', order: 'ASC' },
    //         { foo: 'bar' },
    //     ]);
    // });

    // it('should only call crudGetMatchingAccumulate when props are changed from outside', () => {
    //     const crudGetMatchingAccumulate = jest.fn();
    //     const crudGetManyAccumulate = jest.fn();
    //     const wrapper = renderWithRedux(
    //         <ReferenceInputController
    //             {...defaultProps}
    //             allowEmpty
    //             input={{ value: 5 } as WrappedFieldInputProps}
    //         />
    //     );
    //     expect(crudGetMatchingAccumulate).toHaveBeenCalledTimes(1);
    //     expect(crudGetManyAccumulate).toHaveBeenCalledTimes(1);

    //     wrapper.setProps({ filter: { foo: 'bar' } });
    //     expect(crudGetMatchingAccumulate.mock.calls.length).toBe(2);
    //     expect(crudGetManyAccumulate).toHaveBeenCalledTimes(1);

    //     wrapper.setProps({ sort: { field: 'foo', order: 'ASC' } });
    //     expect(crudGetMatchingAccumulate.mock.calls.length).toBe(3);
    //     expect(crudGetManyAccumulate).toHaveBeenCalledTimes(1);

    //     wrapper.setProps({ perPage: 42 });
    //     expect(crudGetMatchingAccumulate.mock.calls.length).toBe(4);
    //     expect(crudGetManyAccumulate).toHaveBeenCalledTimes(1);
    // });

    // it('should call crudGetManyAccumulate when input value changes', () => {
    //     const crudGetManyAccumulate = jest.fn();
    //     const wrapper = renderWithRedux(
    //         <ReferenceInputController
    //             {...defaultProps}
    //             input={{ value: 5 } as WrappedFieldInputProps}
    //             allowEmpty
    //         />
    //     );
    //     assert.equal(crudGetManyAccumulate.mock.calls.length, 1);
    //     wrapper.setProps({ input: { value: 6 } });
    //     assert.equal(crudGetManyAccumulate.mock.calls.length, 2);
    // });

    // it('should call crudGetManyAccumulate and crudGetMatchingAccumulate when record changes', () => {
    //     const crudGetManyAccumulate = jest.fn();
    //     const crudGetMatchingAccumulate = jest.fn();
    //     const wrapper = renderWithRedux(
    //         <ReferenceInputController
    //             {...defaultProps}
    //             allowEmpty
    //             input={{ value: 5 } as WrappedFieldInputProps}
    //         />
    //     );
    //     assert.equal(crudGetMatchingAccumulate.mock.calls.length, 1);
    //     assert.equal(crudGetManyAccumulate.mock.calls.length, 1);
    //     wrapper.setProps({ record: { id: 1 } });
    //     assert.equal(crudGetMatchingAccumulate.mock.calls.length, 2);
    //     assert.equal(crudGetManyAccumulate.mock.calls.length, 2);
    // });
});
