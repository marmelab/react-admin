import * as React from 'react';
import { screen, render, waitFor, fireEvent } from '@testing-library/react';
import expect from 'expect';
import {
    MutationMode,
    CoreAdminContext,
    testDataProvider,
    useNotificationContext,
} from 'ra-core';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { Toolbar, SimpleForm } from '../form';
import { Edit } from '../detail';
import { TextInput } from '../input';
import { DeleteWithUndoButton } from './DeleteWithUndoButton';
import { Label } from './DeleteButton.stories';
import { Themed } from './DeleteWithUndoButton.stories';

const theme = createTheme();

const invalidButtonDomProps = {
    record: { id: 123, foo: 'bar' },
    redirect: 'list',
    resource: 'posts',
};

describe('<DeleteWithUndoButton />', () => {
    it('should allow resource specific default title', async () => {
        render(<Label translations="resource specific" />);
        await screen.findByText('Delete War and Peace permanently');
        fireEvent.click(screen.getByText('English', { selector: 'button' }));
        fireEvent.click(await screen.findByText('Français'));
        await screen.findByText('Supprimer définitivement War and Peace');
    });

    it('should render a button with no DOM errors', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <ThemeProvider theme={theme}>
                    <DeleteWithUndoButton {...invalidButtonDomProps} />
                </ThemeProvider>
            </CoreAdminContext>
        );

        expect(spy).not.toHaveBeenCalled();
        expect(
            screen
                .getByLabelText('resources.posts.action.delete')
                .getAttribute('type')
        ).toEqual('button');

        spy.mockRestore();
    });

    const defaultEditProps = {
        id: '123',
        resource: 'posts',
        location: {
            pathname: '',
            search: undefined,
            state: undefined,
            hash: undefined,
        },
        match: { isExact: true, path: '', url: '', params: undefined },
        mutationMode: 'pessimistic' as MutationMode,
    };

    it('should allow to override the onSuccess side effects', async () => {
        const dataProvider = testDataProvider({
            getOne: () =>
                // @ts-ignore
                Promise.resolve({
                    data: { id: 123, title: 'lorem' },
                }),
            // @ts-ignore
            delete: () => Promise.resolve({ data: { id: 123 } }),
        });
        const onSuccess = jest.fn();
        const EditToolbar = props => (
            <Toolbar {...props}>
                <DeleteWithUndoButton mutationOptions={{ onSuccess }} />
            </Toolbar>
        );
        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Edit {...defaultEditProps}>
                        <SimpleForm toolbar={<EditToolbar />}>
                            <TextInput source="title" />
                        </SimpleForm>
                    </Edit>
                </CoreAdminContext>
            </ThemeProvider>
        );
        // waitFor for the dataProvider.getOne() return
        await waitFor(() => {
            expect(screen.queryByDisplayValue('lorem')).not.toBeNull();
        });
        fireEvent.click(screen.getByLabelText('resources.posts.action.delete'));
        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalledWith(
                { id: 123, title: 'lorem' },
                {
                    id: 123,
                    previousData: { id: 123, title: 'lorem' },
                    resource: 'posts',
                },
                { snapshot: [] },
                expect.anything()
            );
        });
    });

    it('should display success message after successful deletion', async () => {
        const successMessage = 'Test Message';
        const dataProvider = testDataProvider({
            getOne: () =>
                // @ts-ignore
                Promise.resolve({
                    data: { id: 123, title: 'lorem' },
                }),
            delete: jest.fn().mockResolvedValueOnce({ data: { id: 123 } }),
        });
        const EditToolbar = props => (
            <Toolbar {...props}>
                <DeleteWithUndoButton
                    resource="comments"
                    successMessage={successMessage}
                />
            </Toolbar>
        );

        let notificationsSpy;
        const Notification = () => {
            const { notifications } = useNotificationContext();
            React.useEffect(() => {
                notificationsSpy = notifications;
            }, [notifications]);
            return null;
        };

        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Edit {...defaultEditProps}>
                        <SimpleForm toolbar={<EditToolbar />}>
                            <TextInput source="title" />
                        </SimpleForm>
                    </Edit>
                    <Notification />
                </CoreAdminContext>
            </ThemeProvider>
        );
        // waitFor for the dataProvider.getOne() return
        await waitFor(() => {
            expect(screen.queryByDisplayValue('lorem')).not.toBeNull();
        });
        fireEvent.click(
            await screen.findByLabelText('resources.comments.action.delete')
        );
        await waitFor(() => {
            expect(notificationsSpy).toEqual([
                {
                    message: successMessage,
                    type: 'info',
                    notificationOptions: {
                        messageArgs: {
                            smart_count: 1,
                            _: 'ra.notification.deleted',
                        },
                        undoable: true,
                    },
                },
            ]);
        });
    });

    it('should be customized by a theme', async () => {
        render(<Themed />);
        const buttons = await screen.findAllByTestId('themed');
        expect(buttons[0].classList).toContain('MuiButton-outlined');
    });
});
