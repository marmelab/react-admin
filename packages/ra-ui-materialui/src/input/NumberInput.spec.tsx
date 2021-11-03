import * as React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { FormWithRedirect, required } from 'ra-core';
import { renderWithRedux } from 'ra-test';

import { NumberInput } from './NumberInput';

describe('<NumberInput />', () => {
    const defaultProps = {
        source: 'views',
        resource: 'posts',
    };

    it('should use a mui TextField', () => {
        const { getByLabelText } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                defaultValues={{ views: 12 }}
                render={() => <NumberInput {...defaultProps} />}
            />
        );
        const input = getByLabelText(
            'resources.posts.fields.views'
        ) as HTMLInputElement;
        expect(input.value).toEqual('12');
        expect(input.getAttribute('type')).toEqual('number');
    });

    describe('props', () => {
        it('should accept `step` prop and pass it to native input', () => {
            const { getByLabelText } = renderWithRedux(
                <FormWithRedirect
                    save={jest.fn()}
                    render={() => <NumberInput {...defaultProps} step="0.1" />}
                />
            );
            const input = getByLabelText(
                'resources.posts.fields.views'
            ) as HTMLInputElement;
            expect(input.step).toEqual('0.1');
        });
    });

    describe('onChange event', () => {
        it('should be customizable via the `onChange` prop', () => {
            let value;
            const onChange = jest.fn(event => {
                value = event.target.value;
            });

            const { getByLabelText } = renderWithRedux(
                <FormWithRedirect
                    save={jest.fn()}
                    render={() => (
                        <NumberInput {...defaultProps} onChange={onChange} />
                    )}
                />
            );
            const input = getByLabelText('resources.posts.fields.views');
            fireEvent.change(input, { target: { value: 3 } });
            expect(value).toEqual('3');
        });

        it('should cast value as a numeric one', async () => {
            let values;
            let save = jest.fn(formValues => {
                values = formValues;
            });

            const { getByLabelText, getByText } = renderWithRedux(
                <>
                    <FormWithRedirect
                        save={save}
                        render={({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <NumberInput {...defaultProps} />
                                <button type="submit">Save</button>
                            </form>
                        )}
                    />
                </>
            );
            const input = getByLabelText('resources.posts.fields.views');
            fireEvent.change(input, { target: { value: '3' } });
            fireEvent.click(getByText('Save'));

            await waitFor(() => {
                expect(values.views).toStrictEqual(3);
            });
        });
    });

    describe('onFocus event', () => {
        it('should be customizable via the `onFocus` prop', () => {
            const onFocus = jest.fn();

            const { getByLabelText } = renderWithRedux(
                <FormWithRedirect
                    save={jest.fn()}
                    render={() => (
                        <NumberInput {...defaultProps} onFocus={onFocus} />
                    )}
                />
            );
            const input = getByLabelText('resources.posts.fields.views');
            input.focus();
            expect(onFocus).toHaveBeenCalled();
        });
    });

    describe('onBlur event', () => {
        it('should be customizable via the `onBlur` prop', () => {
            const onBlur = jest.fn();

            const { getByLabelText } = renderWithRedux(
                <FormWithRedirect
                    save={jest.fn()}
                    render={() => (
                        <NumberInput {...defaultProps} onBlur={onBlur} />
                    )}
                />
            );
            const input = getByLabelText('resources.posts.fields.views');
            input.focus();
            input.blur();
            expect(onBlur).toHaveBeenCalled();
        });
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const { queryByText } = renderWithRedux(
                <FormWithRedirect
                    save={jest.fn()}
                    render={() => (
                        <NumberInput {...defaultProps} validate={required()} />
                    )}
                />
            );
            const error = queryByText('ra.validation.required');
            expect(error).toBeNull();
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const { getByLabelText, queryByText } = renderWithRedux(
                <FormWithRedirect
                    save={jest.fn()}
                    mode="onChange"
                    render={() => (
                        <NumberInput {...defaultProps} validate={required()} />
                    )}
                />
            );
            const input = getByLabelText('resources.posts.fields.views *');
            fireEvent.change(input, { target: { value: '3' } });

            const error = queryByText('ra.validation.required');
            expect(error).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', async () => {
            const { getByLabelText, getByText } = renderWithRedux(
                <FormWithRedirect
                    save={jest.fn()}
                    mode="onBlur"
                    render={() => (
                        <NumberInput {...defaultProps} validate={required()} />
                    )}
                />
            );
            const input = getByLabelText('resources.posts.fields.views *');
            input.focus();
            input.blur();

            await waitFor(() => {
                expect(getByText('ra.validation.required')).not.toBeNull();
            });
        });
    });
});
