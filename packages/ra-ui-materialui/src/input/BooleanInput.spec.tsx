import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Form } from 'react-final-form';

import BooleanInput from './BooleanInput';
import { required } from 'ra-core';

describe('<BooleanInput />', () => {
    afterEach(cleanup);

    const defaultProps = {
        resource: 'foo',
        source: 'bar',
    };

    it('should render as a checkbox', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => <BooleanInput {...defaultProps} />}
            />
        );
        expect(
            getByLabelText('resources.foo.fields.bar').getAttribute('type')
        ).toBe('checkbox');
    });

    it('should be checked if the value is true', async () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <BooleanInput {...defaultProps} defaultValue={true} />
                )}
            />
        );
        const input = getByLabelText('resources.foo.fields.bar');
        expect(input.getAttribute('checked')).not.toBeNull();
    });

    it('should not be checked if the value is false', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <BooleanInput {...defaultProps} defaultValue={false} />
                )}
            />
        );
        expect(
            getByLabelText('resources.foo.fields.bar').getAttribute('checked')
        ).toBeNull();
    });

    it('should not be checked if the value is undefined', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => <BooleanInput {...defaultProps} />}
            />
        );
        expect(
            getByLabelText('resources.foo.fields.bar').getAttribute('checked')
        ).toBeNull();
    });

    it('should displays errors', () => {
        const { getByText, queryAllByText } = render(
            <Form
                onSubmit={jest.fn()}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <BooleanInput {...defaultProps} validate={required()} />
                        <button type="submit">Submit</button>
                    </form>
                )}
            />
        );

        fireEvent.click(getByText('Submit'));
        expect(queryAllByText('ra.validation.required')).toHaveLength(1);
    });
});
