import * as React from 'react';
import expect from 'expect';
import { fireEvent, render, screen } from '@testing-library/react';
import { useTranslatableContext } from 'ra-core';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { TranslatableFields } from './TranslatableFields';
import { TextField } from './TextField';
import { defaultTheme } from '../defaultTheme';

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

describe('<TranslatableFields />', () => {
    it('should render every field for every locale', () => {
        render(
            <ThemeProvider theme={createTheme(defaultTheme)}>
                <TranslatableFields
                    record={record}
                    resource="products"
                    locales={['en', 'fr']}
                >
                    <TextField source="name" />
                    <TextField source="description" />
                    <TextField source="nested.field" />
                </TranslatableFields>
            </ThemeProvider>
        );

        expect(screen.getByLabelText('En').getAttribute('hidden')).toBeNull();
        expect(
            screen.getByLabelText('Fr').getAttribute('hidden')
        ).not.toBeNull();

        expect(screen.queryByText('english name')).not.toBeNull();
        expect(screen.queryByText('english description')).not.toBeNull();
        expect(screen.queryByText('english nested field')).not.toBeNull();

        expect(screen.queryByText('french name')).not.toBeNull();
        expect(screen.queryByText('french description')).not.toBeNull();
        expect(screen.queryByText('french nested field')).not.toBeNull();

        fireEvent.click(screen.getByText('Fr'));
        expect(
            screen.getByLabelText('En').getAttribute('hidden')
        ).not.toBeNull();
        expect(screen.getByLabelText('Fr').getAttribute('hidden')).toBeNull();
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
            <ThemeProvider theme={createTheme(defaultTheme)}>
                <TranslatableFields
                    record={record}
                    resource="products"
                    locales={['en', 'fr']}
                    selector={<Selector />}
                >
                    <TextField source="name" />
                    <TextField source="description" />
                    <TextField source="nested.field" />
                </TranslatableFields>
            </ThemeProvider>
        );

        expect(screen.getByLabelText('en').getAttribute('hidden')).toBeNull();
        expect(
            screen.getByLabelText('fr').getAttribute('hidden')
        ).not.toBeNull();

        expect(screen.queryByText('english name')).not.toBeNull();
        expect(screen.queryByText('english description')).not.toBeNull();
        expect(screen.queryByText('english nested field')).not.toBeNull();

        expect(screen.queryByText('french name')).not.toBeNull();
        expect(screen.queryByText('french description')).not.toBeNull();
        expect(screen.queryByText('french nested field')).not.toBeNull();

        fireEvent.change(screen.getByLabelText('select locale'), {
            target: { value: 'fr' },
        });
        expect(
            screen.getByLabelText('en').getAttribute('hidden')
        ).not.toBeNull();
        expect(screen.getByLabelText('fr').getAttribute('hidden')).toBeNull();
    });
});
