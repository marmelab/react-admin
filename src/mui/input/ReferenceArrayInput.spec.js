import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { ReferenceArrayInput } from './ReferenceArrayInput';

describe('<ReferenceArrayInput />', () => {
    const defaultProps = {
        crudGetMatching: () => true,
        crudGetMany: () => true,
        input: {},
        reference: 'tags',
        resource: 'posts',
        source: 'tag_ids',
        matchingReferences: [{ id: 1 }],
        allowEmpty: true,
        translate: x => `*${x}*`,
    };
    const MyComponent = () => <span id="mycomponent" />;

    it('should only render a spinner as long as there are no references fetched', () => {
        const wrapper = shallow(
            <ReferenceArrayInput
                {...{
                    ...defaultProps,
                    matchingReferences: null,
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

    it('should display an error in case of references fetch error', () => {
        const wrapper = shallow(
            <ReferenceArrayInput
                {...{
                    ...defaultProps,
                    matchingReferences: { error: 'fetch error' },
                }}
            >
                <MyComponent />
            </ReferenceArrayInput>
        );
        const MyComponentElement = wrapper.find('MyComponent');
        assert.equal(MyComponentElement.length, 0);
        const ErrorElement = wrapper.find('ReferenceError');
        assert.equal(ErrorElement.length, 1);
        assert.equal(ErrorElement.prop('error'), '*fetch error*');
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
