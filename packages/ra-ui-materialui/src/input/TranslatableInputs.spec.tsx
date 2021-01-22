import * as React from 'react';
import expect from 'expect';
import { fireEvent } from '@testing-library/react';
import { TranslatableInputs } from './TranslatableInputs';
import TextInput from './TextInput';
import { FormWithRedirect, renderWithRedux } from 'ra-core';

const record = {
    id: 123,
    name: {
        en: 'english name',
        fr: 'french name',
    },
    description: {
        en: 'english description',
        fr: 'french description',
    },
    nested: {
        field: {
            en: 'english nested field',
            fr: 'french nested field',
        },
    },
};

describe('<TranslatableInputs />', () => {
    it('should display every inputs for every languages', () => {
        const save = jest.fn();
        const {
            queryByDisplayValue,
            getByLabelText,
            getByText,
        } = renderWithRedux(
            <FormWithRedirect
                record={record}
                save={save}
                render={() => (
                    <TranslatableInputs languages={['en', 'fr']}>
                        <TextInput source="name" />
                        <TextInput source="description" />
                        <TextInput source="nested.field" />
                    </TranslatableInputs>
                )}
            />
        );

        expect(
            getByLabelText('ra.languages.en').getAttribute('hidden')
        ).toBeNull();
        expect(
            getByLabelText('ra.languages.fr').getAttribute('hidden')
        ).toBeDefined();

        expect(queryByDisplayValue('english name')).not.toBeNull();
        expect(queryByDisplayValue('english description')).not.toBeNull();
        expect(queryByDisplayValue('english nested field')).not.toBeNull();

        expect(queryByDisplayValue('french name')).not.toBeNull();
        expect(queryByDisplayValue('french description')).not.toBeNull();
        expect(queryByDisplayValue('french nested field')).not.toBeNull();

        fireEvent.click(getByText('ra.languages.fr'));
        expect(
            getByLabelText('ra.languages.en').getAttribute('hidden')
        ).toBeDefined();
        expect(
            getByLabelText('ra.languages.fr').getAttribute('hidden')
        ).toBeNull();
    });

    it('should allow to update any input for any language', () => {
        const save = jest.fn();
        const { queryByDisplayValue, getByText } = renderWithRedux(
            <FormWithRedirect
                record={record}
                save={save}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <TranslatableInputs languages={['en', 'fr']}>
                            <TextInput source="name" />
                            <TextInput source="description" />
                            <TextInput source="nested.field" />
                        </TranslatableInputs>
                        <button type="submit">save</button>
                    </form>
                )}
            />
        );

        fireEvent.change(queryByDisplayValue('english name'), {
            target: { value: 'english name updated' },
        });
        fireEvent.click(getByText('ra.languages.fr'));
        fireEvent.change(queryByDisplayValue('french nested field'), {
            target: { value: 'french nested field updated' },
        });
        fireEvent.click(getByText('save'));

        expect(save).toHaveBeenCalledWith(
            {
                id: 123,
                name: {
                    en: 'english name updated',
                    fr: 'french name',
                },
                description: {
                    en: 'english description',
                    fr: 'french description',
                },
                nested: {
                    field: {
                        en: 'english nested field',
                        fr: 'french nested field updated',
                    },
                },
            },
            undefined
        );
    });
});
