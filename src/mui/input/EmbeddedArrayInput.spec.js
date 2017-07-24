import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';

import TextInput from './TextInput';

import { EmbeddedArrayInput } from './EmbeddedArrayInput';

describe('<EmbeddedArrayInput />', () => {
    const defaultProps = {
        source: 'sub_items',
        children: [
            <TextInput key={1} source="price" />,
            <TextInput key={2} source="qty" />,
        ],
        resource: 'the_items',
        translate: x => x,
    };

    it('should render FieldArray Element', () => {
        const wrapper = shallow(
            <EmbeddedArrayInput {...defaultProps} input={{ value: [{}, {}] }} />
        );
        const fieldArrayElement = wrapper.find('FieldArray');
        assert.equal(fieldArrayElement.prop('name'), 'sub_items');
    });

    it('should render 4 EmbeddedArrayInputFormField elements', () => {
        // instantiating an EmbeddedArrayInput to test its renderList function
        const embeddedArrayInput = new EmbeddedArrayInput(defaultProps);

        // mocking redux-form FieldArray items array
        const items = ['sub_items[0]', 'sub_items[1]'];

        // shallow rendering the renderList helper to test its contents
        const renderList = shallow(
            embeddedArrayInput.renderList({ fields: items })
        );

        // It should render the container
        assert.equal(renderList.find('.EmbeddedArrayInputContainer').length, 1);

        // It should render a container for each item
        assert.equal(
            renderList.find('.EmbeddedArrayInputItemContainer').length,
            2
        );

        // Totally there should be 4 EmbeddedArrayInputFormField
        assert.equal(renderList.find('EmbeddedArrayInputFormField').length, 4);

        // It should render 2 items: sub_items[0] and sub_items[1]
        // each with 2 fields: price and qty
        assert.deepEqual(
            renderList.find('EmbeddedArrayInputFormField').map(el => {
                const input = el.prop('input');
                return [input.type.name, el.prop('prefix'), input.props.source];
            }),
            [
                ['TextInput', 'sub_items[0]', 'price'],
                ['TextInput', 'sub_items[0]', 'qty'],
                ['TextInput', 'sub_items[1]', 'price'],
                ['TextInput', 'sub_items[1]', 'qty'],
            ]
        );
    });
});
