import * as React from 'react';
import expect from 'expect';
import { testDataProvider } from 'ra-core';
import { render, screen, waitFor } from '@testing-library/react';
import { TabbedForm } from './TabbedForm';
import { FormTab } from './FormTab';
import { TextInput } from '../input';
import { AdminContext } from '../AdminContext';

describe('<FormTab label="foo" />', () => {
    it('should display <Toolbar />', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <TabbedForm>
                    <FormTab label="foo">
                        <TextInput source="name" />
                        <TextInput source="city" />
                    </FormTab>
                </TabbedForm>
            </AdminContext>
        );
        await waitFor(() => {
            expect(screen.queryByLabelText('ra.action.save')).not.toBeNull();
        });
    });

    it('should render a TabbedForm with FormTabs having custom props without warnings', async () => {
        let countWarnings = 0;
        const spy = jest
            .spyOn(console, 'error')
            .mockImplementation((message: string) => {
                if (!message.includes('a test was not wrapped in act')) {
                    countWarnings++;
                }
            });

        const record = { id: 'gazebo', name: 'foo' };

        const { container } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <TabbedForm>
                    <FormTab
                        label="First"
                        resource="posts"
                        record={record}
                        margin="none"
                        variant="standard"
                    >
                        <TextInput source="name" />
                    </FormTab>
                    <FormTab
                        label="Second"
                        resource="posts"
                        record={record}
                        margin="dense"
                        variant="filled"
                    >
                        <TextInput source="name" />
                    </FormTab>
                    <FormTab
                        label="Third"
                        resource="posts"
                        record={record}
                        margin="normal"
                        variant="outlined"
                    >
                        <TextInput source="name" />
                    </FormTab>
                </TabbedForm>
            </AdminContext>
        );
        await waitFor(() => {
            expect(countWarnings).toEqual(0);
        });
        expect(container).not.toBeNull();

        spy.mockRestore();
    });
});
