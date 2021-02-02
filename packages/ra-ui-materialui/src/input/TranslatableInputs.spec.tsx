import * as React from 'react';
import expect from 'expect';
import { fireEvent } from '@testing-library/react';
import { TranslatableInputs } from './TranslatableInputs';
import TextInput from './TextInput';
import { FormWithRedirect, required, useTranslatableContext } from 'ra-core';
import { renderWithRedux } from 'ra-test';
import { TranslatableInputsTab } from './TranslatableInputsTab';
import { Tabs } from '@material-ui/core';

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
    it('should display every input for every locale', () => {
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
                    <TranslatableInputs locales={['en', 'fr']}>
                        <TextInput source="name" />
                        <TextInput source="description" />
                        <TextInput source="nested.field" />
                    </TranslatableInputs>
                )}
            />
        );

        expect(
            getByLabelText('ra.locales.en').getAttribute('hidden')
        ).toBeNull();
        expect(
            getByLabelText('ra.locales.fr').getAttribute('hidden')
        ).not.toBeNull();

        expect(queryByDisplayValue('english name')).not.toBeNull();
        expect(queryByDisplayValue('english description')).not.toBeNull();
        expect(queryByDisplayValue('english nested field')).not.toBeNull();

        expect(queryByDisplayValue('french name')).not.toBeNull();
        expect(queryByDisplayValue('french description')).not.toBeNull();
        expect(queryByDisplayValue('french nested field')).not.toBeNull();

        fireEvent.click(getByText('ra.locales.fr'));
        expect(
            getByLabelText('ra.locales.en').getAttribute('hidden')
        ).not.toBeNull();
        expect(
            getByLabelText('ra.locales.fr').getAttribute('hidden')
        ).toBeNull();
    });

    it('should display validation errors and highlight the tab which has invalid inputs', () => {
        const save = jest.fn();

        const Selector = () => {
            const {
                locales,
                selectLocale,
                selectedLocale,
            } = useTranslatableContext();

            const handleChange = (event, newLocale): void => {
                selectLocale(newLocale);
            };

            return (
                <Tabs value={selectedLocale} onChange={handleChange}>
                    {locales.map(locale => (
                        <TranslatableInputsTab
                            key={locale}
                            value={locale}
                            locale={locale}
                            classes={{ error: 'error' }}
                        />
                    ))}
                </Tabs>
            );
        };

        const {
            queryByText,
            getByLabelText,
            getAllByLabelText,
            getByText,
            getAllByRole,
        } = renderWithRedux(
            <FormWithRedirect
                save={save}
                render={() => (
                    <TranslatableInputs
                        locales={['en', 'fr']}
                        selector={<Selector />}
                    >
                        <TextInput source="name" validate={required()} />
                    </TranslatableInputs>
                )}
            />
        );

        expect(
            getByLabelText('ra.locales.en').getAttribute('hidden')
        ).toBeNull();
        expect(
            getByLabelText('ra.locales.fr').getAttribute('hidden')
        ).not.toBeNull();

        fireEvent.change(
            getAllByLabelText('resources.undefined.fields.name *')[0],
            {
                target: { value: 'english value' },
            }
        );
        fireEvent.click(getByText('ra.locales.fr'));
        fireEvent.focus(
            getAllByLabelText('resources.undefined.fields.name *')[1]
        );
        fireEvent.blur(
            getAllByLabelText('resources.undefined.fields.name *')[1]
        );
        expect(queryByText('ra.validation.required')).not.toBeNull();
        fireEvent.click(getByText('ra.locales.en'));
        const tabs = getAllByRole('tab');
        expect(tabs[1].getAttribute('id')).toEqual('translatable-header-fr');
        expect(tabs[1].classList.contains('error')).toEqual(true);
    });

    it('should allow to update any input for any locale', () => {
        const save = jest.fn();
        const { queryByDisplayValue, getByText } = renderWithRedux(
            <FormWithRedirect
                record={record}
                save={save}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <TranslatableInputs locales={['en', 'fr']}>
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
        fireEvent.click(getByText('ra.locales.fr'));
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

    it('should allow to customize the locale selector', () => {
        const Selector = () => {
            const {
                locales,
                selectLocale,
                selectedLocale,
            } = useTranslatableContext();

            const handleChange = (event): void => {
                selectLocale(event.target.value);
            };

            return (
                <select
                    aria-label="select locale"
                    onChange={handleChange}
                    value={selectedLocale}
                >
                    {locales.map(locale => (
                        <option
                            key={locale}
                            value={locale}
                            id={`translatable-header-${locale}`}
                        >
                            {locale}
                        </option>
                    ))}
                </select>
            );
        };

        const { getByLabelText, queryByDisplayValue } = renderWithRedux(
            <FormWithRedirect
                record={record}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <TranslatableInputs
                            locales={['en', 'fr']}
                            selector={<Selector />}
                        >
                            <TextInput source="name" />
                            <TextInput source="description" />
                            <TextInput source="nested.field" />
                        </TranslatableInputs>
                        <button type="submit">save</button>
                    </form>
                )}
            />
        );

        expect(getByLabelText('en').getAttribute('hidden')).toBeNull();
        expect(getByLabelText('fr').getAttribute('hidden')).not.toBeNull();

        expect(queryByDisplayValue('english name')).not.toBeNull();
        expect(queryByDisplayValue('english description')).not.toBeNull();
        expect(queryByDisplayValue('english nested field')).not.toBeNull();

        expect(queryByDisplayValue('french name')).not.toBeNull();
        expect(queryByDisplayValue('french description')).not.toBeNull();
        expect(queryByDisplayValue('french nested field')).not.toBeNull();

        fireEvent.change(getByLabelText('select locale'), {
            target: { value: 'fr' },
        });
        expect(getByLabelText('en').getAttribute('hidden')).not.toBeNull();
        expect(getByLabelText('fr').getAttribute('hidden')).toBeNull();
    });
});
