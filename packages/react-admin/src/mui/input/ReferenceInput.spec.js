import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { ReferenceInput } from './ReferenceInput';

describe('<ReferenceInput />', () => {
    const defaultProps = {
        crudGetMatching: () => true,
        crudGetOne: () => true,
        input: {},
        record: {},
        reference: 'posts',
        resource: 'comments',
        source: 'post_id',
    };
    const MyComponent = () => <span id="mycomponent" />;

    it('should not render anything if there is no referenceRecord and allowEmpty is false', () => {
        const wrapper = shallow(
            <ReferenceInput {...defaultProps}>
                <MyComponent />
            </ReferenceInput>
        );
        const MyComponentElement = wrapper.find('MyComponent');
        assert.equal(MyComponentElement.length, 0);
    });

    it('should not render enclosed component if allowEmpty is true', () => {
        const wrapper = shallow(
            <ReferenceInput {...defaultProps} allowEmpty>
                <MyComponent />
            </ReferenceInput>
        );
        const MyComponentElement = wrapper.find('MyComponent');
        assert.equal(MyComponentElement.length, 1);
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
