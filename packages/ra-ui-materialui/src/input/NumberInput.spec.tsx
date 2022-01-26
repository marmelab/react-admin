import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { testDataProvider } from 'ra-core';

import { AdminContext } from '../AdminContext';
import { SimpleForm } from '../form';
import { NumberInput } from './NumberInput';

describe('<NumberInput />', () => {
    const defaultProps = {
        source: 'views',
        resource: 'posts',
    };

    it('should use a mui TextField', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm defaultValues={{ views: 12 }} onSubmit={jest.fn()}>
                    <NumberInput {...defaultProps} />
                </SimpleForm>
            </AdminContext>
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.views'
        ) as HTMLInputElement;
        expect(input.value).toEqual('12');
        expect(input.getAttribute('type')).toEqual('number');
    });

    it('should accept `step` prop and pass it to native input', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <NumberInput {...defaultProps} step="0.1" />
                </SimpleForm>
            </AdminContext>
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.views'
        ) as HTMLInputElement;
        expect(input.step).toEqual('0.1');
    });

    describe('onChange event', () => {
        it('should be customizable via the `onChange` prop', async () => {
            let value;
            const onChange = jest.fn(event => {
                value = event.target.value;
            });

            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm
                        defaultValues={{ views: 12 }}
                        onSubmit={jest.fn()}
                    >
                        <NumberInput {...defaultProps} onChange={onChange} />
                    </SimpleForm>
                </AdminContext>
            );
            const input = screen.getByLabelText('resources.posts.fields.views');
            fireEvent.change(input, { target: { value: 3 } });
            await waitFor(() => {
                expect(value).toEqual('3');
            });
        });

        it('should keep calling the form library original event', async () => {
            const onSubmit = jest.fn();
            let value;
            const onChange = jest.fn(event => {
                value = event.target.value;
            });
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm
                        defaultValues={{ views: 12 }}
                        onSubmit={onSubmit}
                    >
                        <NumberInput {...defaultProps} onChange={onChange} />
                    </SimpleForm>
                </AdminContext>
            );
            const input = screen.getByLabelText('resources.posts.fields.views');
            fireEvent.change(input, { target: { value: 3 } });
            expect(value).toEqual('3');
            fireEvent.click(screen.getByText('ra.action.save'));
            await waitFor(() => {
                expect(onSubmit).toHaveBeenCalledWith({ views: 3 });
            });
        });

        it('should cast value as a numeric one', async () => {
            const onSubmit = jest.fn();

            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm
                        defaultValues={{ views: 12 }}
                        onSubmit={onSubmit}
                    >
                        <NumberInput {...defaultProps} />
                    </SimpleForm>
                </AdminContext>
            );
            const input = screen.getByLabelText('resources.posts.fields.views');
            fireEvent.change(input, { target: { value: '3' } });
            fireEvent.click(screen.getByText('ra.action.save'));
            await waitFor(() => {
                expect(onSubmit).toHaveBeenCalledWith({ views: 3 });
            });
            expect(typeof onSubmit.mock.calls[0][0].views).toEqual('number');
        });
    });

    describe('onFocus event', () => {
        it('should be customizable via the `onFocus` prop', () => {
            const onFocus = jest.fn();

            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm
                        defaultValues={{ views: 12 }}
                        onSubmit={jest.fn()}
                    >
                        <NumberInput {...defaultProps} onFocus={onFocus} />
                    </SimpleForm>
                </AdminContext>
            );
            const input = screen.getByLabelText('resources.posts.fields.views');
            fireEvent.focus(input);
            expect(onFocus).toHaveBeenCalled();
        });
    });

    describe('onBlur event', () => {
        it('should be customizable via the `onBlur` prop', () => {
            const onBlur = jest.fn();

            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm
                        defaultValues={{ views: 12 }}
                        onSubmit={jest.fn()}
                    >
                        <NumberInput {...defaultProps} onBlur={onBlur} />
                    </SimpleForm>
                </AdminContext>
            );
            const input = screen.getByLabelText('resources.posts.fields.views');
            fireEvent.blur(input);
            expect(onBlur).toHaveBeenCalled();
        });
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm
                        defaultValues={{ views: 12 }}
                        onSubmit={jest.fn()}
                    >
                        <NumberInput
                            {...defaultProps}
                            validate={() => 'error'}
                        />
                    </SimpleForm>
                </AdminContext>
            );
            const error = screen.queryByText('error');
            expect(error).toBeNull();
        });

        it('should not be displayed if field has been touched but is valid', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm
                        defaultValues={{ views: 12 }}
                        onSubmit={jest.fn()}
                    >
                        <NumberInput
                            {...defaultProps}
                            validate={() => 'error'}
                        />
                    </SimpleForm>
                </AdminContext>
            );
            const input = screen.getByLabelText('resources.posts.fields.views');
            fireEvent.change(input, { target: { value: '3' } });
            input.blur();

            const error = screen.queryByText('error');
            expect(error).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', async () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm
                        defaultValues={{ views: 12 }}
                        onSubmit={jest.fn()}
                        mode="onBlur"
                    >
                        <NumberInput
                            {...defaultProps}
                            validate={() => 'error'}
                        />
                    </SimpleForm>
                </AdminContext>
            );
            const input = screen.getByLabelText('resources.posts.fields.views');
            fireEvent.blur(input);

            await waitFor(() => {
                expect(screen.getByText('error')).not.toBeNull();
            });
        });
    });
});
