import * as React from 'react';
import {
    screen,
    render,
    fireEvent,
    getByText,
    waitFor,
} from '@testing-library/react';
import expect from 'expect';
import { testDataProvider } from 'ra-core';

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
            'resources.undefined.fields.email'
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
            'resources.undefined.fields.email'
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
            'resources.undefined.fields.email'
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

        expect(screen.getByText('ra.action.add')).not.toBeNull();
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

        expect(screen.queryAllByText('ra.action.add').length).toBe(0);
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

        expect(screen.queryAllByText('ra.action.add').length).toBe(0);
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

        expect(screen.queryAllByText('ra.action.remove').length).toBe(0);
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

        expect(screen.queryAllByText('ra.action.remove').length).toBe(0);
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
            .getByText('ra.action.add')
            .closest('button');

        fireEvent.click(addItemElement);
        await waitFor(() => {
            const inputElements = screen.queryAllByLabelText(
                'resources.undefined.fields.email'
            );

            expect(inputElements.length).toBe(1);
        });

        fireEvent.click(addItemElement);
        await waitFor(() => {
            const inputElements = screen.queryAllByLabelText(
                'resources.undefined.fields.email'
            );

            expect(inputElements.length).toBe(2);
        });

        const inputElements = screen.queryAllByLabelText(
            'resources.undefined.fields.email'
        ) as HTMLInputElement[];

        expect(
            inputElements.map(inputElement => ({
                email: inputElement.value,
            }))
        ).toEqual([{ email: '' }, { email: '' }]);

        expect(screen.queryAllByText('ra.action.remove').length).toBe(2);
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
            .getByText('ra.action.add')
            .closest('button');

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

        expect(screen.queryAllByText('ra.action.remove').length).toBe(1);
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
            .getByText('ra.action.add')
            .closest('button');

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

        expect(screen.queryAllByText('ra.action.remove').length).toBe(1);
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
            'resources.undefined.fields.email'
        ) as HTMLInputElement[];

        expect(
            inputElements.map(inputElement => ({
                email: inputElement.value,
            }))
        ).toEqual(emails);

        const removeFirstButton = getByText(
            inputElements[0].closest('li'),
            'ra.action.remove'
        ).closest('button');

        fireEvent.click(removeFirstButton);
        await waitFor(() => {
            const inputElements = screen.queryAllByLabelText(
                'resources.undefined.fields.email'
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
            'resources.undefined.fields.email'
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
                'resources.undefined.fields.email'
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
                'resources.undefined.fields.email'
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

        expect(screen.queryAllByText('ra.action.remove').length).toBe(0);
        expect(
            screen.queryAllByText('Custom Remove Button').length
        ).toBeGreaterThan(0);
    });

    it('should not display the default reorder element if a custom reorder element is passed', () => {
        const CustomReOrderButtons = props => (
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
});
