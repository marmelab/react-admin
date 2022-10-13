import * as React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';

import { required, testDataProvider } from 'ra-core';
import { AdminContext } from '../AdminContext';
import { SimpleForm, Toolbar } from '../form';
import { TextInput } from './TextInput';
import { SaveButton } from '../button';

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

    it('should work with null values', async () => {
        const onSubmit = jest.fn();
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    record={{ id: 1, title: null }}
                    onSubmit={onSubmit}
                    toolbar={
                        <Toolbar>
                            <SaveButton alwaysEnable />
                        </Toolbar>
                    }
                >
                    <TextInput
                        {...defaultProps}
                        defaultValue={null}
                        parse={value => (value === '' ? null : value)}
                    />
                </SimpleForm>
            </AdminContext>
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.title'
        ) as HTMLInputElement;
        const saveBtn = screen.getByText('ra.action.save');

        expect(input.value).toEqual('');
        fireEvent.click(saveBtn);
        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(
                { id: 1, title: null },
                expect.anything()
            );
        });

        fireEvent.change(input, { target: { value: 'test' } });
        expect(input.value).toEqual('test');
        fireEvent.click(saveBtn);
        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(
                { id: 1, title: 'test' },
                expect.anything()
            );
        });

        fireEvent.change(input, { target: { value: '' } });
        expect(input.value).toEqual('');
        fireEvent.click(saveBtn);
        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(
                { id: 1, title: null },
                expect.anything()
            );
        });
    });
});
