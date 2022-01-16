import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { CoreAdminContext, testDataProvider } from 'ra-core';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { defaultTheme } from '../defaultTheme';
import { SimpleForm } from '../form';
import { BooleanInput } from './BooleanInput';

describe('<BooleanInput />', () => {
    const defaultProps = {
        resource: 'posts',
        source: 'isPublished',
    };

    it('should render as a checkbox', () => {
        render(
            <ThemeProvider theme={createTheme(defaultTheme)}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <SimpleForm
                        defaultValues={{ isPublished: true }}
                        onSubmit={jest.fn}
                    >
                        <BooleanInput {...defaultProps} />
                    </SimpleForm>
                </CoreAdminContext>
            </ThemeProvider>
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        expect(input.type).toBe('checkbox');
    });

    it('should be checked if the value is true', () => {
        render(
            <ThemeProvider theme={createTheme(defaultTheme)}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <SimpleForm
                        onSubmit={jest.fn}
                        defaultValues={{ isPublished: true }}
                    >
                        <BooleanInput {...defaultProps} />
                    </SimpleForm>
                </CoreAdminContext>
            </ThemeProvider>
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        expect(input.checked).toBe(true);
    });

    it('should not be checked if the value is false', () => {
        render(
            <ThemeProvider theme={createTheme(defaultTheme)}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <SimpleForm
                        onSubmit={jest.fn}
                        defaultValues={{ isPublished: false }}
                    >
                        <BooleanInput {...defaultProps} />
                    </SimpleForm>
                </CoreAdminContext>
            </ThemeProvider>
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        expect(input.checked).toBe(false);
    });

    it('should not be checked if the value is undefined', () => {
        render(
            <ThemeProvider theme={createTheme(defaultTheme)}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <SimpleForm onSubmit={jest.fn}>
                        <BooleanInput {...defaultProps} />
                    </SimpleForm>
                </CoreAdminContext>
            </ThemeProvider>
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        expect(input.checked).toBe(false);
    });

    it('should be checked if the value is undefined and defaultValue is true', () => {
        render(
            <ThemeProvider theme={createTheme(defaultTheme)}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <SimpleForm onSubmit={jest.fn}>
                        <BooleanInput {...defaultProps} defaultValue={true} />
                    </SimpleForm>
                </CoreAdminContext>
            </ThemeProvider>
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        expect(input.checked).toBe(true);
    });

    it('should be checked if the value is true and defaultValue is false', () => {
        render(
            <ThemeProvider theme={createTheme(defaultTheme)}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <SimpleForm
                        onSubmit={jest.fn}
                        record={{ isPublished: true }}
                    >
                        <BooleanInput {...defaultProps} defaultValue={false} />
                    </SimpleForm>
                </CoreAdminContext>
            </ThemeProvider>
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        expect(input.checked).toBe(true);
    });

    it('should update on click', async () => {
        render(
            <ThemeProvider theme={createTheme(defaultTheme)}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <SimpleForm
                        defaultValues={{ isPublished: false }}
                        onSubmit={jest.fn}
                    >
                        <BooleanInput {...defaultProps} />
                    </SimpleForm>
                </CoreAdminContext>
            </ThemeProvider>
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        fireEvent.click(input);
        await waitFor(() => {
            expect(input.checked).toBe(true);
        });
    });

    it('should display errors', async () => {
        // This validator always returns an error
        const validate = () => 'ra.validation.error';

        render(
            <ThemeProvider theme={createTheme(defaultTheme)}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <SimpleForm
                        onSubmit={jest.fn}
                        defaultValues={{ isPublished: true }}
                        mode="onChange"
                    >
                        <BooleanInput {...defaultProps} validate={validate} />
                    </SimpleForm>
                </CoreAdminContext>
            </ThemeProvider>
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        fireEvent.click(input);
        expect(input.checked).toBe(false);

        await waitFor(() => {
            expect(screen.queryByText('ra.validation.error')).not.toBeNull();
        });
    });
});
