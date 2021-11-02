import * as React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { FormWithRedirect, required } from 'ra-core';
import { renderWithRedux } from 'ra-test';

import { TextInput } from './TextInput';

describe('<TextInput />', () => {
    const defaultProps = {
        source: 'title',
        resource: 'posts',
    };

    it('should render the input correctly', () => {
        renderWithRedux(
            <FormWithRedirect
                defaultValues={{ title: 'hello' }}
                save={jest.fn}
                render={() => <TextInput {...defaultProps} />}
            />
        );
        const TextFieldElement = screen.getByLabelText(
            'resources.posts.fields.title'
        ) as HTMLInputElement;
        expect(TextFieldElement.value).toEqual('hello');
        expect(TextFieldElement.getAttribute('type')).toEqual('text');
    });

    it('should use a ResettableTextField when type is password', () => {
        renderWithRedux(
            <FormWithRedirect
                defaultValues={{ title: 'hello' }}
                save={jest.fn}
                render={() => <TextInput {...defaultProps} type="password" />}
            />
        );
        const TextFieldElement = screen.getByLabelText(
            'resources.posts.fields.title'
        );
        expect(TextFieldElement.getAttribute('type')).toEqual('password');
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            renderWithRedux(
                <FormWithRedirect
                    save={jest.fn}
                    render={() => (
                        <TextInput {...defaultProps} validate={required()} />
                    )}
                />
            );
            const error = screen.queryByText('ra.validation.required');
            expect(error).toBeNull();
        });

        it('should not be displayed if field has been touched but is valid', () => {
            renderWithRedux(
                <FormWithRedirect
                    save={jest.fn}
                    render={() => (
                        <TextInput {...defaultProps} validate={required()} />
                    )}
                />
            );

            const input = screen.getByLabelText(
                'resources.posts.fields.title *'
            );
            fireEvent.change(input, { target: { value: 'test' } });
            const error = screen.queryByText('ra.validation.required');
            expect(error).toBeNull();
        });

        it('should be displayed on submit if field is invalid', async () => {
            renderWithRedux(
                <FormWithRedirect
                    save={jest.fn}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <TextInput
                                {...defaultProps}
                                validate={required()}
                            />
                            <button type="submit">Save</button>
                        </form>
                    )}
                />
            );

            fireEvent.click(screen.getByText('Save'));

            await waitFor(() => {
                const error = screen.queryByText('ra.validation.required');
                expect(error).not.toBeNull();
            });
        });
    });
});
