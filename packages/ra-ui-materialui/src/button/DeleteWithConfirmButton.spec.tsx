import * as React from 'react';
import {
    screen,
    render,
    waitFor,
    fireEvent,
    within,
} from '@testing-library/react';
import expect from 'expect';
import {
    CoreAdminContext,
    MutationMode,
    testDataProvider,
    useNotificationContext,
} from 'ra-core';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { DeleteWithConfirmButton } from './DeleteWithConfirmButton';
import { Toolbar, SimpleForm } from '../form';
import { Edit } from '../detail';
import { TextInput } from '../input';
import { Notification } from '../layout';
import {
    Basic,
    NoRecordRepresentation,
    Themed,
    WithCustomTitleAndContent,
    WithDefaultTranslation,
} from './DeleteWithConfirmButton.stories';
import { Label } from './DeleteButton.stories';

const theme = createTheme();

const invalidButtonDomProps = {
    record: { id: 123, foo: 'bar' },
    redirect: 'list',
    resource: 'posts',
    mutationMode: 'pessimistic' as MutationMode,
};

describe('<DeleteWithConfirmButton />', () => {
    it('should allow resource specific label, confirm title and confirm content', async () => {
        render(
            <Label
                translations="resource specific"
                mutationMode="pessimistic"
            />
        );
        fireEvent.click(
            await screen.findByText('Delete War and Peace permanently')
        );
        await screen.findByText('Delete War and Peace permanently?');
        await screen.findByText(
            'Are you sure you want to delete War and Peace permanently?'
        );
        fireEvent.click(screen.getByText('Cancel'));
        fireEvent.click(screen.getByText('English', { selector: 'button' }));
        fireEvent.click(await screen.findByText('Français'));
        fireEvent.click(
            await screen.findByText('Supprimer définitivement War and Peace')
        );
        await screen.findByText('Supprimer définitivement War and Peace ?');
        await screen.findByText(
            'Êtes-vous sûr de vouloir supprimer définitivement War and Peace ?'
        );
    });

    it('should render a button with no DOM errors', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <ThemeProvider theme={theme}>
                    <DeleteWithConfirmButton {...invalidButtonDomProps} />
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
        location: {},
        match: {},
        mutationMode: 'pessimistic' as MutationMode,
    };

    it('should allow to override the resource', async () => {
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
                <DeleteWithConfirmButton resource="comments" />
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
        fireEvent.click(
            await screen.findByLabelText('resources.comments.action.delete')
        );
        fireEvent.click(screen.getByText('ra.action.confirm'));
        await waitFor(() => {
            expect(dataProvider.delete).toHaveBeenCalledWith('comments', {
                id: 123,
                previousData: { id: 123, title: 'lorem' },
            });
        });
    });

    it('should allows to undo the deletion after confirmation if mutationMode is undoable', async () => {
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
                <DeleteWithConfirmButton mutationMode="undoable" />
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
        // waitFor for the dataProvider.getOne() return
        await waitFor(() => {
            expect(screen.queryByDisplayValue('lorem')).not.toBeNull();
        });
        fireEvent.click(
            await screen.findByLabelText('resources.posts.action.delete')
        );
        fireEvent.click(screen.getByText('ra.action.confirm'));

        await waitFor(() => {
            expect(
                screen.queryByText('resources.posts.notifications.deleted')
            ).not.toBeNull();
        });
        expect(screen.queryByText('ra.action.undo')).not.toBeNull();
    });

    it('should allow to override the success side effects', async () => {
        const dataProvider = testDataProvider({
            getOne: () =>
                // @ts-ignore
                Promise.resolve({
                    data: { id: 123, title: 'lorem' },
                }),
            delete: jest.fn().mockResolvedValueOnce({ data: { id: 123 } }),
        });
        const onSuccess = jest.fn();
        const EditToolbar = props => (
            <Toolbar {...props}>
                <DeleteWithConfirmButton mutationOptions={{ onSuccess }} />
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
        fireEvent.click(
            await screen.findByLabelText('resources.posts.action.delete')
        );
        fireEvent.click(screen.getByText('ra.action.confirm'));
        await waitFor(() => {
            expect(dataProvider.delete).toHaveBeenCalled();
            expect(onSuccess).toHaveBeenCalledWith(
                { id: 123 },
                {
                    id: 123,
                    previousData: { id: 123, title: 'lorem' },
                    resource: 'posts',
                },
                { snapshot: [] },
                expect.anything()
            );
        });
        await waitFor(() => {
            // Check that the dialog is closed
            expect(screen.queryByText('ra.action.confirm')).toBeNull();
        });
    });

    it('should allow to override the error side effects', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const dataProvider = testDataProvider({
            getOne: () =>
                // @ts-ignore
                Promise.resolve({
                    data: { id: 123, title: 'lorem' },
                }),
            delete: jest.fn().mockRejectedValueOnce(new Error('not good')),
        });
        const onError = jest.fn();
        const EditToolbar = props => (
            <Toolbar {...props}>
                <DeleteWithConfirmButton mutationOptions={{ onError }} />
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
            expect(screen.queryByDisplayValue('lorem')).toBeDefined();
        });
        fireEvent.click(
            await screen.findByLabelText('resources.posts.action.delete')
        );
        fireEvent.click(screen.getByText('ra.action.confirm'));
        await waitFor(() => {
            expect(dataProvider.delete).toHaveBeenCalled();
            expect(onError).toHaveBeenCalledWith(
                new Error('not good'),
                {
                    id: 123,
                    previousData: { id: 123, title: 'lorem' },
                    resource: 'posts',
                },
                { snapshot: [] },
                expect.anything()
            );
        });
        await waitFor(() => {
            // Check that the dialog is closed
            expect(screen.queryByText('ra.action.confirm')).toBeNull();
        });
    });

    it('should allow to override the translateOptions props', async () => {
        const dataProvider = testDataProvider({
            getOne: () =>
                // @ts-ignore
                Promise.resolve({
                    data: { id: 123, title: 'lorem' },
                }),
            // @ts-ignore
            delete: () => Promise.resolve({ data: { id: 123 } }),
        });

        const translateOptions = {
            id: '#20061703',
        };
        const EditToolbar = props => (
            <Toolbar {...props}>
                <DeleteWithConfirmButton translateOptions={translateOptions} />
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
            expect(screen.queryByDisplayValue('lorem')).toBeDefined();
        });

        fireEvent.click(
            await screen.findByLabelText('resources.posts.action.delete')
        );
        expect(screen.queryByDisplayValue('#20061703')).toBeDefined();
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
                <DeleteWithConfirmButton
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
        fireEvent.click(screen.getByText('ra.action.confirm'));
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
                        undoable: false,
                    },
                },
            ]);
        });
    });

    it('should use the provided strings as the confirmation title and content', async () => {
        render(<WithCustomTitleAndContent />);
        fireEvent.click(
            within(
                (await screen.findByText('War and Peace')).closest(
                    'tr'
                ) as HTMLElement
            ).getByText('Delete')
        );
        await screen.findByText('Delete me?');
        await screen.findByText('Please confirm the deletion');
    });

    it('should use the record representation in the confirmation title and content with a resource specific translation', async () => {
        render(<Basic />);
        fireEvent.click(
            within(
                (await screen.findByText('War and Peace')).closest(
                    'tr'
                ) as HTMLElement
            ).getByText('Delete')
        );
        await screen.findByText('Delete the book "War and Peace"?');
        await screen.findByText(
            'Do you really want to delete the book "War and Peace"?'
        );
    });

    it('should use the record representation in the confirmation title and content without a resource specific translation', async () => {
        render(<WithDefaultTranslation />);
        fireEvent.click(
            within(
                (await screen.findByText('War and Peace')).closest(
                    'tr'
                ) as HTMLElement
            ).getByText('Delete')
        );
        await screen.findByText('Delete book War and Peace');
        await screen.findByText('Are you sure you want to delete this book?');
    });

    it('should use the default record representation in the confirmation title and title when no record representation is available', async () => {
        render(<NoRecordRepresentation />);
        fireEvent.click(
            within(
                (await screen.findByText('Leo Tolstoy')).closest(
                    'tr'
                ) as HTMLElement
            ).getByText('Delete')
        );
        await screen.findByText('Delete author #1');
        await screen.findByText('Are you sure you want to delete this author?');
    });

    it('should be customized by a theme', async () => {
        render(<Themed />);
        const buttons = await screen.findAllByTestId('themed');
        expect(buttons[0].classList).toContain('MuiButton-outlined');
    });
});
