import { cleanup, fireEvent, wait, getByText } from '@testing-library/react';
import * as React from 'react';
import { renderWithRedux } from 'ra-core';
import { ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';

import SimpleFormIterator from './SimpleFormIterator';
import TextInput from '../input/TextInput';
import { ArrayInput } from '../input';
import SimpleForm from './SimpleForm';

const theme = createMuiTheme();

describe('<SimpleFormIterator />', () => {
    // bypass confirm leave form with unsaved changes
    let confirmSpy;
    beforeAll(() => {
        confirmSpy = jest.spyOn(window, 'confirm');
        confirmSpy.mockImplementation(jest.fn(() => true));
    });
    afterAll(() => confirmSpy.mockRestore());

    afterEach(cleanup);

    it('should display an add item button at least', () => {
        const { getByText } = renderWithRedux(
            <SimpleForm>
                <ArrayInput source="emails">
                    <SimpleFormIterator>
                        <TextInput source="email" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        );

        expect(getByText('ra.action.add')).toBeDefined();
    });

    it('should not display add button if disableAdd is truthy', () => {
        const { queryAllByText } = renderWithRedux(
            <SimpleForm>
                <ArrayInput source="emails">
                    <SimpleFormIterator disableAdd>
                        <TextInput source="email" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        );

        expect(queryAllByText('ra.action.add').length).toBe(0);
    });

    it('should not display remove button if disableRemove is truthy', () => {
        const { queryAllByText } = renderWithRedux(
            <ThemeProvider theme={theme}>
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
            <SimpleForm>
                <ArrayInput source="emails">
                    <SimpleFormIterator>
                        <TextInput source="email" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        );

        const addItemElement = getByText('ra.action.add').closest('button');

        fireEvent.click(addItemElement);
        await wait(() => {
            const inputElements = queryAllByLabelText(
                'resources.undefined.fields.email'
            );

            expect(inputElements.length).toBe(1);
        });

        fireEvent.click(addItemElement);
        await wait(() => {
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
            <SimpleForm>
                <ArrayInput source="emails">
                    <SimpleFormIterator>
                        <TextInput source="email" label="CustomLabel" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        );

        const addItemElement = getByText('ra.action.add').closest('button');

        fireEvent.click(addItemElement);
        await wait(() => {
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
        );

        const addItemElement = getByText('ra.action.add').closest('button');

        fireEvent.click(addItemElement);
        await wait(() => {
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
                <SimpleForm record={{ id: 'whatever', emails }}>
                    <ArrayInput source="emails">
                        <SimpleFormIterator>
                            <TextInput source="email" />
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
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
        await wait(() => {
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
            <SimpleForm>
                <ArrayInput source="emails">
                    <SimpleFormIterator
                        addButton={<button>Custom Add Button</button>}
                    >
                        <TextInput source="email" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        );
        expect(queryAllByText('ra.action.add').length).toBe(0);
    });

    it('should not display the default remove button if a custom remove button is passed', () => {
        const { queryAllByText } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <SimpleForm
                    record={{ id: 'whatever', emails: [{ email: '' }] }}
                >
                    <ArrayInput source="emails">
                        <SimpleFormIterator
                            removeButton={<button>Custom Remove Button</button>}
                        >
                            <TextInput source="email" />
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            </ThemeProvider>
        );

        expect(queryAllByText('ra.action.remove').length).toBe(0);
    });

    it('should display the custom add button', () => {
        const { getByText } = renderWithRedux(
            <SimpleForm>
                <ArrayInput source="emails">
                    <SimpleFormIterator
                        addButton={<button>Custom Add Button</button>}
                    >
                        <TextInput source="email" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        );

        expect(getByText('Custom Add Button')).toBeDefined();
    });

    it('should display the custom remove button', () => {
        const { getByText } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <SimpleForm
                    record={{ id: 'whatever', emails: [{ email: '' }] }}
                >
                    <ArrayInput source="emails">
                        <SimpleFormIterator
                            removeButton={<button>Custom Remove Button</button>}
                        >
                            <TextInput source="email" />
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            </ThemeProvider>
        );

        expect(getByText('Custom Remove Button')).toBeDefined();
    });

    it('should call the onClick method when the custom add button is clicked', async () => {
        const onClick = jest.fn();
        const { getByText } = renderWithRedux(
            <ThemeProvider theme={theme}>
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
            </ThemeProvider>
        );
        fireEvent.click(getByText('Custom Add Button'));
        expect(onClick).toHaveBeenCalled();
    });

    it('should call the onClick method when the custom remove button is clicked', async () => {
        const onClick = jest.fn();
        const { getByText } = renderWithRedux(
            <ThemeProvider theme={theme}>
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
            </ThemeProvider>
        );
        fireEvent.click(getByText('Custom Remove Button'));
        expect(onClick).toHaveBeenCalled();
    });
});
