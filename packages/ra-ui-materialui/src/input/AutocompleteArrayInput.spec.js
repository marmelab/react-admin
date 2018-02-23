import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { AutocompleteArrayInput } from './AutocompleteArrayInput';
import ChipField from '../field/ChipField';

describe('<AutocompleteArrayInput />', () => {
    const defaultProps = {
        source: 'foo',
        meta: {},
        input: {},
        translate: x => x,
    };

    it('should use a AutocompleteInput', () => {
        const wrapper = shallow(
            <AutocompleteArrayInput
                {...defaultProps}
                input={{ value: 1 }}
                choices={[{ id: 1, name: 'hello' }]}
            />
        );
        expect(wrapper.find('AutocompleteInput')).toHaveLength(1);
    });

    it('should have an empty input suggestion text on initial value', () => {
        const wrapper = shallow(
            <AutocompleteArrayInput
                {...defaultProps}
                input={{ value: ['programming', 'lifestyle'] }}
            />
        );
        assert.deepEqual(
            wrapper
                .find('AutocompleteInput')
                .dive()
                .prop('inputProps').value,
            ''
        );
        expect(wrapper.state('input').value).toEqual([
            'programming',
            'lifestyle',
        ]);
    });

    it('should render choices', () => {
        const wrapper = shallow(
            <AutocompleteArrayInput
                {...defaultProps}
                choices={[
                    { id: 'programming', name: 'Programming' },
                    { id: 'lifestyle', name: 'Lifestyle' },
                    { id: 'photography', name: 'Photography' },
                ]}
            >
                <ChipField source="name" />
            </AutocompleteArrayInput>
        );
        expect(wrapper).toMatchSnapshot();
    });
    it('should render chips of input value and choices for the rest', () => {
        const wrapper = shallow(
            <AutocompleteArrayInput
                {...defaultProps}
                input={{ value: ['programming'] }}
                choices={[
                    { id: 'programming', name: 'Programming' },
                    { id: 'lifestyle', name: 'Lifestyle' },
                    { id: 'photography', name: 'Photography' },
                ]}
            >
                <ChipField source="name" />
            </AutocompleteArrayInput>
        );
        expect(wrapper).toMatchSnapshot();
    });
});
