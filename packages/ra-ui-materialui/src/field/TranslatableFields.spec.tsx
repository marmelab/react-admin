import * as React from 'react';
import expect from 'expect';
import { fireEvent, render } from '@testing-library/react';
import { TranslatableFields } from './TranslatableFields';
import TextField from './TextField';
import { useTranslatableContext } from 'ra-core';

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
        const { queryByText, getByLabelText, getByText } = render(
            <TranslatableFields
                record={record}
                resource="products"
                basePath="/products"
                locales={['en', 'fr']}
            >
                <TextField source="name" />
                <TextField source="description" />
                <TextField source="nested.field" />
            </TranslatableFields>
        );

        expect(
            getByLabelText('ra.locales.en').getAttribute('hidden')
        ).toBeNull();
        expect(
            getByLabelText('ra.locales.fr').getAttribute('hidden')
        ).not.toBeNull();

        expect(queryByText('english name')).not.toBeNull();
        expect(queryByText('english description')).not.toBeNull();
        expect(queryByText('english nested field')).not.toBeNull();

        expect(queryByText('french name')).not.toBeNull();
        expect(queryByText('french description')).not.toBeNull();
        expect(queryByText('french nested field')).not.toBeNull();

        fireEvent.click(getByText('ra.locales.fr'));
        expect(
            getByLabelText('ra.locales.en').getAttribute('hidden')
        ).not.toBeNull();
        expect(
            getByLabelText('ra.locales.fr').getAttribute('hidden')
        ).toBeNull();
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

        const { queryByText, getByLabelText } = render(
            <TranslatableFields
                record={record}
                resource="products"
                basePath="/products"
                locales={['en', 'fr']}
                selector={<Selector />}
            >
                <TextField source="name" />
                <TextField source="description" />
                <TextField source="nested.field" />
            </TranslatableFields>
        );

        expect(getByLabelText('en').getAttribute('hidden')).toBeNull();
        expect(getByLabelText('fr').getAttribute('hidden')).not.toBeNull();

        expect(queryByText('english name')).not.toBeNull();
        expect(queryByText('english description')).not.toBeNull();
        expect(queryByText('english nested field')).not.toBeNull();

        expect(queryByText('french name')).not.toBeNull();
        expect(queryByText('french description')).not.toBeNull();
        expect(queryByText('french nested field')).not.toBeNull();

        fireEvent.change(getByLabelText('select locale'), {
            target: { value: 'fr' },
        });
        expect(getByLabelText('en').getAttribute('hidden')).not.toBeNull();
        expect(getByLabelText('fr').getAttribute('hidden')).toBeNull();
    });
});
