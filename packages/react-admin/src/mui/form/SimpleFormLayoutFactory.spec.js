import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';

import SimpleFormLayoutFactory from './SimpleFormLayoutFactory';
import TextInput from '../input/TextInput';

describe('<SimpleFormLayoutFactory />', () => {
    it('should embed a layout with given component children', () => {
        const wrapper = shallow(
            <SimpleFormLayoutFactory>
                <TextInput source="name" />
                <TextInput source="city" />
            </SimpleFormLayoutFactory>
        ).dive();
        const inputs = wrapper.find('WithStyles(FormInput)');
        assert.deepEqual(inputs.map(i => i.prop('input').props.source), [
            'name',
            'city',
        ]);
    });
    it('should display <Toolbar />', () => {
        const wrapper = shallow(
            <SimpleFormLayoutFactory>
                <TextInput source="name" />
            </SimpleFormLayoutFactory>
        ).dive();
        const button = wrapper.find('WithStyles(Toolbar)');
        assert.equal(button.length, 1);
    });
    it('should pass submitOnEnter to <Toolbar />', () => {
        const handleSubmit = () => {};
        const wrapper1 = shallow(
            <SimpleFormLayoutFactory
                submitOnEnter={false}
                handleSubmit={handleSubmit}
            >
                <TextInput source="name" />
            </SimpleFormLayoutFactory>
        ).dive();
        const button1 = wrapper1.find('WithStyles(Toolbar)');
        assert.equal(button1.prop('submitOnEnter'), false);

        const wrapper2 = shallow(
            <SimpleFormLayoutFactory
                submitOnEnter={true}
                handleSubmit={handleSubmit}
            >
                <TextInput source="name" />
            </SimpleFormLayoutFactory>
        ).dive();
        const button2 = wrapper2.find('WithStyles(Toolbar)');
        assert.equal(button2.prop('submitOnEnter'), true);
    });
});
