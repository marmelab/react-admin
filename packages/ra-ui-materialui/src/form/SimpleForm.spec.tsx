import * as React from 'react';
import expect from 'expect';
import { render, screen } from '@testing-library/react';
import { testDataProvider } from 'ra-core';

import { AdminContext } from '../AdminContext';
import { SimpleForm } from './SimpleForm';
import { TextInput } from '../input';

describe('<SimpleForm />', () => {
    it('should embed a form with given component children', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm>
                    <TextInput source="name" />
                    <TextInput source="city" />
                </SimpleForm>
            </AdminContext>
        );
        expect(
            screen.queryByLabelText('resources.undefined.fields.name')
        ).not.toBeNull();
        expect(
            screen.queryByLabelText('resources.undefined.fields.city')
        ).not.toBeNull();
    });

    it('should display <Toolbar />', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm>
                    <TextInput source="name" />
                    <TextInput source="city" />
                </SimpleForm>
            </AdminContext>
        );
        expect(screen.queryByLabelText('ra.action.save')).not.toBeNull();
    });
});
