import React from 'react';
import { shallow } from 'enzyme';

import SimpleShowLayout from './SimpleShowLayout';
import TextField from '../field/TextField';

describe('<SimpleShowLayout />', () => {
    it('should display children inputs of SimpleShowLayout', () => {
        const wrapper = shallow(
            <SimpleShowLayout>
                <TextField source="foo" />
                <TextField source="bar" />
            </SimpleShowLayout>
        );
        const inputs = wrapper.find('EnhancedTextField');
        expect(inputs.map(i => i.prop('source'))).toEqual(['foo', 'bar']);
    });
});
