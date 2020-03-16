import {
    cleanup,
    fireEvent,
    wait,
    getByText,
    getNodeText,
} from '@testing-library/react';
import React from 'react';
import { renderWithRedux } from 'ra-core';

import SimpleFormIterator from './SimpleFormIterator';
import TextInput from '../input/TextInput';
import { ArrayInput } from '../input';
import SimpleForm from './SimpleForm';

const RECORD = {
    emails: [
        { email: 'foo@bar.com' },
        { email: 'bar@foo.com' },
        { email: 'com@foo.bar' },
    ],
};

describe('<SimpleFormIterator />', () => {
    afterEach(cleanup);

    it('should display an add item button at least', () => {
        const { getByText } = renderWithRedux(
            <SimpleForm>
                <ArrayInput source="emails">
                    <SimpleFormIterator translate={x => x}>
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
                    <SimpleFormIterator translate={x => x} disableAdd>
                        <TextInput source="email" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        );

        expect(queryAllByText('ra.action.add').length).toBe(0);
    });

    it('should not display remove button if disableRemove is truthy', () => {
        const { queryAllByText } = renderWithRedux(
            <SimpleForm record={RECORD}>
                <ArrayInput source="emails">
                    <SimpleFormIterator translate={x => x} disableRemove>
                        <TextInput source="email" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
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
                    <SimpleFormIterator translate={x => x}>
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
            inputElements.map(inputElement => ({ email: inputElement.value }))
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
                    <SimpleFormIterator translate={x => x}>
                        <TextInput label="CustomLabel" />
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

        expect(inputElements.map(inputElement => inputElement.value)).toEqual([
            '',
        ]);

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
                    <SimpleFormIterator translate={x => x}>
                        <TextInput label="CustomLabel" defaultValue={5} />
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

        expect(inputElements.map(inputElement => inputElement.value)).toEqual([
            '5',
        ]);

        expect(queryAllByText('ra.action.remove').length).toBe(1);
    });

    it('should remove children row on remove button click', async () => {
        const { queryAllByLabelText } = renderWithRedux(
            <SimpleForm record={RECORD}>
                <ArrayInput source="emails">
                    <SimpleFormIterator translate={x => x}>
                        <TextInput source="email" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        );

        const inputElements = queryAllByLabelText(
            'resources.undefined.fields.email'
        );

        expect(
            inputElements.map(inputElement => ({ email: inputElement.value }))
        ).toEqual(RECORD.emails);

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
                inputElements.map(inputElement => ({
                    email: inputElement.value,
                }))
            ).toEqual([{ email: 'bar@foo.com' }, { email: 'com@foo.bar' }]);
        });
    });

    describe('index display component', () => {
        function render(RowIndex) {
            return renderWithRedux(
                <SimpleForm record={RECORD}>
                    <ArrayInput source="emails">
                        <SimpleFormIterator
                            translate={x => x}
                            RowIndexComponent={RowIndex}
                        >
                            <TextInput source="email" />
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            );
        }

        describe('default component', () => {
            it('should start indexing from 1', () => {
                const { queryAllByTestId } = render();

                const rowIndex = queryAllByTestId('default-row-index');

                expect(getNodeText(rowIndex[0])).toBe('1');
            });

            it('should end indexing with length of items', () => {
                const { queryAllByTestId } = render();

                const rowIndex = queryAllByTestId('default-row-index');

                expect(getNodeText(rowIndex[RECORD.emails.length - 1])).toBe(
                    RECORD.emails.length.toString()
                );
            });
        });

        describe('custom component', () => {
            const CustomIndex = ({ index }) => (
                <div data-testid="custom-index">{index}</div>
            );

            it('should allow to hide the row index component by passing null', () => {
                const { queryAllByTestId } = render(null);

                const defaultRowIndex = queryAllByTestId('default-row-index');

                expect(defaultRowIndex).toHaveLength(0);
            });

            it('should render custom component', () => {
                const { queryAllByTestId } = render(CustomIndex);

                const defaultRowIndex = queryAllByTestId('default-row-index');

                expect(defaultRowIndex).toHaveLength(0);

                const customRowIndex = queryAllByTestId('custom-index');

                expect(customRowIndex).toHaveLength(RECORD.emails.length);
            });

            it('should start index from 0', () => {
                const { queryAllByTestId } = render(CustomIndex);

                const customRowIndex = queryAllByTestId('custom-index');

                expect(getNodeText(customRowIndex[0])).toBe('0');
            });

            it('should end index with length - 1 of items', () => {
                const { queryAllByTestId } = render(CustomIndex);

                const customRowIndex = queryAllByTestId('custom-index');

                expect(
                    getNodeText(customRowIndex[RECORD.emails.length - 1])
                ).toBe((RECORD.emails.length - 1).toString());
            });
        });
    });
});
