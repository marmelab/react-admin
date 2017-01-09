import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';

import { RecordForm, validateForm } from './RecordForm';
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

    it('should return validation function result if validation function is passed to the form', () => {
        const props = {
            validation: (values) => {
                const errors = {};
                if (!values.title) {
                    errors.title = 'Required field';
                }

                if (values.rate < 0 || values.rate > 5) {
                    errors.rate = 'Rate should be between 0 and 5.';
                }

                return errors;
            },
        };

        const errors = validateForm({ title: '', rate: 12 }, props);
        assert.deepEqual(errors, {
            title: 'Required field',
            rate: 'Rate should be between 0 and 5.',
        });
    });

    it('should allow to specify validators on inputs directly', () => {
        const props = {
            children: <TextInput source="title" validation={{ required: true }} />,
        };

        const errors = validateForm({ title: '' }, props);
        assert.deepEqual(errors, {
            title: ['Required field'],
        });
    });

    it('should apply both input and form validators', () => {
        const props = {
            children: <TextInput source="rate" validation={{ required: true }} />,
            validation: (values) => (values.rate > 5 ? { rate: 'Maximum value: 5' } : {}),
        };

        const nullError = validateForm({ rate: '' }, props);
        assert.deepEqual(nullError, { rate: ['Required field'] });

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

    it('should render <Labeled /> component if input sets addLabel', () => {
        const wrapper = shallow(
            <RecordForm>
                <TextInput source="name" label="Name" addLabel />
            </RecordForm>
        );

        const component = wrapper.find('Field').prop('component').name;
        assert.equal(component, 'Labeled');
    });
});
