import * as React from 'react';
import { screen, render, waitFor, fireEvent } from '@testing-library/react';
import expect from 'expect';
import { CoreAdminContext, MutationMode, testDataProvider } from 'ra-core';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { BulkUpdateWithConfirmButton } from './BulkUpdateWithConfirmButton';
import { Toolbar, SimpleForm } from '../form';
import { Edit } from '../detail';
import { TextInput } from '../input';
import { Notification } from '../layout';

const theme = createTheme();

describe('<BulkUpdateWithConfirmButton />', () => {
    const defaultEditProps = {
        id: '123',
        resource: 'posts',
        location: {},
        match: {},
        mutationMode: 'pessimistic' as MutationMode,
    };

    it('should close the confirmation dialog after confirm', async () => {
        const dataProvider = testDataProvider({
            // @ts-ignore
            getOne: () =>
                Promise.resolve({
                    data: { id: 123, title: 'lorem' },
                }),
            update: jest.fn().mockResolvedValueOnce({ data: { id: 123 } }),
        });
        const EditToolbar = props => (
            <Toolbar {...props}>
                <BulkUpdateWithConfirmButton
                    data={{ views: 'foobar' }}
                    mutationMode="pessimistic"
                />
            </Toolbar>
        );
        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <>
                        <Edit {...defaultEditProps}>
                            <SimpleForm toolbar={<EditToolbar />}>
                                <TextInput source="title" />
                            </SimpleForm>
                        </Edit>
                        <Notification />
                    </>
                </CoreAdminContext>
            </ThemeProvider>
        );
        expect(await screen.findByText('lorem')).toBeInTheDocument();
        const checkContainer = screen.getByRole("columnheader", {"name": "Select all"});
        const check = within(checkContainer).getByRole("checkbox");
        fireEvent.click(check);
        expect(check).toBeChecked();

        fireEvent.click(screen.getByLabelText('ra.action.update'));
        expect(await screen.findByText('Update 1 posts')).toBeInTheDocument();
        fireEvent.click(screen.getByText('ra.action.confirm'));

        await waitFor(() => {
            expect(
                screen.queryByText('Update 1 posts')
            ).not.toBeInTheDocument();
        });
        expect(screen.getByText('foobar')).toBeInTheDocument();
    });
});
