import * as React from 'react';
import {
    screen,
    render,
    fireEvent,
    waitFor,
    getByLabelText,
} from '@testing-library/react';
import expect from 'expect';
import { FormDataConsumer, testDataProvider } from 'ra-core';

import { AdminContext } from '../../AdminContext';
import { SimpleForm } from '../../form';
import { ArrayInput } from './ArrayInput';
import { TextInput } from '../TextInput';
import { SimpleFormIterator } from './SimpleFormIterator';

describe('<SimpleFormIterator />', () => {
    // bypass confirm leave form with unsaved changes
    let confirmSpy;
    beforeAll(() => {
        confirmSpy = jest.spyOn(window, 'confirm');
        confirmSpy.mockImplementation(jest.fn(() => true));
    });
    afterAll(() => confirmSpy.mockRestore());

    const Wrapper = ({ children }) => (
        <AdminContext dataProvider={testDataProvider()}>
            {children}
        </AdminContext>
    );

    it('should display one input group per row', () => {
        render(
            <Wrapper>
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
            </Wrapper>
        );
        const inputElements = screen.queryAllByLabelText(
            'resources.undefined.fields.emails.email'
        );
        expect(inputElements).toHaveLength(2);
        expect((inputElements[0] as HTMLInputElement).disabled).toBeFalsy();
        expect((inputElements[0] as HTMLInputElement).value).toBe('foo');
        expect((inputElements[1] as HTMLInputElement).disabled).toBeFalsy();
        expect((inputElements[1] as HTMLInputElement).value).toBe('bar');
    });

    it('should render disabled inputs when disabled is true', () => {
        render(
            <Wrapper>
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
            </Wrapper>
        );
        const inputElements = screen.queryAllByLabelText(
            'resources.undefined.fields.emails.email'
        );
        expect(inputElements).toHaveLength(2);
        expect((inputElements[0] as HTMLInputElement).disabled).toBeTruthy();
        expect((inputElements[0] as HTMLInputElement).value).toBe('foo');
        expect((inputElements[1] as HTMLInputElement).disabled).toBeTruthy();
        expect((inputElements[1] as HTMLInputElement).value).toBe('bar');
    });

    it('should allow to override the disabled prop of each inputs', () => {
        render(
            <Wrapper>
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
            </Wrapper>
        );
        const inputElements = screen.queryAllByLabelText(
            'resources.undefined.fields.emails.email'
        );
        expect(inputElements).toHaveLength(2);
        expect((inputElements[0] as HTMLInputElement).disabled).toBeTruthy();
        expect((inputElements[0] as HTMLInputElement).value).toBe('foo');
        expect((inputElements[1] as HTMLInputElement).disabled).toBeTruthy();
        expect((inputElements[1] as HTMLInputElement).value).toBe('bar');
    });

    it('should display an add item button at least', () => {
        render(
            <Wrapper>
                <SimpleForm>
                    <ArrayInput source="emails">
                        <SimpleFormIterator>
                            <TextInput source="email" />
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            </Wrapper>
        );

        expect(screen.getByLabelText('ra.action.add')).not.toBeNull();
    });

    it('should not display add button if disableAdd is truthy', () => {
        render(
            <Wrapper>
                <SimpleForm>
                    <ArrayInput source="emails">
                        <SimpleFormIterator disableAdd>
                            <TextInput source="email" />
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            </Wrapper>
        );

        expect(screen.queryAllByLabelText('ra.action.add').length).toBe(0);
    });

    it('should not display add button if disabled is truthy', () => {
        render(
            <Wrapper>
                <SimpleForm>
                    <ArrayInput source="emails" disabled>
                        <SimpleFormIterator>
                            <TextInput source="email" />
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            </Wrapper>
        );

        expect(screen.queryAllByLabelText('ra.action.add').length).toBe(0);
    });

    it('should not display remove button if disableRemove is truthy', () => {
        render(
            <Wrapper>
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
            </Wrapper>
        );

        expect(screen.queryAllByLabelText('ra.action.remove').length).toBe(0);
    });

    it('should not display remove button if disableRemove return value is truthy', () => {
        render(
            <Wrapper>
                <SimpleForm
                    record={{
                        id: 'whatever',
                        emails: [{ email: 'badEmail' }, { email: '' }],
                    }}
                >
                    <ArrayInput source="emails">
                        <SimpleFormIterator
                            disableRemove={record => {
                                return record.email === 'badEmail';
                            }}
                        >
                            <TextInput source="email" />
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            </Wrapper>
        );

        expect(screen.queryAllByLabelText('ra.action.remove').length).toBe(1);
    });

    it('should not display remove button if disabled is truthy', () => {
        render(
            <Wrapper>
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
            </Wrapper>
        );

        expect(screen.queryAllByLabelText('ra.action.remove').length).toBe(0);
    });

    it('should remove all children row on clear action button click', async () => {
        render(
            <Wrapper>
                <SimpleForm
                    record={{
                        id: 'whatever',
                        emails: [{ email: '' }, { email: '' }],
                    }}
                >
                    <ArrayInput source="emails">
                        <SimpleFormIterator>
                            <TextInput source="email" />
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            </Wrapper>
        );
        const clearActionElements = screen
            .getByLabelText('ra.action.clear_array_input')
            .closest('button') as HTMLButtonElement;

        fireEvent.click(clearActionElements);
        fireEvent.click(screen.getByText('ra.action.confirm'));
        await waitFor(() => {
            const inputElements = screen.queryAllByLabelText(
                'resources.undefined.fields.emails.email'
            );
            expect(inputElements.length).toBe(0);
        });
    });

    it('should add children row on add button click', async () => {
        render(
            <Wrapper>
                <SimpleForm>
                    <ArrayInput source="emails">
                        <SimpleFormIterator>
                            <TextInput source="email" />
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            </Wrapper>
        );

        const addItemElement = screen
            .getByLabelText('ra.action.add')
            .closest('button') as HTMLButtonElement;

        fireEvent.click(addItemElement);
        await waitFor(() => {
            const inputElements = screen.queryAllByLabelText(
                'resources.undefined.fields.emails.email'
            );

            expect(inputElements.length).toBe(1);
        });

        fireEvent.click(addItemElement);
        await waitFor(() => {
            const inputElements = screen.queryAllByLabelText(
                'resources.undefined.fields.emails.email'
            );

            expect(inputElements.length).toBe(2);
        });

        const inputElements = screen.queryAllByLabelText(
            'resources.undefined.fields.emails.email'
        ) as HTMLInputElement[];

        expect(
            inputElements.map(inputElement => ({
                email: inputElement.value,
            }))
        ).toEqual([{ email: '' }, { email: '' }]);

        expect(screen.queryAllByLabelText('ra.action.remove').length).toBe(2);
    });

    it('should add correct children on add button click without source', async () => {
        render(
            <Wrapper>
                <SimpleForm>
                    <ArrayInput source="emails">
                        <SimpleFormIterator>
                            <TextInput source="email" label="CustomLabel" />
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            </Wrapper>
        );

        const addItemElement = screen
            .getByLabelText('ra.action.add')
            .closest('button') as HTMLButtonElement;

        fireEvent.click(addItemElement);
        await waitFor(() => {
            const inputElements = screen.queryAllByLabelText('CustomLabel');

            expect(inputElements.length).toBe(1);
        });

        const inputElements = screen.queryAllByLabelText(
            'CustomLabel'
        ) as HTMLInputElement[];

        expect(inputElements.map(inputElement => inputElement.value)).toEqual([
            '',
        ]);

        expect(screen.queryAllByLabelText('ra.action.remove').length).toBe(1);
    });

    it('should add correct children with default value on add button click without source', async () => {
        render(
            <Wrapper>
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
            </Wrapper>
        );

        const addItemElement = screen
            .getByLabelText('ra.action.add')
            .closest('button') as HTMLButtonElement;

        fireEvent.click(addItemElement);
        await waitFor(() => {
            const inputElements = screen.queryAllByLabelText('CustomLabel');

            expect(inputElements.length).toBe(1);
        });

        const inputElements = screen.queryAllByLabelText(
            'CustomLabel'
        ) as HTMLInputElement[];

        expect(inputElements.map(inputElement => inputElement.value)).toEqual([
            '5',
        ]);

        expect(screen.queryAllByLabelText('ra.action.remove').length).toBe(1);
    });

    it('should add correct children with default value after removing one', async () => {
        render(
            <Wrapper>
                <SimpleForm>
                    <ArrayInput
                        source="emails"
                        defaultValue={[
                            { email: 'test@marmelab.com', name: 'test' },
                        ]}
                    >
                        <SimpleFormIterator>
                            <TextInput
                                source="email"
                                label="Email"
                                defaultValue="default@marmelab.com"
                            />
                            <TextInput source="name" label="Name" />
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            </Wrapper>
        );

        const removeFirstButton = getByLabelText(
            // @ts-ignore
            screen.queryAllByLabelText('Email')[0].closest('li'),
            'ra.action.remove'
        ).closest('button') as HTMLButtonElement;

        fireEvent.click(removeFirstButton);
        await waitFor(() => {
            expect(screen.queryAllByLabelText('Email').length).toEqual(0);
        });

        const addItemElement = screen
            .getByLabelText('ra.action.add')
            .closest('button') as HTMLButtonElement;

        fireEvent.click(addItemElement);
        await waitFor(() => {
            const inputElements = screen.queryAllByLabelText('Email');
            expect(inputElements.length).toBe(1);
        });

        expect(
            screen
                .queryAllByLabelText('Email')
                .map(inputElement => (inputElement as HTMLInputElement).value)
        ).toEqual(['default@marmelab.com']);
        expect(
            screen
                .queryAllByLabelText('Name')
                .map(inputElement => (inputElement as HTMLInputElement).value)
        ).toEqual(['']);

        expect(screen.queryAllByLabelText('ra.action.remove').length).toBe(1);
    });

    it('should not reapply default values set at form level after removing and then re-adding one row', async () => {
        render(
            <Wrapper>
                <SimpleForm
                    defaultValues={{
                        emails: [{ email: 'test@marmelab.com', name: 'test' }],
                    }}
                >
                    <ArrayInput source="emails">
                        <SimpleFormIterator>
                            <TextInput source="email" label="Email" />
                            <TextInput source="name" label="Name" />
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            </Wrapper>
        );

        const removeFirstButton = getByLabelText(
            // @ts-ignore
            screen.queryAllByLabelText('Email')[0].closest('li'),
            'ra.action.remove'
        ).closest('button') as HTMLButtonElement;

        fireEvent.click(removeFirstButton);
        await waitFor(() => {
            expect(screen.queryAllByLabelText('Email').length).toEqual(0);
        });

        const addItemElement = screen
            .getByLabelText('ra.action.add')
            .closest('button') as HTMLButtonElement;

        fireEvent.click(addItemElement);
        await waitFor(() => {
            const inputElements = screen.queryAllByLabelText('Email');
            expect(inputElements.length).toBe(1);
        });

        expect(
            screen
                .queryAllByLabelText('Email')
                .map(inputElement => (inputElement as HTMLInputElement).value)
        ).toEqual(['']);
        expect(
            screen
                .queryAllByLabelText('Name')
                .map(inputElement => (inputElement as HTMLInputElement).value)
        ).toEqual(['']);

        expect(screen.queryAllByLabelText('ra.action.remove').length).toBe(1);
    });

    it('should not reapply default values set at form level after removing and then re-adding one row, even with FormDataConsumer', async () => {
        render(
            <Wrapper>
                <SimpleForm
                    defaultValues={{
                        emails: [{ email: 'test@marmelab.com', name: 'test' }],
                    }}
                >
                    <ArrayInput source="emails">
                        <SimpleFormIterator>
                            <FormDataConsumer>
                                {({ getSource }) => (
                                    <>
                                        <TextInput
                                            source={getSource!('email')}
                                            label="Email"
                                            defaultValue="default@marmelab.com"
                                        />
                                        <TextInput
                                            source={getSource!('name')}
                                            label="Name"
                                        />
                                    </>
                                )}
                            </FormDataConsumer>
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            </Wrapper>
        );

        const removeFirstButton = getByLabelText(
            // @ts-ignore
            screen.queryAllByLabelText('Email')[0].closest('li'),
            'ra.action.remove'
        ).closest('button') as HTMLButtonElement;

        fireEvent.click(removeFirstButton);
        await waitFor(() => {
            expect(screen.queryAllByLabelText('Email').length).toEqual(0);
        });

        const addItemElement = screen
            .getByLabelText('ra.action.add')
            .closest('button') as HTMLButtonElement;

        fireEvent.click(addItemElement);
        await waitFor(() => {
            const inputElements = screen.queryAllByLabelText('Email');
            expect(inputElements.length).toBe(1);
        });

        expect(
            screen
                .queryAllByLabelText('Email')
                .map(inputElement => (inputElement as HTMLInputElement).value)
        ).toEqual(['']);
        expect(
            screen
                .queryAllByLabelText('Name')
                .map(inputElement => (inputElement as HTMLInputElement).value)
        ).toEqual(['']);

        expect(screen.queryAllByLabelText('ra.action.remove').length).toBe(1);
    });

    it('should remove children row on remove button click', async () => {
        const emails = [{ email: 'foo@bar.com' }, { email: 'bar@foo.com' }];

        render(
            <Wrapper>
                <SimpleForm record={{ id: 'whatever', emails }}>
                    <ArrayInput source="emails">
                        <SimpleFormIterator>
                            <TextInput source="email" />
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            </Wrapper>
        );

        const inputElements = screen.queryAllByLabelText(
            'resources.undefined.fields.emails.email'
        ) as HTMLInputElement[];

        expect(
            inputElements.map(inputElement => ({
                email: inputElement.value,
            }))
        ).toEqual(emails);

        const removeFirstButton = getByLabelText(
            // @ts-ignore
            inputElements[0].closest('li'),
            'ra.action.remove'
        ).closest('button') as HTMLButtonElement;

        fireEvent.click(removeFirstButton);
        await waitFor(() => {
            const inputElements = screen.queryAllByLabelText(
                'resources.undefined.fields.emails.email'
            ) as HTMLInputElement[];

            expect(
                inputElements.map(inputElement => ({
                    email: inputElement.value,
                }))
            ).toEqual([{ email: 'bar@foo.com' }]);
        });
    });

    it('should reorder children on reorder buttons click', async () => {
        const emails = [{ email: 'foo@bar.com' }, { email: 'bar@foo.com' }];

        render(
            <Wrapper>
                <SimpleForm record={{ id: 'whatever', emails }}>
                    <ArrayInput source="emails">
                        <SimpleFormIterator>
                            <TextInput source="email" />
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            </Wrapper>
        );

        const inputElements = screen.queryAllByLabelText(
            'resources.undefined.fields.emails.email'
        ) as HTMLInputElement[];

        expect(
            inputElements.map(inputElement => ({
                email: inputElement.value,
            }))
        ).toEqual(emails);

        const moveDownFirstButton = screen.queryAllByLabelText(
            'ra.action.move_down'
        );

        fireEvent.click(moveDownFirstButton[0]);
        await waitFor(() => {
            const inputElements = screen.queryAllByLabelText(
                'resources.undefined.fields.emails.email'
            ) as HTMLInputElement[];

            expect(
                inputElements.map(inputElement => ({
                    email: inputElement.value,
                }))
            ).toEqual([{ email: 'bar@foo.com' }, { email: 'foo@bar.com' }]);
        });

        const moveUpButton = screen.queryAllByLabelText('ra.action.move_up');

        fireEvent.click(moveUpButton[1]);
        await waitFor(() => {
            const inputElements = screen.queryAllByLabelText(
                'resources.undefined.fields.emails.email'
            ) as HTMLInputElement[];

            expect(
                inputElements.map(inputElement => ({
                    email: inputElement.value,
                }))
            ).toEqual([{ email: 'foo@bar.com' }, { email: 'bar@foo.com' }]);
        });
    });

    it('should not display the default add button if a custom add button is passed', () => {
        render(
            <Wrapper>
                <SimpleForm>
                    <ArrayInput source="emails">
                        <SimpleFormIterator
                            addButton={<button>Custom Add Button</button>}
                        >
                            <TextInput source="email" />
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            </Wrapper>
        );

        expect(screen.queryAllByText('ra.action.add').length).toBe(0);
        expect(screen.getByText('Custom Add Button')).not.toBeNull();
    });

    it('should not display the default remove button if a custom remove button is passed', () => {
        render(
            <Wrapper>
                <SimpleForm
                    record={{
                        id: 'whatever',
                        emails: [{ email: '' }],
                    }}
                >
                    <ArrayInput source="emails">
                        <SimpleFormIterator
                            removeButton={<button>Custom Remove Button</button>}
                        >
                            <TextInput source="email" />
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            </Wrapper>
        );

        expect(screen.queryAllByLabelText('ra.action.remove').length).toBe(0);
        expect(
            screen.queryAllByText('Custom Remove Button').length
        ).toBeGreaterThan(0);
    });

    it('should not display the default reorder element if a custom reorder element is passed', () => {
        const CustomReOrderButtons = () => (
            <button>Custom reorder Button</button>
        );

        render(
            <Wrapper>
                <SimpleForm
                    record={{
                        id: 'whatever',
                        emails: [{ email: '' }],
                    }}
                >
                    <ArrayInput source="emails">
                        <SimpleFormIterator
                            reOrderButtons={<CustomReOrderButtons />}
                        >
                            <TextInput source="email" />
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            </Wrapper>
        );

        expect(screen.queryAllByLabelText('ra.action.move_up').length).toBe(0);
        expect(screen.queryAllByLabelText('ra.action.move_down').length).toBe(
            0
        );
        expect(
            screen.queryAllByText('Custom reorder Button').length
        ).toBeGreaterThan(0);
    });

    it('should display custom row label', () => {
        render(
            <Wrapper>
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
            </Wrapper>
        );

        expect(screen.queryAllByText('3.0').length).toBeGreaterThan(0);
        expect(screen.queryAllByText('3.1').length).toBeGreaterThan(0);
    });

    it('should call the onClick method when the custom add button is clicked', async () => {
        const onClick = jest.fn().mockImplementation(e => e.preventDefault());
        render(
            <Wrapper>
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
            </Wrapper>
        );
        fireEvent.click(screen.getByText('Custom Add Button'));
        expect(onClick).toHaveBeenCalled();
    });

    it('should call the onClick method when the custom remove button is clicked', async () => {
        const onClick = jest.fn().mockImplementation(e => e.preventDefault());
        render(
            <Wrapper>
                <SimpleForm
                    record={{
                        id: 'whatever',
                        emails: [{ email: '' }],
                    }}
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
            </Wrapper>
        );
        fireEvent.click(screen.getAllByText('Custom Remove Button')[0]);
        expect(onClick).toHaveBeenCalled();
    });

    it('should display the custom add button', () => {
        render(
            <Wrapper>
                <SimpleForm>
                    <ArrayInput source="emails">
                        <SimpleFormIterator
                            addButton={<button>Custom Add Button</button>}
                        >
                            <TextInput source="email" />
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            </Wrapper>
        );

        expect(screen.getByText('Custom Add Button')).not.toBeNull();
    });

    it('should display the custom remove button', () => {
        render(
            <Wrapper>
                <SimpleForm
                    record={{
                        id: 'whatever',
                        emails: [{ email: '' }],
                    }}
                >
                    <ArrayInput source="emails">
                        <SimpleFormIterator
                            removeButton={<button>Custom Remove Button</button>}
                        >
                            <TextInput source="email" />
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            </Wrapper>
        );

        expect(
            screen.queryAllByText('Custom Remove Button').length
        ).toBeGreaterThan(0);
    });

    it('should not add an empty property when using FormDataConsumer as child', async () => {
        const save = jest.fn();
        render(
            <AdminContext>
                <SimpleForm onSubmit={save}>
                    <ArrayInput source="emails">
                        <SimpleFormIterator>
                            <TextInput source="email" />
                            <FormDataConsumer>
                                {({ scopedFormData, getSource }) =>
                                    scopedFormData && scopedFormData.name ? (
                                        <TextInput
                                            source={(getSource as (
                                                arg: string
                                            ) => string)('role')}
                                        />
                                    ) : null
                                }
                            </FormDataConsumer>
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            </AdminContext>
        );

        const addItemElement = screen
            .getByLabelText('ra.action.add')
            .closest('button') as HTMLButtonElement;

        fireEvent.click(addItemElement);
        fireEvent.click(screen.getByText('ra.action.save'));
        await waitFor(() => {
            expect(save).toHaveBeenCalledWith(
                {
                    emails: [{ email: null }],
                },
                expect.anything()
            );
        });
    });

    it('should empty children values after removing only child and add it back again', async () => {
        const save = jest.fn();
        render(
            <Wrapper>
                <SimpleForm
                    onSubmit={save}
                    record={{
                        id: 1,
                        emails: [{ email: 'test@marmelab.com', role: 'User' }],
                    }}
                >
                    <ArrayInput source="emails">
                        <SimpleFormIterator>
                            <TextInput source="email" label="Email" />
                            <FormDataConsumer>
                                {({ getSource }) => (
                                    <TextInput
                                        label="Role"
                                        source={(getSource as (
                                            arg: string
                                        ) => string)('role')}
                                    />
                                )}
                            </FormDataConsumer>
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            </Wrapper>
        );

        await waitFor(() => {
            expect(
                screen
                    .queryAllByLabelText('Email')
                    .map(
                        inputElement => (inputElement as HTMLInputElement).value
                    )
            ).toEqual(['test@marmelab.com']);
            expect(
                screen
                    .queryAllByLabelText('Role')
                    .map(
                        inputElement => (inputElement as HTMLInputElement).value
                    )
            ).toEqual(['User']);
        });

        const removeFirstButton = getByLabelText(
            // @ts-ignore
            screen.queryAllByLabelText('Email')[0].closest('li'),
            'ra.action.remove'
        ).closest('button') as HTMLButtonElement;

        fireEvent.click(removeFirstButton);
        await waitFor(() => {
            expect(screen.queryAllByLabelText('Email').length).toEqual(0);
            expect(screen.queryAllByLabelText('Role').length).toEqual(0);
        });

        const addItemElement = screen
            .getByLabelText('ra.action.add')
            .closest('button') as HTMLButtonElement;

        fireEvent.click(addItemElement);
        await waitFor(() => {
            const inputElements = screen.queryAllByLabelText('Email');
            expect(inputElements.length).toBe(1);
            const inputRole = screen.queryAllByLabelText('Role');
            expect(inputRole.length).toBe(1);
        });

        fireEvent.click(screen.getByText('ra.action.save'));
        await waitFor(() => {
            expect(save).toHaveBeenCalledWith(
                {
                    id: 1,
                    emails: [{ email: null, role: null }],
                },
                expect.anything()
            );
        });
    });
});
