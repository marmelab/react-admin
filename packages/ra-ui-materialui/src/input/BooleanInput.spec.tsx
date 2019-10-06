import React from 'react';
import {
    render,
    cleanup,
    fireEvent,
    waitForDomChange,
} from '@testing-library/react';
import { Form } from 'react-final-form';

import BooleanInput from './BooleanInput';

describe('<BooleanInput />', () => {
    afterEach(cleanup);

    const defaultProps = {
        resource: 'posts',
        source: 'isPublished',
    };

    it('should render as a checkbox', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => <BooleanInput {...defaultProps} />}
            />
        );

        const input = getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        expect(input.type).toBe('checkbox');
    });

    it('should be checked if the value is true', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                initialValues={{ isPublished: true }}
                render={() => <BooleanInput {...defaultProps} />}
            />
        );

        const input = getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        expect(input.checked).toBe(true);
    });

    it('should not be checked if the value is false', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                initialValues={{ isPublished: false }}
                render={() => <BooleanInput {...defaultProps} />}
            />
        );

        const input = getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        expect(input.checked).toBe(false);
    });

    it('should not be checked if the value is undefined', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => <BooleanInput {...defaultProps} />}
            />
        );

        const input = getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        expect(input.checked).toBe(false);
    });

    it('should update on click', async () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => <BooleanInput {...defaultProps} />}
            />
        );

        const input = getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        fireEvent.click(input);
        expect(input.checked).toBe(true);
    });

    it('should displays errors', () => {
        // This validator always returns an error
        const validate = () => 'ra.validation.error';

        const { getByLabelText, queryAllByText } = render(
            <Form
                onSubmit={jest.fn}
                initialValues={{ isPublished: true }}
                validateOnBlur
                render={() => (
                    <BooleanInput {...defaultProps} validate={validate} />
                )}
            />
        );
        const input = getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        fireEvent.click(input);
        expect(input.checked).toBe(false);

        fireEvent.blur(input);
        expect(queryAllByText('ra.validation.error')).toHaveLength(1);
    });
});
