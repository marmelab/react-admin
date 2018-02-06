import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { ReferenceArrayInput } from './ReferenceArrayInput';

describe('<ReferenceArrayInput />', () => {
    const defaultProps = {
        crudGetMatching: () => true,
        crudGetMany: () => true,
        input: {},
        record: {},
        reference: 'tags',
        resource: 'posts',
        source: 'tag_ids',
    };
    const MyComponent = () => <span id="mycomponent" />;

    it('should not render anything if there is no referenceRecord and allowEmpty is false', () => {
        const wrapper = shallow(
            <ReferenceArrayInput {...defaultProps}>
                <MyComponent />
            </ReferenceArrayInput>
        );
        const MyComponentElement = wrapper.find('MyComponent');
        assert.equal(MyComponentElement.length, 0);
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

    it('should allow to customize crudGetMatching arguments with perPage, sort, and filter props', () => {
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

    it('should call crudGetMatching when setFilter is called', () => {
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

    it('should use custom filterToQuery function prop', () => {
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

    it('should call crudGetMany on mount if value is set', () => {
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

    it('should pass onChange down to child component', () => {
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

    it('should only call crudGetMatching when calling setFilter', () => {
        const crudGetMatching = jest.fn();
        const crudGetMany = jest.fn();
        const wrapper = shallow(
            <ReferenceArrayInput
                {...defaultProps}
                input={{ value: [5] }}
                crudGetMany={crudGetMany}
                crudGetMatching={crudGetMatching}
            >
                <MyComponent />
            </ReferenceArrayInput>
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
            <ReferenceArrayInput
                {...defaultProps}
                input={{ value: [5] }}
                allowEmpty
                crudGetMany={crudGetMany}
            >
                <MyComponent />
            </ReferenceArrayInput>
        );
        expect(crudGetMany.mock.calls.length).toBe(1);
        wrapper.setProps({ input: { value: [6] } });
        expect(crudGetMany.mock.calls.length).toBe(2);
    });

    it('should call crudGetOne and crudGetMatching when record changes', () => {
        const crudGetMany = jest.fn();
        const crudGetMatching = jest.fn();
        const wrapper = shallow(
            <ReferenceArrayInput
                {...defaultProps}
                allowEmpty
                input={{ value: [5] }}
                crudGetMany={crudGetMany}
                crudGetMatching={crudGetMatching}
            >
                <MyComponent />
            </ReferenceArrayInput>
        );
        expect(crudGetMany.mock.calls.length).toBe(1);
        expect(crudGetMatching.mock.calls.length).toBe(1);
        wrapper.setProps({ record: { id: 1 } });
        expect(crudGetMany.mock.calls.length).toBe(2);
        expect(crudGetMatching.mock.calls.length).toBe(2);
    });
});
