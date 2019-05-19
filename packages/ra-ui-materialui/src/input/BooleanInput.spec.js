import React from 'react';
import expect from 'expect';
import { render, cleanup } from 'react-testing-library';

import { BooleanInput } from './BooleanInput';

describe('<BooleanInput />', () => {
    afterEach(cleanup);

    it('should render as a checkbox', () => {
        const { getByLabelText } = render(
            <BooleanInput resource="foo" source="bar" input={{}} />
        );
        expect(getByLabelText('resources.foo.fields.bar').type).toBe(
            'checkbox'
        );
    });

    it('should be checked if the value is true', () => {
        const { getByLabelText } = render(
            <BooleanInput resource="foo" source="bar" input={{ value: true }} />
        );
        expect(getByLabelText('resources.foo.fields.bar').checked).toBe(true);
    });

    it('should not be checked if the value is false', () => {
        const { getByLabelText } = render(
            <BooleanInput
                resource="foo"
                source="bar"
                input={{ value: false }}
            />
        );
        expect(getByLabelText('resources.foo.fields.bar').checked).toBe(false);
    });

    it('should not be checked if the value is undefined', () => {
        const { getByLabelText } = render(
            <BooleanInput resource="foo" source="bar" input={{}} />
        );
        expect(getByLabelText('resources.foo.fields.bar').checked).toBe(false);
    });
});
