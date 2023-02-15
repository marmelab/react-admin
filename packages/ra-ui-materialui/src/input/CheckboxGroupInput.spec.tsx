import * as React from 'react';
import expect from 'expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
    testDataProvider,
    TestTranslationProvider,
    useRecordContext,
    Form,
} from 'ra-core';

import { AdminContext } from '../AdminContext';
import { SimpleForm } from '../form';
import { CheckboxGroupInput } from './CheckboxGroupInput';

describe('<CheckboxGroupInput />', () => {
    const defaultProps = {
        source: 'tags',
        resource: 'posts',
        choices: [
            { id: 'ang', name: 'Angular' },
            { id: 'rct', name: 'React' },
        ],
    };

    it('should render choices as checkbox components', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn}>
                    <CheckboxGroupInput {...defaultProps} />
                </SimpleForm>
            </AdminContext>
        );
        const input1 = screen.getByLabelText('Angular') as HTMLInputElement;
        expect(input1.type).toBe('checkbox');
        expect(input1.value).toBe('ang');
        expect(input1.checked).toBe(false);
        const input2 = screen.getByLabelText('React') as HTMLInputElement;
        expect(input2.type).toBe('checkbox');
        expect(input2.value).toBe('rct');
        expect(input2.checked).toBe(false);
    });

    it('should use the input parameter value as the initial input value', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    onSubmit={jest.fn}
                    defaultValues={{
                        tags: ['ang'],
                    }}
                >
                    <CheckboxGroupInput
                        {...defaultProps}
                        choices={[
                            { id: 'ang', name: 'Angular' },
                            { id: 'rct', name: 'React' },
                        ]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        const input1 = screen.getByLabelText('Angular') as HTMLInputElement;
        expect(input1.checked).toEqual(true);
        const input2 = screen.getByLabelText('React') as HTMLInputElement;
        expect(input2.checked).toEqual(false);
    });

    it('should use optionValue as value identifier', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn}>
                    <CheckboxGroupInput
                        {...defaultProps}
                        optionValue="foobar"
                        choices={[{ foobar: 'foo', name: 'Bar' }]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        const input = screen.getByLabelText('Bar') as HTMLInputElement;
        expect(input.value).toBe('foo');
    });

    it('should use optionValue including "." as value identifier', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn}>
                    <CheckboxGroupInput
                        {...defaultProps}
                        optionValue="foobar.id"
                        choices={[{ foobar: { id: 'foo' }, name: 'Bar' }]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        const input = screen.getByLabelText('Bar') as HTMLInputElement;
        expect(input.value).toBe('foo');
    });

    it('should use optionText with a string value as text identifier', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn}>
                    <CheckboxGroupInput
                        {...defaultProps}
                        optionText="foobar"
                        choices={[{ id: 'foo', foobar: 'Bar' }]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(screen.queryByLabelText('Bar')).not.toBeNull();
    });

    it('should use optionText with a string value including "." as text identifier', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn}>
                    <CheckboxGroupInput
                        {...defaultProps}
                        optionText="foobar.name"
                        choices={[{ id: 'foo', foobar: { name: 'Bar' } }]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(screen.queryByLabelText('Bar')).not.toBeNull();
    });

    it('should use optionText with a function value as text identifier', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn}>
                    <CheckboxGroupInput
                        {...defaultProps}
                        optionText={choice => choice.foobar}
                        choices={[{ id: 'foo', foobar: 'Bar' }]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(screen.queryByLabelText('Bar')).not.toBeNull();
    });

    it('should use optionText with an element value as text identifier', () => {
        const Foobar = () => {
            const record = useRecordContext();
            return <span data-testid="label">{record.foobar}</span>;
        };
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn}>
                    <CheckboxGroupInput
                        {...defaultProps}
                        optionText={<Foobar />}
                        choices={[{ id: 'foo', foobar: 'Bar' }]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(screen.queryByLabelText('Bar')).not.toBeNull();
        expect(screen.queryByTestId('label')).not.toBeNull();
    });

    it('should translate the choices by default', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <TestTranslationProvider
                    messages={{
                        Angular: 'Angular **',
                        React: 'React **',
                    }}
                >
                    <SimpleForm onSubmit={jest.fn}>
                        <CheckboxGroupInput {...defaultProps} />
                    </SimpleForm>
                </TestTranslationProvider>
            </AdminContext>
        );
        expect(screen.queryByLabelText('Angular **')).not.toBeNull();
        expect(screen.queryByLabelText('React **')).not.toBeNull();
    });

    it('should not translate the choices if translateChoice is false', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <TestTranslationProvider
                    messages={{
                        Angular: 'Angular **',
                        React: 'React **',
                    }}
                >
                    <SimpleForm onSubmit={jest.fn}>
                        <CheckboxGroupInput
                            {...defaultProps}
                            translateChoice={false}
                        />
                    </SimpleForm>
                </TestTranslationProvider>
            </AdminContext>
        );
        expect(screen.queryByLabelText('Angular **')).toBeNull();
        expect(screen.queryByLabelText('React **')).toBeNull();
        expect(screen.queryByLabelText('Angular')).not.toBeNull();
        expect(screen.queryByLabelText('React')).not.toBeNull();
    });

    it('should display helperText', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn}>
                    <CheckboxGroupInput
                        {...defaultProps}
                        helperText="Can I help you?"
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(screen.queryByText('Can I help you?')).not.toBeNull();
    });

    it('should not parse selected values types to numbers if all choices types are non numbers', async () => {
        const handleSubmit = jest.fn();
        const { getByLabelText } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <Form
                    onSubmit={handleSubmit}
                    defaultValues={{ notifications: ['31', '42'] }}
                >
                    <CheckboxGroupInput
                        source="notifications"
                        choices={[
                            { id: '12', name: 'Ray Hakt' },
                            { id: '31', name: 'Ann Gullar' },
                            { id: '42', name: 'Sean Phonee' },
                        ]}
                    />
                    <button type="submit" aria-label="Save" />
                </Form>
            </AdminContext>
        );
        const input = getByLabelText('Ray Hakt') as HTMLInputElement;
        fireEvent.click(input);
        fireEvent.click(getByLabelText('Save'));

        await waitFor(() => {
            expect(handleSubmit).toHaveBeenCalledWith(
                {
                    notifications: ['31', '42', '12'],
                },
                expect.anything()
            );
        });
    });

    it('should parse selected values types to numbers if some choices are numbers', async () => {
        const handleSubmit = jest.fn();
        const { getByLabelText } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <Form
                    onSubmit={handleSubmit}
                    defaultValues={{ notifications: [31, 42] }}
                >
                    <CheckboxGroupInput
                        source="notifications"
                        choices={[
                            { id: 12, name: 'Ray Hakt' },
                            { id: 31, name: 'Ann Gullar' },
                            { id: 42, name: 'Sean Phonee' },
                        ]}
                    />
                    <button type="submit" aria-label="Save" />
                </Form>
            </AdminContext>
        );
        const input = getByLabelText('Ray Hakt') as HTMLInputElement;
        fireEvent.click(input);
        fireEvent.click(getByLabelText('Save'));

        await waitFor(() => {
            expect(handleSubmit).toHaveBeenCalledWith(
                {
                    notifications: [31, 42, 12],
                },
                expect.anything()
            );
        });
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm onSubmit={jest.fn}>
                        <CheckboxGroupInput
                            {...defaultProps}
                            validate={() => 'error'}
                        />
                    </SimpleForm>
                </AdminContext>
            );
            expect(screen.queryByText('error')).toBeNull();
        });

        it('should be empty if field has been touched but is valid', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm onSubmit={jest.fn}>
                        <CheckboxGroupInput
                            {...defaultProps}
                            validate={() => 'error'}
                        />
                    </SimpleForm>
                </AdminContext>
            );
            expect(screen.queryByText('error')).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', async () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm onSubmit={jest.fn} mode="onBlur">
                        <CheckboxGroupInput
                            {...defaultProps}
                            validate={() => 'error'}
                        />
                    </SimpleForm>
                </AdminContext>
            );
            const input = screen.queryByLabelText(
                'Angular'
            ) as HTMLInputElement;

            fireEvent.click(input);
            await waitFor(() => {
                expect(screen.queryByText('error')).not.toBeNull();
            });
        });
    });

    it('should not render a LinearProgress if loading is true and a second has not passed yet', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <CheckboxGroupInput
                        {...defaultProps}
                        isFetching
                        isLoading
                    />
                </SimpleForm>
            </AdminContext>
        );

        expect(screen.queryByRole('progressbar')).toBeNull();
    });

    it('should render a LinearProgress if loading is true, choices are empty and a second has passed', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm mode="onBlur" onSubmit={jest.fn()}>
                    <CheckboxGroupInput
                        {...defaultProps}
                        choices={[]}
                        isFetching
                        isLoading
                    />
                </SimpleForm>
            </AdminContext>
        );

        await new Promise(resolve => setTimeout(resolve, 1001));

        expect(screen.queryByRole('progressbar')).not.toBeNull();
    });

    it('should not render a LinearProgress if loading is false', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <CheckboxGroupInput {...defaultProps} />
                </SimpleForm>
            </AdminContext>
        );

        expect(screen.queryByRole('progressbar')).toBeNull();
    });
});
