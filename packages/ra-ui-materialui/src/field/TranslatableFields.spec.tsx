import * as React from 'react';
import expect from 'expect';
import { fireEvent, render } from '@testing-library/react';
import { TranslatableFields } from './TranslatableFields';
import TextField from './TextField';

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
    it('should render every fields for every languages', () => {
        const { queryByText, getByLabelText, getByText } = render(
            <TranslatableFields
                record={record}
                resource="products"
                basePath="/products"
                languages={['en', 'fr']}
            >
                <TextField source="name" />
                <TextField source="description" />
                <TextField source="nested.field" />
            </TranslatableFields>
        );

        expect(
            getByLabelText('ra.languages.en').getAttribute('hidden')
        ).toBeNull();
        expect(
            getByLabelText('ra.languages.fr').getAttribute('hidden')
        ).toBeDefined();

        expect(queryByText('english name')).not.toBeNull();
        expect(queryByText('english description')).not.toBeNull();
        expect(queryByText('english nested field')).not.toBeNull();

        expect(queryByText('french name')).not.toBeNull();
        expect(queryByText('french description')).not.toBeNull();
        expect(queryByText('french nested field')).not.toBeNull();

        fireEvent.click(getByText('ra.languages.fr'));
        expect(
            getByLabelText('ra.languages.en').getAttribute('hidden')
        ).toBeDefined();
        expect(
            getByLabelText('ra.languages.fr').getAttribute('hidden')
        ).toBeNull();
    });
});
