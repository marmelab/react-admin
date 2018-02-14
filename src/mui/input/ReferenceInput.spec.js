import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { getDataStatus, ReferenceInput } from './ReferenceInput';

describe('Reference Input', () => {
    describe('getDataStatus', () => {
        const data = {
            input: {},
            matchingReferences: null,
            referenceRecord: null,
            translate: x => `*${x}*`,
        };

        it('should indicate whether the data are ready or not', () => {
            const test = (data, waiting, explanation) =>
                assert.equal(getDataStatus(data).waiting, waiting, explanation);
            test(
                data,
                true,
                'we must wait until the references fetch is finished and there is no reference already associated with the resource.'
            );
            test(
                { ...data, input: { value: 1 } },
                true,
                'we must wait until the references fetch is finished and linked reference data are not found.'
            );
            test(
                { ...data, input: { value: 1 }, referenceRecord: [{ id: 1 }] },
                false,
                'it is ready if the references fetch is not finished but linked reference data are found.'
            );
            test(
                { ...data, input: { value: 1 }, matchingReferences: [] },
                false,
                'it is ready if linked reference data are not found, but the references fetch is finished.'
            );
            test(
                {
                    ...data,
                    input: { value: 1 },
                    matchingReferences: { error: 'error' },
                },
                false,
                'it is ready if linked reference data are not found, but the references fetch is finished with error.'
            );
        });

        it('should claim an error if needed', () => {
            const test = (data, error, explanation) => {
                const status = getDataStatus(data);
                assert.equal(status.waiting, false);
                assert.equal(status.error, error, explanation);
            };
            test(
                {
                    ...data,
                    matchingReferences: { error: 'error' },
                },
                '*error*',
                'there is an error if the references fetch fails and there is no linked reference'
            );
            test(
                {
                    ...data,
                    matchingReferences: { error: 'error' },
                    input: { value: 1 },
                },
                '*aor.input.references.single_missing*',
                'there is an error if the references fetch fails and there is a linked reference without data'
            );
            test(
                {
                    ...data,
                    matchingReferences: { error: 'error' },
                    input: { value: 1 },
                    referenceRecord: [{ id: 1 }],
                },
                null,
                'there is no error if the references fetch fails but there is a linked reference with data'
            );
            test(
                {
                    ...data,
                    matchingReferences: [{ id: 2 }],
                    input: { value: 1 },
                    referenceRecord: null,
                },
                null,
                'there is no error if there is a linked reference without data but the references fetch succeeds'
            );
            test(
                {
                    ...data,
                    matchingReferences: [],
                    input: { value: 1 },
                    referenceRecord: null,
                },
                null,
                'there is no error if there is a linked reference without data but the references fetch succeeds  even empty'
            );
            test(
                {
                    ...data,
                    matchingReferences: [{ id: 1 }],
                },
                null,
                'there is no error if the references fetch succeeds and there is no linked reference'
            );
        });

        it('should claim a warning if needed', () => {
            const test = (data, warning, explanation) => {
                const status = getDataStatus(data);
                assert.equal(status.waiting, false);
                assert.equal(status.error, null);
                assert.equal(status.warning, warning, explanation);
            };

            test(
                {
                    ...data,
                    matchingReferences: { error: 'error on fetch' },
                    input: { value: 1 },
                    referenceRecord: [{ id: 1 }],
                },
                '*error on fetch*',
                'there is a warning if the references fetch fails but there is a linked reference with data'
            );
            test(
                {
                    ...data,
                    matchingReferences: [{ id: 2 }],
                    input: { value: 1 },
                    referenceRecord: null,
                },
                '*aor.input.references.single_missing*',
                'there is a warning if there is a linked reference without data but the references fetch succeeds'
            );
            test(
                {
                    ...data,
                    matchingReferences: [],
                    input: { value: 1 },
                    referenceRecord: [{ value: 1 }],
                },
                null,
                'there is no warning if there is a linked reference with data and the references fetch succeeds even empty'
            );
            test(
                {
                    ...data,
                    matchingReferences: [],
                },
                null,
                'there is no warning if the references fetch succeeds and there is no linked reference'
            );
        });

        it('should return choices consistent with the data status', () => {
            const test = (data, warning, choices, explanation) => {
                const status = getDataStatus(data);
                assert.equal(status.waiting, false);
                assert.equal(status.error, null);
                assert.equal(status.warning, warning);
                assert.deepEqual(status.choices, choices, explanation);
            };

            test(
                {
                    ...data,
                    matchingReferences: { error: 'error on fetch' },
                    input: { value: 1 },
                    referenceRecord: { id: 1 },
                },
                '*error on fetch*',
                [{ id: 1 }],
                'if the references fetch fails the single choice is the linked reference'
            );
            test(
                {
                    ...data,
                    matchingReferences: [{ id: 2 }],
                    input: { value: 1 },
                    referenceRecord: null,
                },
                '*aor.input.references.single_missing*',
                [{ id: 2 }],
                'if there is no data for the linked reference, the choices are those returned by fetch'
            );
            test(
                {
                    ...data,
                    matchingReferences: [{ id: 1 }, { id: 2 }],
                    input: { value: 1 },
                    referenceRecord: { id: 1 },
                },
                null,
                [{ id: 1 }, { id: 2 }],
                'if there is data for the linked reference and the references fetch succeeds, we use the choices returned by fetch (that will include the linked reference, but this is not managed at getDataStatus method level.)'
            );
        });
    });

    describe('<ReferenceInput />', () => {
        const defaultProps = {
            crudGetMatching: () => true,
            crudGetOne: () => true,
            input: {},
            reference: 'posts',
            resource: 'comments',
            source: 'post_id',
            matchingReferences: [{ id: 1 }],
            translate: x => `*${x}*`,
            meta: {},
        };
        const MyComponent = () => <span id="mycomponent" />;

        it('should render a ReferenceLoadingProgress if the references are being searched and a selected reference does not have data', () => {
            const wrapper = shallow(
                <ReferenceInput
                    {...{
                        ...defaultProps,
                        matchingReferences: null,
                        referenceRecord: null,
                        input: { value: 1 },
                    }}
                >
                    <MyComponent />
                </ReferenceInput>
            );
            const MyComponentElement = wrapper.find('MyComponent');
            assert.equal(MyComponentElement.length, 0);
            const ReferenceLoadingProgressElement = wrapper.find(
                'ReferenceLoadingProgress'
            );
            assert.equal(ReferenceLoadingProgressElement.length, 1);
        });

        it('should render a ReferenceLoadingProgress if the references are being searched and there is no reference already selected', () => {
            const wrapper = shallow(
                <ReferenceInput
                    {...{
                        ...defaultProps,
                        matchingReferences: null,
                        referenceRecord: null,
                    }}
                >
                    <MyComponent />
                </ReferenceInput>
            );
            const MyComponentElement = wrapper.find('MyComponent');
            assert.equal(MyComponentElement.length, 0);
            const ReferenceLoadingProgressElement = wrapper.find(
                'ReferenceLoadingProgress'
            );
            assert.equal(ReferenceLoadingProgressElement.length, 1);
        });

        it('should not render a ReferenceLoadingProgress if the references are being searched but a selected reference have data', () => {
            const wrapper = shallow(
                <ReferenceInput
                    {...{
                        ...defaultProps,
                        matchingReferences: null,
                        referenceRecord: { id: 1 },
                        input: { value: 1 },
                    }}
                >
                    <MyComponent />
                </ReferenceInput>
            );
            const ReferenceLoadingProgressElement = wrapper.find(
                'ReferenceLoadingProgress'
            );
            assert.equal(ReferenceLoadingProgressElement.length, 0);
            const MyComponentElement = wrapper.find('MyComponent');
            assert.equal(MyComponentElement.length, 1);
            assert.deepEqual(MyComponentElement.prop('choices'), [{ id: 1 }]);
        });

        it('should not render a ReferenceLoadingProgress if the references were found but a selected reference does not have data', () => {
            const wrapper = shallow(
                <ReferenceInput
                    {...{
                        ...defaultProps,
                        matchingReferences: [{ id: 2 }],
                        referenceRecord: null,
                        input: { value: 1 },
                    }}
                >
                    <MyComponent />
                </ReferenceInput>
            );
            const ReferenceLoadingProgressElement = wrapper.find(
                'ReferenceLoadingProgress'
            );
            assert.equal(ReferenceLoadingProgressElement.length, 0);
            const MyComponentElement = wrapper.find('MyComponent');
            assert.equal(MyComponentElement.length, 1);
            assert.deepEqual(MyComponentElement.prop('choices'), [{ id: 2 }]);
        });

        it('should display an error in case of references fetch error and selected reference does not have data', () => {
            const wrapper = shallow(
                <ReferenceInput
                    {...{
                        ...defaultProps,
                        matchingReferences: { error: 'fetch error' },
                        referenceRecord: null,
                        input: { value: 1 },
                    }}
                >
                    <MyComponent />
                </ReferenceInput>
            );
            const MyComponentElement = wrapper.find('MyComponent');
            assert.equal(MyComponentElement.length, 0);
            const ErrorElement = wrapper.find('ReferenceError');
            assert.equal(ErrorElement.length, 1);
            assert.equal(
                ErrorElement.prop('error'),
                '*aor.input.references.single_missing*'
            );
        });

        it('should display an error in case of references fetch error and there is no reference already selected', () => {
            const wrapper = shallow(
                <ReferenceInput
                    {...{
                        ...defaultProps,
                        matchingReferences: { error: 'fetch error' },
                        referenceRecord: null,
                        input: {},
                    }}
                >
                    <MyComponent />
                </ReferenceInput>
            );
            const MyComponentElement = wrapper.find('MyComponent');
            assert.equal(MyComponentElement.length, 0);
            const ErrorElement = wrapper.find('ReferenceError');
            assert.equal(ErrorElement.length, 1);
            assert.equal(ErrorElement.prop('error'), '*fetch error*');
        });

        it('should not display an error in case of references fetch error but selected reference have data', () => {
            const wrapper = shallow(
                <ReferenceInput
                    {...{
                        ...defaultProps,
                        matchingReferences: { error: 'fetch error' },
                        referenceRecord: { id: 1 },
                        input: { value: 1 },
                    }}
                >
                    <MyComponent />
                </ReferenceInput>
            );

            const ReferenceLoadingProgressElement = wrapper.find(
                'ReferenceLoadingProgress'
            );
            assert.equal(ReferenceLoadingProgressElement.length, 0);
            const ErrorElement = wrapper.find('ReferenceError');
            assert.equal(ErrorElement.length, 0);
            const MyComponentElement = wrapper.find('MyComponent');
            assert.equal(MyComponentElement.length, 1);
        });

        it('should not render an error if the references are empty (but fetched without error) and a selected reference does not have data', () => {
            const wrapper = shallow(
                <ReferenceInput
                    {...{
                        ...defaultProps,
                        matchingReferences: [],
                        referenceRecord: null,
                        input: { value: 1 },
                    }}
                >
                    <MyComponent />
                </ReferenceInput>
            );
            const ReferenceLoadingProgressElement = wrapper.find(
                'ReferenceLoadingProgress'
            );
            assert.equal(ReferenceLoadingProgressElement.length, 0);
            const ErrorElement = wrapper.find('ReferenceError');
            assert.equal(ErrorElement.length, 0);
            const MyComponentElement = wrapper.find('MyComponent');
            assert.equal(MyComponentElement.length, 1);
        });

        it('should send an error to the children in case of references fetch error and there selected reference with data', () => {
            const wrapper = shallow(
                <ReferenceInput
                    {...{
                        ...defaultProps,
                        matchingReferences: { error: 'fetch error' },
                        referenceRecord: [{ id: 1 }],
                        input: { value: 1 },
                    }}
                >
                    <MyComponent />
                </ReferenceInput>
            );
            const ReferenceLoadingProgressElement = wrapper.find(
                'ReferenceLoadingProgress'
            );
            assert.equal(ReferenceLoadingProgressElement.length, 0);
            const ErrorElement = wrapper.find('ReferenceError');
            assert.equal(ErrorElement.length, 0);
            const MyComponentElement = wrapper.find('MyComponent');
            assert.equal(MyComponentElement.length, 1);
            assert.deepEqual(MyComponentElement.prop('meta'), {
                error: '*fetch error*',
                touched: true,
            });
        });

        it('should send an error to the children if references were found but not the already selected one', () => {
            const wrapper = shallow(
                <ReferenceInput
                    {...{
                        ...defaultProps,
                        matchingReferences: [],
                        referenceRecord: null,
                        input: { value: 1 },
                    }}
                >
                    <MyComponent />
                </ReferenceInput>
            );
            const ReferenceLoadingProgressElement = wrapper.find(
                'ReferenceLoadingProgress'
            );
            assert.equal(ReferenceLoadingProgressElement.length, 0);
            const ErrorElement = wrapper.find('ReferenceError');
            assert.equal(ErrorElement.length, 0);
            const MyComponentElement = wrapper.find('MyComponent');
            assert.equal(MyComponentElement.length, 1);
            assert.deepEqual(MyComponentElement.prop('meta'), {
                error: '*aor.input.references.single_missing*',
                touched: true,
            });
        });

        it('should not send an error to the children if all references were found', () => {
            const wrapper = shallow(
                <ReferenceInput
                    {...{
                        ...defaultProps,
                        matchingReferences: [{ id: 1 }, { id: 2 }],
                        referenceRecord: { id: 1 },
                        input: { value: 1 },
                    }}
                >
                    <MyComponent />
                </ReferenceInput>
            );
            const ReferenceLoadingProgressElement = wrapper.find(
                'ReferenceLoadingProgress'
            );
            assert.equal(ReferenceLoadingProgressElement.length, 0);
            const ErrorElement = wrapper.find('ReferenceError');
            assert.equal(ErrorElement.length, 0);
            const MyComponentElement = wrapper.find('MyComponent');
            assert.equal(MyComponentElement.length, 1);
            assert.deepEqual(MyComponentElement.prop('meta'), {});
        });

        it('should render enclosed component even if the references are empty', () => {
            const wrapper = shallow(
                <ReferenceInput
                    {...{
                        ...defaultProps,
                        matchingReferences: [],
                    }}
                >
                    <MyComponent />
                </ReferenceInput>
            );
            const ReferenceLoadingProgressElement = wrapper.find(
                'ReferenceLoadingProgress'
            );
            assert.equal(ReferenceLoadingProgressElement.length, 0);
            const ErrorElement = wrapper.find('ReferenceError');
            assert.equal(ErrorElement.length, 0);
            const MyComponentElement = wrapper.find('MyComponent');
            assert.equal(MyComponentElement.length, 1);
        });

        it('should call crudGetMatching on mount with default fetch values', () => {
            const crudGetMatching = sinon.spy();
            shallow(
                <ReferenceInput
                    {...defaultProps}
                    allowEmpty
                    crudGetMatching={crudGetMatching}
                >
                    <MyComponent />
                </ReferenceInput>,
                { lifecycleExperimental: true }
            );
            assert.deepEqual(crudGetMatching.args[0], [
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

        it('should allow to customize crudGetMatching arguments with perPage, sort, and filter props', () => {
            const crudGetMatching = sinon.spy();
            shallow(
                <ReferenceInput
                    {...defaultProps}
                    allowEmpty
                    crudGetMatching={crudGetMatching}
                    sort={{ field: 'foo', order: 'ASC' }}
                    perPage={5}
                    filter={{ q: 'foo' }}
                >
                    <MyComponent />
                </ReferenceInput>,
                { lifecycleExperimental: true }
            );
            assert.deepEqual(crudGetMatching.args[0], [
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

        it('should allow to customize crudGetMatching arguments with perPage, sort, and filter props without loosing original default filter', () => {
            const crudGetMatching = sinon.spy();
            const wrapper = shallow(
                <ReferenceInput
                    {...defaultProps}
                    allowEmpty
                    crudGetMatching={crudGetMatching}
                    sort={{ field: 'foo', order: 'ASC' }}
                    perPage={5}
                    filter={{ foo: 'bar' }}
                >
                    <MyComponent />
                </ReferenceInput>,
                { lifecycleExperimental: true }
            );

            wrapper.instance().setFilter('search_me');

            assert(
                crudGetMatching.calledWith(
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
                    }
                )
            );
        });

        it('should call crudGetMatching when setFilter is called', () => {
            const crudGetMatching = sinon.spy();
            const wrapper = shallow(
                <ReferenceInput
                    {...defaultProps}
                    allowEmpty
                    crudGetMatching={crudGetMatching}
                >
                    <MyComponent />
                </ReferenceInput>,
                { lifecycleExperimental: true }
            );
            wrapper.instance().setFilter('bar');
            assert.deepEqual(crudGetMatching.args[1], [
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
            const crudGetMatching = sinon.spy();
            const wrapper = shallow(
                <ReferenceInput
                    {...defaultProps}
                    allowEmpty
                    crudGetMatching={crudGetMatching}
                    filterToQuery={searchText => ({ foo: searchText })}
                >
                    <MyComponent />
                </ReferenceInput>,
                { lifecycleExperimental: true }
            );
            wrapper.instance().setFilter('bar');
            assert.deepEqual(crudGetMatching.args[1], [
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

        it('should call crudGetOne on mount if value is set', () => {
            const crudGetOne = sinon.spy();
            shallow(
                <ReferenceInput
                    {...defaultProps}
                    allowEmpty
                    crudGetOne={crudGetOne}
                    input={{ value: 5 }}
                >
                    <MyComponent />
                </ReferenceInput>,
                { lifecycleExperimental: true }
            );
            assert.deepEqual(crudGetOne.args[0], ['posts', 5, null, false]);
        });

        it('should pass onChange down to child component', () => {
            const onChange = sinon.spy();
            const wrapper = shallow(
                <ReferenceInput
                    {...defaultProps}
                    allowEmpty
                    onChange={onChange}
                >
                    <MyComponent />
                </ReferenceInput>
            );
            wrapper.find('MyComponent').simulate('change', 'foo');
            assert.deepEqual(onChange.args[0], ['foo']);
        });

        it('should pass meta down to child component', () => {
            const wrapper = shallow(
                <ReferenceInput
                    {...defaultProps}
                    allowEmpty
                    meta={{ touched: false }}
                >
                    <MyComponent />
                </ReferenceInput>
            );

            const myComponent = wrapper.find('MyComponent');
            assert.notEqual(myComponent.prop('meta', undefined));
        });
    });
});
