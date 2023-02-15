import * as React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { required, testDataProvider } from 'ra-core';

import { AdminContext } from '../AdminContext';
import { SimpleForm } from '../form';
import { TextInput } from './TextInput';
import { ValueNull, Parse } from './TextInput.stories';

describe('<TextInput />', () => {
    const defaultProps = {
        source: 'title',
        resource: 'posts',
    };

    it('should render the input correctly', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    defaultValues={{ title: 'hello' }}
                    onSubmit={jest.fn}
                >
                    <TextInput {...defaultProps} />
                </SimpleForm>
            </AdminContext>
        );
        const TextFieldElement = screen.getByLabelText(
            'resources.posts.fields.title'
        ) as HTMLInputElement;
        expect(TextFieldElement.value).toEqual('hello');
        expect(TextFieldElement.getAttribute('type')).toEqual('text');
    });

    it('should use a ResettableTextField when type is password', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    defaultValues={{ title: 'hello' }}
                    onSubmit={jest.fn}
                >
                    <TextInput {...defaultProps} type="password" />
                </SimpleForm>
            </AdminContext>
        );
        const TextFieldElement = screen.getByLabelText(
            'resources.posts.fields.title'
        );
        expect(TextFieldElement.getAttribute('type')).toEqual('password');
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm onSubmit={jest.fn}>
                        <TextInput
                            {...defaultProps}
                            defaultValue=""
                            validate={required()}
                        />
                    </SimpleForm>
                </AdminContext>
            );
            fireEvent.click(screen.getByText('ra.action.save'));
            const error = screen.queryByText('ra.validation.required');
            expect(error).toBeNull();
        });

        it('should not be displayed if field has been touched but is valid', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm onSubmit={jest.fn}>
                        <TextInput
                            {...defaultProps}
                            defaultValue=""
                            validate={required()}
                        />
                    </SimpleForm>
                </AdminContext>
            );

            const input = screen.getByLabelText(
                'resources.posts.fields.title *'
            );
            fireEvent.change(input, { target: { value: 'test' } });
            fireEvent.click(screen.getByText('ra.action.save'));
            const error = screen.queryByText('ra.validation.required');
            expect(error).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', async () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm mode="onBlur" onSubmit={jest.fn}>
                        <TextInput
                            {...defaultProps}
                            defaultValue="foo"
                            validate={required()}
                        />
                    </SimpleForm>
                </AdminContext>
            );

            const input = screen.getByLabelText(
                'resources.posts.fields.title *'
            );
            fireEvent.change(input, { target: { value: '' } });
            fireEvent.blur(input);
            await waitFor(() => {
                expect(
                    screen.queryByText('ra.validation.required')
                ).not.toBeNull();
            });
        });
    });

    it('should keep null values', async () => {
        const onSuccess = jest.fn();
        render(<ValueNull onSuccess={onSuccess} />);
        const input = (await screen.findByLabelText(
            'resources.posts.fields.title'
        )) as HTMLInputElement;
        const saveBtn = screen.getByText('ra.action.save');

        expect(input.value).toEqual('');
        fireEvent.click(saveBtn);
        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalledWith(
                { id: 123, title: null },
                expect.anything(),
                expect.anything()
            );
        });

        fireEvent.change(input, { target: { value: 'test' } });
        expect(input.value).toEqual('test');
        fireEvent.click(saveBtn);
        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalledWith(
                { id: 123, title: 'test' },
                expect.anything(),
                expect.anything()
            );
        });

        fireEvent.change(input, { target: { value: '' } });
        expect(input.value).toEqual('');
        fireEvent.click(saveBtn);
        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalledWith(
                { id: 123, title: null },
                expect.anything(),
                expect.anything()
            );
        });
    });

    describe('parse', () => {
        it('should transform the value before storing it in the form state', () => {
            render(<Parse />);
            const input = screen.getByLabelText(
                'resources.posts.fields.title'
            ) as HTMLInputElement;
            expect(input.value).toEqual('Lorem ipsum');
            fireEvent.change(input, { target: { value: 'foo' } });
            expect(input.value).toEqual('bar');
        });
    });

    describe('label', () => {
        it('should render label when `label` prop not specified', () => {
            const { container } = render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm
                        defaultValues={{ title: 'hello' }}
                        onSubmit={jest.fn}
                    >
                        <TextInput {...defaultProps} />
                    </SimpleForm>
                </AdminContext>
            );

            expect(container.querySelector(`label`)).not.toBeNull();
        });

        it('should render label when `label` prop is non-empty string', () => {
            const { container } = render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm
                        defaultValues={{ title: 'hello' }}
                        onSubmit={jest.fn}
                    >
                        <TextInput {...defaultProps} label="label" />
                    </SimpleForm>
                </AdminContext>
            );

            expect(container.querySelector(`label`)).not.toBeNull();
        });

        it('should not render label when `label` prop is `false`', () => {
            const { container } = render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm
                        defaultValues={{ title: 'hello' }}
                        onSubmit={jest.fn}
                    >
                        <TextInput {...defaultProps} label={false} />
                    </SimpleForm>
                </AdminContext>
            );

            expect(container.querySelector(`label`)).toBeNull();
        });

        it('should not render label when `label` prop is empty string', () => {
            const { container } = render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm
                        defaultValues={{ title: 'hello' }}
                        onSubmit={jest.fn}
                    >
                        <TextInput {...defaultProps} label="" />
                    </SimpleForm>
                </AdminContext>
            );

            expect(container.querySelector(`label`)).toBeNull();
        });
    });
});
