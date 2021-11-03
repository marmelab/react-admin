import * as React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { FormWithRedirect } from 'ra-core';
import { renderWithRedux } from 'ra-test';

import { BooleanInput } from './BooleanInput';

describe('<BooleanInput />', () => {
    const defaultProps = {
        resource: 'posts',
        source: 'isPublished',
    };

    it('should render as a checkbox', () => {
        const { getByLabelText } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => <BooleanInput {...defaultProps} />}
            />
        );

        const input = getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        expect(input.type).toBe('checkbox');
    });

    it('should be checked if the value is true', () => {
        const { getByLabelText } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                defaultValues={{ isPublished: true }}
                render={() => <BooleanInput {...defaultProps} />}
            />
        );

        const input = getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        expect(input.checked).toBe(true);
    });

    it('should not be checked if the value is false', () => {
        const { getByLabelText } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                defaultValues={{ isPublished: false }}
                render={() => <BooleanInput {...defaultProps} />}
            />
        );

        const input = getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        expect(input.checked).toBe(false);
    });

    it('should not be checked if the value is undefined', () => {
        const { getByLabelText } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => <BooleanInput {...defaultProps} />}
            />
        );

        const input = getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        expect(input.checked).toBe(false);
    });

    it('should be checked if the value is undefined and defaultValue is true', () => {
        const { getByLabelText } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <BooleanInput {...defaultProps} defaultValue={true} />
                )}
            />
        );

        const input = getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        expect(input.checked).toBe(true);
    });

    it('should be checked if the value is true and defaultValue is false', () => {
        const { getByLabelText } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                defaultValues={{ isPublished: true }}
                render={() => (
                    <BooleanInput {...defaultProps} defaultValue={false} />
                )}
            />
        );

        const input = getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        expect(input.checked).toBe(true);
    });

    it('should update on click', async () => {
        const { getByLabelText } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => <BooleanInput {...defaultProps} />}
            />
        );

        const input = getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        fireEvent.click(input);
        expect(input.checked).toBe(true);
    });

    it('should display errors', async () => {
        // This validator always returns an error
        const validate = () => 'ra.validation.error';

        const { getByLabelText, queryAllByText } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                defaultValues={{ isPublished: true }}
                mode="onChange"
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

        await waitFor(() => {
            expect(queryAllByText('ra.validation.error')).toHaveLength(1);
        });
    });
});
