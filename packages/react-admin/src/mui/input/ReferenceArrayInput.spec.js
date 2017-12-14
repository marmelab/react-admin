import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { ReferenceArrayInput } from './ReferenceArrayInput';

describe('<ReferenceArrayInput />', () => {
    const defaultProps = {
        crudGetMatching: () => true,
        crudGetMany: () => true,
        input: {},
        reference: 'tags',
        resource: 'posts',
        source: 'tag_ids',
    };
    const MyComponent = () => <span id="mycomponent" />;

    test('should not render anything if there is no referenceRecord and allowEmpty is false', () => {
        const wrapper = shallow(
            <ReferenceArrayInput {...defaultProps}>
                <MyComponent />
            </ReferenceArrayInput>
        );
        const MyComponentElement = wrapper.find('MyComponent');
        assert.equal(MyComponentElement.length, 0);
    });

    test('should not render enclosed component if allowEmpty is true', () => {
        const wrapper = shallow(
            <ReferenceArrayInput {...defaultProps} allowEmpty>
                <MyComponent />
            </ReferenceArrayInput>
        );
        const MyComponentElement = wrapper.find('MyComponent');
        assert.equal(MyComponentElement.length, 1);
    });

    test('should call crudGetMatching on mount with default fetch values', () => {
        const crudGetMatching = jest.fn();
        shallow(
            <ReferenceArrayInput
                {...defaultProps}
                allowEmpty
                crudGetMatching={crudGetMatching}
            >
                <MyComponent />
            </ReferenceArrayInput>
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

    test('should allow to customize crudGetMatching arguments with perPage, sort, and filter props', () => {
        const crudGetMatching = jest.fn();
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
            </ReferenceArrayInput>
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

    test('should call crudGetMatching when setFilter is called', () => {
        const crudGetMatching = jest.fn();
        const wrapper = shallow(
            <ReferenceArrayInput
                {...defaultProps}
                allowEmpty
                crudGetMatching={crudGetMatching}
            >
                <MyComponent />
            </ReferenceArrayInput>
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

    test('should use custom filterToQuery function prop', () => {
        const crudGetMatching = jest.fn();
        const wrapper = shallow(
            <ReferenceArrayInput
                {...defaultProps}
                allowEmpty
                crudGetMatching={crudGetMatching}
                filterToQuery={searchText => ({ foo: searchText })}
            >
                <MyComponent />
            </ReferenceArrayInput>
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

    test('should call crudGetMany on mount if value is set', () => {
        const crudGetMany = jest.fn();
        shallow(
            <ReferenceArrayInput
                {...defaultProps}
                allowEmpty
                crudGetMany={crudGetMany}
                input={{ value: [5, 6] }}
            >
                <MyComponent />
            </ReferenceArrayInput>
        );
        assert.deepEqual(crudGetMany.mock.calls[0], ['tags', [5, 6]]);
    });

    test('should pass onChange down to child component', () => {
        const onChange = jest.fn();
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
        assert.deepEqual(onChange.mock.calls[0], ['foo']);
    });

    test('should pass meta down to child component', () => {
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
