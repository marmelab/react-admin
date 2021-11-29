import * as React from 'react';
import expect from 'expect';
import { fireEvent, screen } from '@testing-library/react';
import { TranslatableInputs } from './TranslatableInputs';
import { TextInput } from './TextInput';
import { FormWithRedirect, required, useTranslatableContext } from 'ra-core';
import { renderWithRedux } from 'ra-test';
import { TranslatableInputsTab } from './TranslatableInputsTab';
import { Tabs } from '@mui/material';

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
        renderWithRedux(
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
            screen.getByLabelText('ra.locales.en').getAttribute('hidden')
        ).toBeNull();
        expect(
            screen.getByLabelText('ra.locales.fr').getAttribute('hidden')
        ).not.toBeNull();

        expect(screen.queryByDisplayValue('english name')).not.toBeNull();
        expect(
            screen.queryByDisplayValue('english description')
        ).not.toBeNull();
        expect(
            screen.queryByDisplayValue('english nested field')
        ).not.toBeNull();

        expect(screen.queryByDisplayValue('french name')).not.toBeNull();
        expect(screen.queryByDisplayValue('french description')).not.toBeNull();
        expect(
            screen.queryByDisplayValue('french nested field')
        ).not.toBeNull();

        fireEvent.click(screen.getByText('ra.locales.fr'));
        expect(
            screen.getByLabelText('ra.locales.en').getAttribute('hidden')
        ).not.toBeNull();
        expect(
            screen.getByLabelText('ra.locales.fr').getAttribute('hidden')
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
                        />
                    ))}
                </Tabs>
            );
        };

        renderWithRedux(
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
            screen.getByLabelText('ra.locales.en').getAttribute('hidden')
        ).toBeNull();
        expect(
            screen.getByLabelText('ra.locales.fr').getAttribute('hidden')
        ).not.toBeNull();

        fireEvent.change(
            screen.getAllByLabelText('resources.undefined.fields.name *')[0],
            {
                target: { value: 'english value' },
            }
        );
        fireEvent.click(screen.getByText('ra.locales.fr'));
        fireEvent.focus(
            screen.getAllByLabelText('resources.undefined.fields.name *')[1]
        );
        fireEvent.blur(
            screen.getAllByLabelText('resources.undefined.fields.name *')[1]
        );
        expect(screen.queryByText('ra.validation.required')).not.toBeNull();
        fireEvent.click(screen.getByText('ra.locales.en'));
        const tabs = screen.getAllByRole('tab');
        expect(tabs[1].getAttribute('id')).toEqual('translatable-header-fr');
        expect(
            tabs[1].classList.contains('RaTranslatableInputsTab-error')
        ).toEqual(true);
    });

    it('should allow to update any input for any locale', () => {
        const save = jest.fn();
        renderWithRedux(
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

        fireEvent.change(screen.queryByDisplayValue('english name'), {
            target: { value: 'english name updated' },
        });
        fireEvent.click(screen.getByText('ra.locales.fr'));
        fireEvent.change(screen.queryByDisplayValue('french nested field'), {
            target: { value: 'french nested field updated' },
        });
        fireEvent.click(screen.getByText('save'));

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

        renderWithRedux(
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

        expect(screen.getByLabelText('en').getAttribute('hidden')).toBeNull();
        expect(
            screen.getByLabelText('fr').getAttribute('hidden')
        ).not.toBeNull();

        expect(screen.queryByDisplayValue('english name')).not.toBeNull();
        expect(
            screen.queryByDisplayValue('english description')
        ).not.toBeNull();
        expect(
            screen.queryByDisplayValue('english nested field')
        ).not.toBeNull();

        expect(screen.queryByDisplayValue('french name')).not.toBeNull();
        expect(screen.queryByDisplayValue('french description')).not.toBeNull();
        expect(
            screen.queryByDisplayValue('french nested field')
        ).not.toBeNull();

        fireEvent.change(screen.getByLabelText('select locale'), {
            target: { value: 'fr' },
        });
        expect(
            screen.getByLabelText('en').getAttribute('hidden')
        ).not.toBeNull();
        expect(screen.getByLabelText('fr').getAttribute('hidden')).toBeNull();
    });
});
