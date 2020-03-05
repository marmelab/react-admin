import { cleanup, fireEvent, wait, getByText } from '@testing-library/react';
import React from 'react';
import { renderWithRedux } from 'ra-core';

import SimpleFormIterator from './SimpleFormIterator';
import TextInput from '../input/TextInput';
import { ArrayInput } from '../input';
import SimpleForm from './SimpleForm';

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
            <SimpleForm record={{ emails: [{ email: '' }, { email: '' }] }}>
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
        const emails = [{ email: 'foo@bar.com' }, { email: 'bar@foo.com' }];

        const { queryAllByLabelText } = renderWithRedux(
            <SimpleForm record={{ emails }}>
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
                inputElements.map(inputElement => ({
                    email: inputElement.value,
                }))
            ).toEqual([{ email: 'bar@foo.com' }]);
        });
    });
});
