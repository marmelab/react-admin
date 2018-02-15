import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { ReferenceInput } from './ReferenceInput';

describe('<ReferenceInput />', () => {
    const defaultProps = {
        meta: {},
        crudGetMatching: () => true,
        crudGetOne: () => true,
        input: {},
        matchingReferences: [],
        record: {},
        reference: 'posts',
        resource: 'comments',
        source: 'post_id',
        translate: x => `*${x}*`,
    };
    const MyComponent = () => <span id="mycomponent" />;

    it('should render a LinearProgress if the references are being searched and a selected reference does not have data', () => {
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
        const LinearProgressElement = wrapper.find(
            'WithStyles(LinearProgress)'
        );
        assert.equal(LinearProgressElement.length, 1);
    });

    it('should render a LinearProgress if the references are being searched and there is no reference already selected', () => {
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
        const LinearProgressElement = wrapper.find(
            'WithStyles(LinearProgress)'
        );
        assert.equal(LinearProgressElement.length, 1);
    });

    it('should not render a LinearProgress if the references are being searched but a selected reference have data', () => {
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
        const LinearProgressElement = wrapper.find(
            'WithStyles(LinearProgress)'
        );
        assert.equal(LinearProgressElement.length, 0);
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
        const LinearProgressElement = wrapper.find(
            'WithStyles(LinearProgress)'
        );
        assert.equal(LinearProgressElement.length, 0);
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
            '*ra.input.references.single_missing*'
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
            helperText: '*fetch error*',
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
            helperText: '*ra.input.references.single_missing*',
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
        assert.deepEqual(MyComponentElement.prop('meta'), {
            helperText: false,
        });
    });

    it('should call crudGetMatching on mount with default fetch values', () => {
        const crudGetMatching = jest.fn();
        shallow(
            <ReferenceInput
                {...defaultProps}
                allowEmpty
                crudGetMatching={crudGetMatching}
            >
                <MyComponent />
            </ReferenceInput>
        );
        assert.deepEqual(crudGetMatching.mock.calls[0], [
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
        const crudGetMatching = jest.fn();
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
            </ReferenceInput>
        );
        assert.deepEqual(crudGetMatching.mock.calls[0], [
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
        const crudGetMatching = jest.fn();
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
            </ReferenceInput>
        );

        wrapper.instance().setFilter('search_me');

        assert.deepEqual(crudGetMatching.mock.calls[1], [
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

    it('should call crudGetMatching when setFilter is called', () => {
        const crudGetMatching = jest.fn();
        const wrapper = shallow(
            <ReferenceInput
                {...defaultProps}
                allowEmpty
                crudGetMatching={crudGetMatching}
            >
                <MyComponent />
            </ReferenceInput>
        );
        wrapper.instance().setFilter('bar');
        assert.deepEqual(crudGetMatching.mock.calls[1], [
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
        const crudGetMatching = jest.fn();
        const wrapper = shallow(
            <ReferenceInput
                {...defaultProps}
                allowEmpty
                crudGetMatching={crudGetMatching}
                filterToQuery={searchText => ({ foo: searchText })}
            >
                <MyComponent />
            </ReferenceInput>
        );
        wrapper.instance().setFilter('bar');
        assert.deepEqual(crudGetMatching.mock.calls[1], [
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
        const crudGetOne = jest.fn();
        shallow(
            <ReferenceInput
                {...defaultProps}
                allowEmpty
                crudGetOne={crudGetOne}
                input={{ value: 5 }}
            >
                <MyComponent />
            </ReferenceInput>
        );
        assert.deepEqual(crudGetOne.mock.calls[0], ['posts', 5, null, false]);
    });

    it('should pass onChange down to child component', () => {
        const onChange = jest.fn();
        const wrapper = shallow(
            <ReferenceInput {...defaultProps} allowEmpty onChange={onChange}>
                <MyComponent />
            </ReferenceInput>
        );
        wrapper.find('MyComponent').simulate('change', 'foo');
        assert.deepEqual(onChange.mock.calls[0], ['foo']);
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

    it('should only call crudGetMatching when calling setFilter', () => {
        const crudGetMatching = jest.fn();
        const crudGetOne = jest.fn();
        const wrapper = shallow(
            <ReferenceInput
                {...defaultProps}
                allowEmpty
                input={{ value: 5 }}
                crudGetOne={crudGetOne}
                crudGetMatching={crudGetMatching}
            >
                <MyComponent />
            </ReferenceInput>
        );
        expect(crudGetMatching).toHaveBeenCalledTimes(1);
        expect(crudGetOne).toHaveBeenCalledTimes(1);

        wrapper.instance().setFilter('bar');
        expect(crudGetMatching.mock.calls.length).toBe(2);
        expect(crudGetOne).toHaveBeenCalledTimes(1);
    });

    it('should call crudGetOne when input value changes', () => {
        const crudGetOne = jest.fn();
        const wrapper = shallow(
            <ReferenceInput
                {...defaultProps}
                input={{ value: 5 }}
                allowEmpty
                crudGetOne={crudGetOne}
            >
                <MyComponent />
            </ReferenceInput>
        );
        expect(crudGetOne.mock.calls.length).toBe(1);
        wrapper.setProps({ input: { value: 6 } });
        expect(crudGetOne.mock.calls.length).toBe(2);
    });

    it('should call crudGetOne and crudGetMatching when record changes', () => {
        const crudGetOne = jest.fn();
        const crudGetMatching = jest.fn();
        const wrapper = shallow(
            <ReferenceInput
                {...defaultProps}
                allowEmpty
                input={{ value: 5 }}
                crudGetOne={crudGetOne}
                crudGetMatching={crudGetMatching}
            >
                <MyComponent />
            </ReferenceInput>
        );
        expect(crudGetOne.mock.calls.length).toBe(1);
        expect(crudGetMatching.mock.calls.length).toBe(1);
        wrapper.setProps({ record: { id: 1 } });
        expect(crudGetOne.mock.calls.length).toBe(2);
        expect(crudGetMatching.mock.calls.length).toBe(2);
    });
});
