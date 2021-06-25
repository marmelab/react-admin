import { ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { fireEvent, getByText, waitFor } from '@testing-library/react';
import expect from 'expect';
import { SaveContextProvider, SideEffectContextProvider } from 'ra-core';
import { renderWithRedux } from 'ra-test';
import * as React from 'react';
import { ArrayInput } from '../input';
import TextInput from '../input/TextInput';
import SimpleForm from './SimpleForm';
import SimpleFormIterator from './SimpleFormIterator';

const theme = createMuiTheme();

describe('<SimpleFormIterator />', () => {
    // bypass confirm leave form with unsaved changes
    let confirmSpy;
    beforeAll(() => {
        confirmSpy = jest.spyOn(window, 'confirm');
        confirmSpy.mockImplementation(jest.fn(() => true));
    });
    afterAll(() => confirmSpy.mockRestore());

    const saveContextValue = {
        save: jest.fn(),
        saving: false,
        setOnFailure: jest.fn(),
    };
    const sideEffectValue = {};

    it('should display one input group per row', () => {
        const { queryAllByLabelText } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <SaveContextProvider value={saveContextValue}>
                    <SideEffectContextProvider value={sideEffectValue}>
                        <SimpleForm
                            record={{
                                id: 'whatever',
                                emails: [{ email: 'foo' }, { email: 'bar' }],
                            }}
                        >
                            <ArrayInput source="emails">
                                <SimpleFormIterator>
                                    <TextInput source="email" />
                                </SimpleFormIterator>
                            </ArrayInput>
                        </SimpleForm>
                    </SideEffectContextProvider>
                </SaveContextProvider>
            </ThemeProvider>
        );
        const inputElements = queryAllByLabelText(
            'resources.undefined.fields.email'
        );
        expect(inputElements).toHaveLength(2);
        expect((inputElements[0] as HTMLInputElement).disabled).toBeFalsy();
        expect((inputElements[0] as HTMLInputElement).value).toBe('foo');
        expect((inputElements[1] as HTMLInputElement).disabled).toBeFalsy();
        expect((inputElements[1] as HTMLInputElement).value).toBe('bar');
    });

    it('should render disabled inputs when disabled is true', () => {
        const { queryAllByLabelText } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <SaveContextProvider value={saveContextValue}>
                    <SideEffectContextProvider value={sideEffectValue}>
                        <SimpleForm
                            record={{
                                id: 'whatever',
                                emails: [{ email: 'foo' }, { email: 'bar' }],
                            }}
                        >
                            <ArrayInput source="emails" disabled>
                                <SimpleFormIterator>
                                    <TextInput source="email" />
                                </SimpleFormIterator>
                            </ArrayInput>
                        </SimpleForm>
                    </SideEffectContextProvider>
                </SaveContextProvider>
            </ThemeProvider>
        );
        const inputElements = queryAllByLabelText(
            'resources.undefined.fields.email'
        );
        expect(inputElements).toHaveLength(2);
        expect((inputElements[0] as HTMLInputElement).disabled).toBeTruthy();
        expect((inputElements[0] as HTMLInputElement).value).toBe('foo');
        expect((inputElements[1] as HTMLInputElement).disabled).toBeTruthy();
        expect((inputElements[1] as HTMLInputElement).value).toBe('bar');
    });

    it('should allow to override the disabled prop of each inputs', () => {
        const { queryAllByLabelText } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <SaveContextProvider value={saveContextValue}>
                    <SideEffectContextProvider value={sideEffectValue}>
                        <SimpleForm
                            record={{
                                id: 'whatever',
                                emails: [{ email: 'foo' }, { email: 'bar' }],
                            }}
                        >
                            <ArrayInput source="emails">
                                <SimpleFormIterator>
                                    <TextInput source="email" disabled />
                                </SimpleFormIterator>
                            </ArrayInput>
                        </SimpleForm>
                    </SideEffectContextProvider>
                </SaveContextProvider>
            </ThemeProvider>
        );
        const inputElements = queryAllByLabelText(
            'resources.undefined.fields.email'
        );
        expect(inputElements).toHaveLength(2);
        expect((inputElements[0] as HTMLInputElement).disabled).toBeTruthy();
        expect((inputElements[0] as HTMLInputElement).value).toBe('foo');
        expect((inputElements[1] as HTMLInputElement).disabled).toBeTruthy();
        expect((inputElements[1] as HTMLInputElement).value).toBe('bar');
    });

    it('should display an add item button at least', () => {
        const { getByText } = renderWithRedux(
            <SaveContextProvider value={saveContextValue}>
                <SideEffectContextProvider value={sideEffectValue}>
                    <SimpleForm>
                        <ArrayInput source="emails">
                            <SimpleFormIterator>
                                <TextInput source="email" />
                            </SimpleFormIterator>
                        </ArrayInput>
                    </SimpleForm>
                </SideEffectContextProvider>
            </SaveContextProvider>
        );

        expect(getByText('ra.action.add')).not.toBeNull();
    });

    it('should not display add button if disableAdd is truthy', () => {
        const { queryAllByText } = renderWithRedux(
            <SaveContextProvider value={saveContextValue}>
                <SideEffectContextProvider value={sideEffectValue}>
                    <SimpleForm>
                        <ArrayInput source="emails">
                            <SimpleFormIterator disableAdd>
                                <TextInput source="email" />
                            </SimpleFormIterator>
                        </ArrayInput>
                    </SimpleForm>
                </SideEffectContextProvider>
            </SaveContextProvider>
        );

        expect(queryAllByText('ra.action.add').length).toBe(0);
    });

    it('should not display add button if disabled is truthy', () => {
        const { queryAllByText } = renderWithRedux(
            <SaveContextProvider value={saveContextValue}>
                <SideEffectContextProvider value={sideEffectValue}>
                    <SimpleForm>
                        <ArrayInput source="emails" disabled>
                            <SimpleFormIterator>
                                <TextInput source="email" />
                            </SimpleFormIterator>
                        </ArrayInput>
                    </SimpleForm>
                </SideEffectContextProvider>
            </SaveContextProvider>
        );

        expect(queryAllByText('ra.action.add').length).toBe(0);
    });

    it('should not display remove button if disableRemove is truthy', () => {
        const { queryAllByText } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <SaveContextProvider value={saveContextValue}>
                    <SideEffectContextProvider value={sideEffectValue}>
                        <SimpleForm
                            record={{
                                id: 'whatever',
                                emails: [{ email: '' }, { email: '' }],
                            }}
                        >
                            <ArrayInput source="emails">
                                <SimpleFormIterator disableRemove>
                                    <TextInput source="email" />
                                </SimpleFormIterator>
                            </ArrayInput>
                        </SimpleForm>
                    </SideEffectContextProvider>
                </SaveContextProvider>
            </ThemeProvider>
        );

        expect(queryAllByText('ra.action.remove').length).toBe(0);
    });

    it('should not display remove button if disabled is truthy', () => {
        const { queryAllByText } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <SaveContextProvider value={saveContextValue}>
                    <SideEffectContextProvider value={sideEffectValue}>
                        <SimpleForm
                            record={{
                                id: 'whatever',
                                emails: [{ email: '' }, { email: '' }],
                            }}
                        >
                            <ArrayInput source="emails" disabled>
                                <SimpleFormIterator>
                                    <TextInput source="email" />
                                </SimpleFormIterator>
                            </ArrayInput>
                        </SimpleForm>
                    </SideEffectContextProvider>
                </SaveContextProvider>
            </ThemeProvider>
        );

        expect(queryAllByText('ra.action.remove').length).toBe(0);
    });

    it('should add children row on add button click', async () => {
        const {
            getByText,
            queryAllByLabelText,
            queryAllByText,
        } = renderWithRedux(
            <SaveContextProvider value={saveContextValue}>
                <SideEffectContextProvider value={sideEffectValue}>
                    <SimpleForm>
                        <ArrayInput source="emails">
                            <SimpleFormIterator>
                                <TextInput source="email" />
                            </SimpleFormIterator>
                        </ArrayInput>
                    </SimpleForm>
                </SideEffectContextProvider>
            </SaveContextProvider>
        );

        const addItemElement = getByText('ra.action.add').closest('button');

        fireEvent.click(addItemElement);
        await waitFor(() => {
            const inputElements = queryAllByLabelText(
                'resources.undefined.fields.email'
            );

            expect(inputElements.length).toBe(1);
        });

        fireEvent.click(addItemElement);
        await waitFor(() => {
            const inputElements = queryAllByLabelText(
                'resources.undefined.fields.email'
            );

            expect(inputElements.length).toBe(2);
        });

        const inputElements = queryAllByLabelText(
            'resources.undefined.fields.email'
        );

        expect(
            inputElements.map((inputElement: HTMLInputElement) => ({
                email: inputElement.value,
            }))
        ).toEqual([{ email: '' }, { email: '' }]);

        expect(queryAllByText('ra.action.remove').length).toBe(2);
    });

    it('should add correct children on add button click without source', async () => {
        const {
            getByText,
            queryAllByLabelText,
            queryAllByText,
        } = renderWithRedux(
            <SaveContextProvider value={saveContextValue}>
                <SideEffectContextProvider value={sideEffectValue}>
                    <SimpleForm>
                        <ArrayInput source="emails">
                            <SimpleFormIterator>
                                <TextInput source="email" label="CustomLabel" />
                            </SimpleFormIterator>
                        </ArrayInput>
                    </SimpleForm>
                </SideEffectContextProvider>
            </SaveContextProvider>
        );

        const addItemElement = getByText('ra.action.add').closest('button');

        fireEvent.click(addItemElement);
        await waitFor(() => {
            const inputElements = queryAllByLabelText('CustomLabel');

            expect(inputElements.length).toBe(1);
        });

        const inputElements = queryAllByLabelText('CustomLabel');

        expect(
            inputElements.map(
                (inputElement: HTMLInputElement) => inputElement.value
            )
        ).toEqual(['']);

        expect(queryAllByText('ra.action.remove').length).toBe(1);
    });

    it('should add correct children with default value on add button click without source', async () => {
        const {
            getByText,
            queryAllByLabelText,
            queryAllByText,
        } = renderWithRedux(
            <SaveContextProvider value={saveContextValue}>
                <SideEffectContextProvider value={sideEffectValue}>
                    <SimpleForm>
                        <ArrayInput source="emails">
                            <SimpleFormIterator>
                                <TextInput
                                    source="email"
                                    label="CustomLabel"
                                    defaultValue={5}
                                />
                            </SimpleFormIterator>
                        </ArrayInput>
                    </SimpleForm>
                </SideEffectContextProvider>
            </SaveContextProvider>
        );

        const addItemElement = getByText('ra.action.add').closest('button');

        fireEvent.click(addItemElement);
        await waitFor(() => {
            const inputElements = queryAllByLabelText('CustomLabel');

            expect(inputElements.length).toBe(1);
        });

        const inputElements = queryAllByLabelText('CustomLabel');

        expect(
            inputElements.map(
                (inputElement: HTMLInputElement) => inputElement.value
            )
        ).toEqual(['5']);

        expect(queryAllByText('ra.action.remove').length).toBe(1);
    });

    it('should remove children row on remove button click', async () => {
        const emails = [{ email: 'foo@bar.com' }, { email: 'bar@foo.com' }];

        const { queryAllByLabelText } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <SaveContextProvider value={saveContextValue}>
                    <SideEffectContextProvider value={sideEffectValue}>
                        <SimpleForm record={{ id: 'whatever', emails }}>
                            <ArrayInput source="emails">
                                <SimpleFormIterator>
                                    <TextInput source="email" />
                                </SimpleFormIterator>
                            </ArrayInput>
                        </SimpleForm>
                    </SideEffectContextProvider>
                </SaveContextProvider>
            </ThemeProvider>
        );

        const inputElements = queryAllByLabelText(
            'resources.undefined.fields.email'
        );

        expect(
            inputElements.map((inputElement: HTMLInputElement) => ({
                email: inputElement.value,
            }))
        ).toEqual(emails);

        const removeFirstButton = getByText(
            inputElements[0].closest('li'),
            'ra.action.remove'
        ).closest('button');

        fireEvent.click(removeFirstButton);
        await waitFor(() => {
            const inputElements = queryAllByLabelText(
                'resources.undefined.fields.email'
            );

            expect(
                inputElements.map((inputElement: HTMLInputElement) => ({
                    email: inputElement.value,
                }))
            ).toEqual([{ email: 'bar@foo.com' }]);
        });
    });

    it('should not display the default add button if a custom add button is passed', () => {
        const { queryAllByText } = renderWithRedux(
            <SaveContextProvider value={saveContextValue}>
                <SideEffectContextProvider value={sideEffectValue}>
                    <SimpleForm>
                        <ArrayInput source="emails">
                            <SimpleFormIterator
                                addButton={<button>Custom Add Button</button>}
                            >
                                <TextInput source="email" />
                            </SimpleFormIterator>
                        </ArrayInput>
                    </SimpleForm>
                </SideEffectContextProvider>
            </SaveContextProvider>
        );
        expect(queryAllByText('ra.action.add').length).toBe(0);
    });

    it('should not display the default remove button if a custom remove button is passed', () => {
        const { queryAllByText } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <SaveContextProvider value={saveContextValue}>
                    <SideEffectContextProvider value={sideEffectValue}>
                        <SimpleForm
                            record={{ id: 'whatever', emails: [{ email: '' }] }}
                        >
                            <ArrayInput source="emails">
                                <SimpleFormIterator
                                    removeButton={
                                        <button>Custom Remove Button</button>
                                    }
                                >
                                    <TextInput source="email" />
                                </SimpleFormIterator>
                            </ArrayInput>
                        </SimpleForm>
                    </SideEffectContextProvider>
                </SaveContextProvider>
            </ThemeProvider>
        );

        expect(queryAllByText('ra.action.remove').length).toBe(0);
    });

    it('should display the custom add button', () => {
        const { getByText } = renderWithRedux(
            <SaveContextProvider value={saveContextValue}>
                <SideEffectContextProvider value={sideEffectValue}>
                    <SimpleForm>
                        <ArrayInput source="emails">
                            <SimpleFormIterator
                                addButton={<button>Custom Add Button</button>}
                            >
                                <TextInput source="email" />
                            </SimpleFormIterator>
                        </ArrayInput>
                    </SimpleForm>
                </SideEffectContextProvider>
            </SaveContextProvider>
        );

        expect(getByText('Custom Add Button')).not.toBeNull();
    });

    it('should display the custom remove button', () => {
        const { getByText } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <SaveContextProvider value={saveContextValue}>
                    <SideEffectContextProvider value={sideEffectValue}>
                        <SimpleForm
                            record={{ id: 'whatever', emails: [{ email: '' }] }}
                        >
                            <ArrayInput source="emails">
                                <SimpleFormIterator
                                    removeButton={
                                        <button>Custom Remove Button</button>
                                    }
                                >
                                    <TextInput source="email" />
                                </SimpleFormIterator>
                            </ArrayInput>
                        </SimpleForm>
                    </SideEffectContextProvider>
                </SaveContextProvider>
            </ThemeProvider>
        );

        expect(getByText('Custom Remove Button')).not.toBeNull();
    });

    it('should display custom row label', () => {
        const { getByText } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <SaveContextProvider value={saveContextValue}>
                    <SideEffectContextProvider value={sideEffectValue}>
                        <SimpleForm
                            record={{
                                id: 'whatever',
                                emails: [{ email: 'foo' }, { email: 'bar' }],
                            }}
                        >
                            <ArrayInput source="emails">
                                <SimpleFormIterator
                                    getItemLabel={index => `3.${index}`}
                                >
                                    <TextInput source="email" />
                                </SimpleFormIterator>
                            </ArrayInput>
                        </SimpleForm>
                    </SideEffectContextProvider>
                </SaveContextProvider>
            </ThemeProvider>
        );

        expect(getByText('3.0')).toBeDefined();
        expect(getByText('3.1')).toBeDefined();
    });

    it('should call the onClick method when the custom add button is clicked', async () => {
        const onClick = jest.fn().mockImplementation(e => e.preventDefault());
        const { getByText } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <SaveContextProvider value={saveContextValue}>
                    <SideEffectContextProvider value={sideEffectValue}>
                        <SimpleForm>
                            <ArrayInput source="emails">
                                <SimpleFormIterator
                                    addButton={
                                        <button onClick={onClick}>
                                            Custom Add Button
                                        </button>
                                    }
                                >
                                    <TextInput source="email" />
                                </SimpleFormIterator>
                            </ArrayInput>
                        </SimpleForm>
                    </SideEffectContextProvider>
                </SaveContextProvider>
            </ThemeProvider>
        );
        fireEvent.click(getByText('Custom Add Button'));
        expect(onClick).toHaveBeenCalled();
    });

    it('should call the onClick method when the custom remove button is clicked', async () => {
        const onClick = jest.fn().mockImplementation(e => e.preventDefault());
        const { getByText } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <SaveContextProvider value={saveContextValue}>
                    <SideEffectContextProvider value={sideEffectValue}>
                        <SimpleForm
                            record={{ id: 'whatever', emails: [{ email: '' }] }}
                        >
                            <ArrayInput source="emails">
                                <SimpleFormIterator
                                    removeButton={
                                        <button onClick={onClick}>
                                            Custom Remove Button
                                        </button>
                                    }
                                >
                                    <TextInput source="email" />
                                </SimpleFormIterator>
                            </ArrayInput>
                        </SimpleForm>
                    </SideEffectContextProvider>
                </SaveContextProvider>
            </ThemeProvider>
        );
        fireEvent.click(getByText('Custom Remove Button'));
        expect(onClick).toHaveBeenCalled();
    });
});
