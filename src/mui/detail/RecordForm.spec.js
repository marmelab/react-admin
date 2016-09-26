import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';

import { RecordForm, validateForm } from './RecordForm';
import { ReferenceManyField } from '../field/ReferenceManyField';
import TextInput from '../input/TextInput';

describe('RecordForm .validateForm', () => {
    it('should return empty object if no validator return error message', () => {
        const props = {
            validation: {
                title: {
                    custom: () => '',
                },
            },
        };

        const errors = validateForm({ title: 'We <3 React!' }, props);
        assert.deepEqual(errors, []);
    });

    it('should return dictionnary with field as key and error message as values for all validator errors', () => {
        const props = {
            validation: {
                title: { required: true },
                rate: { min: 0, max: 5 },
            },
        };

        const errors = validateForm({ title: '', rate: 12 }, props);
        assert.deepEqual(errors, {
            title: 'Required field',
            rate: 'Maximum value: 5',
        });
    });

    it('should allow to specify validators on inputs directly', () => {
        const props = {
            children: <TextInput source="title" validation={{ required: true }} />,
        };

        const errors = validateForm({ title: '' }, props);
        assert.deepEqual(errors, {
            title: 'Required field',
        });
    });

    it('should apply both input and form validators', () => {
        const props = {
            validation: {
                rate: { min: 0, max: 5 },
            },
            children: <TextInput source="rate" validation={{ required: true }} />,
        };

        const nullError = validateForm({ rate: '' }, props);
        assert.deepEqual(nullError, { rate: 'Required field' });

        const valueError = validateForm({ rate: 6 }, props);
        assert.deepEqual(valueError, { rate: 'Maximum value: 5' });
    });
});

describe('<RecordForm />', () => {
    it('should embed a form with given component children', () => {
        const wrapper = shallow(
            <RecordForm>
                <TextInput source="name" />
                <TextInput source="city" />
            </RecordForm>
        );

        const inputs = wrapper.find('Field');
        assert.deepEqual(inputs.map(i => i.prop('source')), ['name', 'city']);
    });

    it('should display <SaveButton />', () => {
        const wrapper = shallow(
            <RecordForm>
                <TextInput source="name" />
            </RecordForm>
        );

        const button = wrapper.find('SaveButton');
        assert.equal(button.length, 1);
    });

    it('should render <Labeled /> component if input does not include label', () => {
        const wrapper = shallow(
            <RecordForm>
                <TextInput source="name" label="Name" includesLabel={false} />
            </RecordForm>
        );

        const component = wrapper.find('Field').prop('component').name;
        assert.equal(component, 'Labeled');
    });
});
