import * as React from 'react';
import expect from 'expect';
import { testDataProvider } from 'ra-core';
import { render, screen, waitFor } from '@testing-library/react';
import { TabbedForm } from './TabbedForm';
import { TextInput } from '../input';
import { AdminContext } from '../AdminContext';

describe('<TabbedForm.Tab label="foo" />', () => {
    it('should display <Toolbar />', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <TabbedForm>
                    <TabbedForm.Tab label="foo">
                        <TextInput source="name" />
                        <TextInput source="city" />
                    </TabbedForm.Tab>
                </TabbedForm>
            </AdminContext>
        );
        await waitFor(() => {
            expect(screen.queryByLabelText('ra.action.save')).not.toBeNull();
        });
    });

    it('should render a TabbedForm with TabbedForm.Tabs having custom props without warnings', async () => {
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
                    <TabbedForm.Tab
                        label="First"
                        resource="posts"
                        record={record}
                        margin="none"
                        variant="standard"
                    >
                        <TextInput source="name" />
                    </TabbedForm.Tab>
                    <TabbedForm.Tab
                        label="Second"
                        resource="posts"
                        record={record}
                        margin="dense"
                        variant="filled"
                    >
                        <TextInput source="name" />
                    </TabbedForm.Tab>
                    <TabbedForm.Tab
                        label="Third"
                        resource="posts"
                        record={record}
                        margin="normal"
                        variant="outlined"
                    >
                        <TextInput source="name" />
                    </TabbedForm.Tab>
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
