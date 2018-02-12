import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { ReferenceInput } from './ReferenceInput';

describe.only('<ReferenceInput />', () => {
    const defaultProps = {
        crudGetMatching: () => true,
        crudGetOne: () => true,
        input: {},
        reference: 'posts',
        resource: 'comments',
        source: 'post_id',
        matchingReferences: [{ id: 1 }],
        translate: x => `*${x}*`,
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
            '*aor.input.references.missing*'
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
            <ReferenceInput {...defaultProps} allowEmpty onChange={onChange}>
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
