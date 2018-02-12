import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import {
    getSelectedReferencesStatus,
    ReferenceArrayInput,
} from './ReferenceArrayInput';

describe('Reference Array Input', () => {
    describe('<getSelectedReferencesStatus />', () => {
        it('should return ready if input value has no references', () => {
            const test = (input, referenceRecords) =>
                assert.equal(
                    getSelectedReferencesStatus(input, referenceRecords),
                    'ready'
                );

            test({}, []);
            test({ value: null }, []);
            test({ value: false }, []);
            test({ value: [] }, []);
        });

        it('should return empty if there is some input values but the referenceRecords is empty', () => {
            assert.equal(
                getSelectedReferencesStatus({ value: [1, 2] }, []),
                'empty'
            );
        });

        it('should return incomplete if there is less data in the referenceRecords than values in the input value', () => {
            assert.equal(
                getSelectedReferencesStatus({ value: [1, 2] }, [{ id: 1 }]),
                'incomplete'
            );
        });

        it('should return ready if there is as much data in the referenceRecords as there are values in the input value', () => {
            assert.equal(
                getSelectedReferencesStatus({ value: [1, 2] }, [
                    { id: 1 },
                    { id: 2 },
                ]),
                'ready'
            );
        });
    });
    describe('<ReferenceArrayInput />', () => {
        const defaultProps = {
            addField: true,
            crudGetMatching: () => true,
            crudGetMany: () => true,
            input: {},
            reference: 'tags',
            resource: 'posts',
            source: 'tag_ids',
            matchingReferences: [{ id: 1 }],
            allowEmpty: true,
            translate: x => `*${x}*`,
            referenceRecords: [],
        };
        const MyComponent = () => <span id="mycomponent" />;

        it('should render a spinner as long as there are no references fetched and no selected references', () => {
            const wrapper = shallow(
                <ReferenceArrayInput
                    {...{
                        ...defaultProps,
                        matchingReferences: null,
                        input: {},
                    }}
                >
                    <MyComponent />
                </ReferenceArrayInput>
            );
            const MyComponentElement = wrapper.find('MyComponent');
            assert.equal(MyComponentElement.length, 0);
            const SpinnerElement = wrapper.find('ReferenceLoadingProgress');
            assert.equal(SpinnerElement.length, 1);
        });

        it('should render a spinner as long as there are no references fetched and there are no data found for the references already selected', () => {
            const wrapper = shallow(
                <ReferenceArrayInput
                    {...{
                        ...defaultProps,
                        matchingReferences: null,
                        input: { value: [1, 2] },
                        referenceRecords: [],
                    }}
                >
                    <MyComponent />
                </ReferenceArrayInput>
            );
            const MyComponentElement = wrapper.find('MyComponent');
            assert.equal(MyComponentElement.length, 0);
            const SpinnerElement = wrapper.find('ReferenceLoadingProgress');
            assert.equal(SpinnerElement.length, 1);
        });

        it('should not render a spinner if the references are being searched but data from at least one selected reference was found', () => {
            const wrapper = shallow(
                <ReferenceArrayInput
                    {...{
                        ...defaultProps,
                        matchingReferences: null,
                        input: { value: [1, 2] },
                        referenceRecords: [{ id: 1 }],
                    }}
                >
                    <MyComponent />
                </ReferenceArrayInput>
            );
            const SpinnerElement = wrapper.find('ReferenceLoadingProgress');
            assert.equal(SpinnerElement.length, 0);
            const MyComponentElement = wrapper.find('MyComponent');
            assert.equal(MyComponentElement.length, 1);
            assert.deepEqual(MyComponentElement.prop('choices'), [{ id: 1 }]);
        });

        it('should display an error in case of references fetch error and there are no selected reference in the input value', () => {
            const wrapper = shallow(
                <ReferenceArrayInput
                    {...{
                        ...defaultProps,
                        matchingReferences: { error: 'fetch error' },
                        input: {},
                        referenceRecords: [],
                    }}
                >
                    <MyComponent />
                </ReferenceArrayInput>
            );
            const MyComponentElement = wrapper.find('MyComponent');
            assert.equal(MyComponentElement.length, 0);
            const ErrorElement = wrapper.find('ReferenceError');
            assert.equal(ErrorElement.length, 1);
            assert.equal(
                ErrorElement.prop('error'),
                '*aor.input.references.all_missing*'
            );
        });

        it('should display an error in case of references fetch error and there are no data found for the references already selected', () => {
            const wrapper = shallow(
                <ReferenceArrayInput
                    {...{
                        ...defaultProps,
                        matchingReferences: { error: 'fetch error' },
                        input: { value: [1] },
                        referenceRecords: [],
                    }}
                >
                    <MyComponent />
                </ReferenceArrayInput>
            );
            const MyComponentElement = wrapper.find('MyComponent');
            assert.equal(MyComponentElement.length, 0);
            const ErrorElement = wrapper.find('ReferenceError');
            assert.equal(ErrorElement.length, 1);
            assert.equal(
                ErrorElement.prop('error'),
                '*aor.input.references.all_missing*'
            );
        });

        it('should not display an error in case of references fetch error but data from at least one selected reference was found', () => {
            const wrapper = shallow(
                <ReferenceArrayInput
                    {...{
                        ...defaultProps,
                        matchingReferences: { error: 'fetch error' },
                        input: { value: [1, 2] },
                        referenceRecords: [{ id: 2 }],
                    }}
                >
                    <MyComponent />
                </ReferenceArrayInput>
            );
            const ErrorElement = wrapper.find('ReferenceError');
            assert.equal(ErrorElement.length, 0);
            const MyComponentElement = wrapper.find('MyComponent');
            assert.equal(MyComponentElement.length, 1);
            assert.deepEqual(MyComponentElement.prop('choices'), [{ id: 2 }]);
        });

        it('should send an error to the children if references fetch fails but selected references are not empty', () => {
            const wrapper = shallow(
                <ReferenceArrayInput
                    {...{
                        ...defaultProps,
                        matchingReferences: { error: 'fetch error' },
                        input: { value: [1, 2] },
                        referenceRecords: [{ id: 2 }],
                    }}
                >
                    <MyComponent />
                </ReferenceArrayInput>
            );
            const ErrorElement = wrapper.find('ReferenceError');
            assert.equal(ErrorElement.length, 0);
            const MyComponentElement = wrapper.find('MyComponent');
            assert.equal(MyComponentElement.length, 1);
            assert.deepEqual(MyComponentElement.prop('meta'), {
                error: '*fetch error*',
                touched: true,
            });
        });

        it('should send an error to the children if references were found and but selected references are not complete', () => {
            const wrapper = shallow(
                <ReferenceArrayInput
                    {...{
                        ...defaultProps,
                        matchingReferences: [],
                        input: { value: [1, 2] },
                        referenceRecords: [{ id: 2 }],
                    }}
                >
                    <MyComponent />
                </ReferenceArrayInput>
            );
            const ErrorElement = wrapper.find('ReferenceError');
            assert.equal(ErrorElement.length, 0);
            const MyComponentElement = wrapper.find('MyComponent');
            assert.equal(MyComponentElement.length, 1);
            assert.deepEqual(MyComponentElement.prop('meta'), {
                error: '*aor.input.references.many_missing*',
                touched: true,
            });
        });

        it('should send an error to the children if references were found and but selected references are empty', () => {
            const wrapper = shallow(
                <ReferenceArrayInput
                    {...{
                        ...defaultProps,
                        matchingReferences: [],
                        input: { value: [1, 2] },
                        referenceRecords: [],
                    }}
                >
                    <MyComponent />
                </ReferenceArrayInput>
            );
            const ErrorElement = wrapper.find('ReferenceError');
            assert.equal(ErrorElement.length, 0);
            const MyComponentElement = wrapper.find('MyComponent');
            assert.equal(MyComponentElement.length, 1);
            assert.deepEqual(MyComponentElement.prop('meta'), {
                error: '*aor.input.references.many_missing*',
                touched: true,
            });
        });

        it('should not send an error to the children if all references were found', () => {
            const wrapper = shallow(
                <ReferenceArrayInput
                    {...{
                        ...defaultProps,
                        matchingReferences: [],
                        input: { value: [1, 2] },
                        referenceRecords: [{ id: 1 }, { id: 2 }],
                    }}
                >
                    <MyComponent />
                </ReferenceArrayInput>
            );
            const ErrorElement = wrapper.find('ReferenceError');
            assert.equal(ErrorElement.length, 0);
            const MyComponentElement = wrapper.find('MyComponent');
            assert.equal(MyComponentElement.length, 1);
            assert.deepEqual(MyComponentElement.prop('meta'), {
                error: null,
                touched: false,
            });
        });

        it('should render enclosed component if references present in input are available in state', () => {
            const wrapper = shallow(
                <ReferenceArrayInput
                    {...{
                        ...defaultProps,
                        input: { value: [1] },
                        referenceRecords: [1],
                    }}
                >
                    <MyComponent />
                </ReferenceArrayInput>
            );
            const ErrorElement = wrapper.find('ReferenceError');
            assert.equal(ErrorElement.length, 0);
            const MyComponentElement = wrapper.find('MyComponent');
            assert.equal(MyComponentElement.length, 1);
        });

        it('should render enclosed component even if the references are empty', () => {
            const wrapper = shallow(
                <ReferenceArrayInput
                    {...{
                        ...defaultProps,
                        matchingReferences: [],
                    }}
                >
                    <MyComponent />
                </ReferenceArrayInput>
            );
            const SpinnerElement = wrapper.find('ReferenceLoadingProgress');
            assert.equal(SpinnerElement.length, 0);
            const ErrorElement = wrapper.find('ReferenceError');
            assert.equal(ErrorElement.length, 0);
            const MyComponentElement = wrapper.find('MyComponent');
            assert.equal(MyComponentElement.length, 1);
        });

        it('should not render enclosed component if allowEmpty is true', () => {
            const wrapper = shallow(
                <ReferenceArrayInput {...defaultProps} allowEmpty>
                    <MyComponent />
                </ReferenceArrayInput>
            );
            const MyComponentElement = wrapper.find('MyComponent');
            assert.equal(MyComponentElement.length, 1);
        });

        it('should call crudGetMatching on mount with default fetch values', () => {
            const crudGetMatching = sinon.spy();
            shallow(
                <ReferenceArrayInput
                    {...defaultProps}
                    allowEmpty
                    crudGetMatching={crudGetMatching}
                >
                    <MyComponent />
                </ReferenceArrayInput>,
                { lifecycleExperimental: true }
            );
            assert.deepEqual(crudGetMatching.args[0], [
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
            const crudGetMatching = sinon.spy();
            shallow(
                <ReferenceArrayInput
                    {...defaultProps}
                    allowEmpty
                    crudGetMatching={crudGetMatching}
                    sort={{ field: 'foo', order: 'ASC' }}
                    perPage={5}
                    filter={{ q: 'foo' }}
                >
                    <MyComponent />
                </ReferenceArrayInput>,
                { lifecycleExperimental: true }
            );
            assert.deepEqual(crudGetMatching.args[0], [
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
            const crudGetMatching = sinon.spy();
            const wrapper = shallow(
                <ReferenceArrayInput
                    {...defaultProps}
                    allowEmpty
                    crudGetMatching={crudGetMatching}
                >
                    <MyComponent />
                </ReferenceArrayInput>,
                { lifecycleExperimental: true }
            );
            wrapper.instance().setFilter('bar');
            assert.deepEqual(crudGetMatching.args[1], [
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
            const crudGetMatching = sinon.spy();
            const wrapper = shallow(
                <ReferenceArrayInput
                    {...defaultProps}
                    allowEmpty
                    crudGetMatching={crudGetMatching}
                    filterToQuery={searchText => ({ foo: searchText })}
                >
                    <MyComponent />
                </ReferenceArrayInput>,
                { lifecycleExperimental: true }
            );
            wrapper.instance().setFilter('bar');
            assert.deepEqual(crudGetMatching.args[1], [
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
            const crudGetMany = sinon.spy();
            shallow(
                <ReferenceArrayInput
                    {...defaultProps}
                    allowEmpty
                    crudGetMany={crudGetMany}
                    input={{ value: [5, 6] }}
                >
                    <MyComponent />
                </ReferenceArrayInput>,
                { lifecycleExperimental: true }
            );
            assert.deepEqual(crudGetMany.args[0], ['tags', [5, 6]]);
        });

        it('should pass onChange down to child component', () => {
            const onChange = sinon.spy();
            const wrapper = shallow(
                <ReferenceArrayInput
                    {...defaultProps}
                    allowEmpty
                    onChange={onChange}
                >
                    <MyComponent />
                </ReferenceArrayInput>
            );
            wrapper.find('MyComponent').simulate('change', 'foo');
            assert.deepEqual(onChange.args[0], ['foo']);
        });

        it('should pass meta down to child component', () => {
            const wrapper = shallow(
                <ReferenceArrayInput
                    {...defaultProps}
                    allowEmpty
                    meta={{ touched: false }}
                >
                    <MyComponent />
                </ReferenceArrayInput>
            );

            const myComponent = wrapper.find('MyComponent');
            assert.notEqual(myComponent.prop('meta', undefined));
        });
    });
});
