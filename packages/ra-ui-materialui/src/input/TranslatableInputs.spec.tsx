import * as React from 'react';
import expect from 'expect';
import { TextInput } from './TextInput';
import { testDataProvider, useTranslatableContext } from 'ra-core';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Tabs } from '@mui/material';

import { AdminContext } from '../AdminContext';
import { SimpleForm } from '../form';
import { TranslatableInputs } from './TranslatableInputs';
import { TranslatableInputsTab } from './TranslatableInputsTab';

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
        const handleSubmit = jest.fn();
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm record={record} onSubmit={handleSubmit}>
                    <TranslatableInputs locales={['en', 'fr']}>
                        <TextInput source="name" />
                        <TextInput source="description" />
                        <TextInput source="nested.field" />
                    </TranslatableInputs>
                </SimpleForm>
            </AdminContext>
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

    it('should display validation errors and highlight the tab which has invalid inputs', async () => {
        const handleSubmit = jest.fn();

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

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    record={record}
                    onSubmit={handleSubmit}
                    mode="onBlur"
                >
                    <TranslatableInputs
                        locales={['en', 'fr']}
                        selector={<Selector />}
                    >
                        <TextInput source="name" validate={() => 'error'} />
                    </TranslatableInputs>
                </SimpleForm>
            </AdminContext>
        );

        expect(
            screen.getByLabelText('ra.locales.en').getAttribute('hidden')
        ).toBeNull();
        expect(
            screen.getByLabelText('ra.locales.fr').getAttribute('hidden')
        ).not.toBeNull();

        fireEvent.change(
            screen.getAllByLabelText('resources.undefined.fields.name')[0],
            {
                target: { value: 'english value' },
            }
        );
        fireEvent.click(screen.getByText('ra.locales.fr'));
        fireEvent.focus(
            screen.getAllByLabelText('resources.undefined.fields.name')[1]
        );
        fireEvent.blur(
            screen.getAllByLabelText('resources.undefined.fields.name')[1]
        );
        await waitFor(() => {
            expect(screen.queryByText('error')).not.toBeNull();
        });
        fireEvent.click(screen.getByText('ra.locales.en'));
        const tabs = screen.getAllByRole('tab');
        expect(tabs[1].getAttribute('id')).toEqual('translatable-header-fr');
        expect(
            tabs[1].classList.contains('RaTranslatableInputsTab-error')
        ).toEqual(true);
    });

    it('should allow to update any input for any locale', async () => {
        const save = jest.fn();
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm record={record} onSubmit={save}>
                    <TranslatableInputs locales={['en', 'fr']}>
                        <TextInput source="name" />
                        <TextInput source="description" />
                        <TextInput source="nested.field" />
                    </TranslatableInputs>
                </SimpleForm>
            </AdminContext>
        );

        fireEvent.change(screen.queryByDisplayValue('english name'), {
            target: { value: 'english name updated' },
        });
        fireEvent.click(screen.getByText('ra.locales.fr'));
        fireEvent.change(screen.queryByDisplayValue('french nested field'), {
            target: { value: 'french nested field updated' },
        });
        fireEvent.click(screen.getByText('ra.action.save'));

        await waitFor(() => {
            expect(save).toHaveBeenCalledWith({
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
            });
        });
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

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm record={record}>
                    <TranslatableInputs
                        locales={['en', 'fr']}
                        selector={<Selector />}
                    >
                        <TextInput source="name" />
                        <TextInput source="description" />
                        <TextInput source="nested.field" />
                    </TranslatableInputs>
                </SimpleForm>
            </AdminContext>
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
