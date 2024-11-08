import * as React from 'react';
import { screen, render, waitFor, fireEvent } from '@testing-library/react';
import expect from 'expect';
import { CoreAdminContext, MutationMode, testDataProvider } from 'ra-core';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { UpdateWithConfirmButton } from './UpdateWithConfirmButton';
import { Toolbar, SimpleForm } from '../form';
import { Edit } from '../detail';
import { TextInput } from '../input';
import { Notification } from '../layout';
import { MutationOptions } from './UpdateButton.stories';

const theme = createTheme();

const invalidButtonDomProps = {
    record: { id: 123, foo: 'bar' },
    redirect: 'list',
    resource: 'posts',
    mutationMode: 'pessimistic' as MutationMode,
};

describe('<UpdateWithConfirmButton />', () => {
    it('should render a button with no DOM errors', async () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <ThemeProvider theme={theme}>
                    <UpdateWithConfirmButton
                        data={{}}
                        {...invalidButtonDomProps}
                    />
                </ThemeProvider>
            </CoreAdminContext>
        );

        expect(spy).not.toHaveBeenCalled();
        expect(
            (await screen.findByLabelText('ra.action.update')).getAttribute(
                'type'
            )
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
            // @ts-ignore
            getOne: () =>
                Promise.resolve({
                    data: { id: 123, title: 'lorem', views: 1000 },
                }),
            update: jest.fn().mockResolvedValueOnce({ data: { id: 123 } }),
        });
        const EditToolbar = props => (
            <Toolbar {...props}>
                <UpdateWithConfirmButton
                    resource="comments"
                    data={{ views: 0 }}
                />
            </Toolbar>
        );
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ThemeProvider theme={theme}>
                    <Edit {...defaultEditProps}>
                        <SimpleForm toolbar={<EditToolbar />}>
                            <TextInput source="title" />
                        </SimpleForm>
                    </Edit>
                </ThemeProvider>
            </CoreAdminContext>
        );
        // waitFor for the dataProvider.getOne() return
        await waitFor(() => {
            expect(screen.queryByDisplayValue('lorem')).not.toBeNull();
        });
        fireEvent.click(await screen.findByLabelText('ra.action.update'));
        fireEvent.click(screen.getByText('ra.action.confirm'));
        await waitFor(() => {
            expect(dataProvider.update).toHaveBeenCalledWith('comments', {
                id: 123,
                data: { views: 0 },
                previousData: { id: 123, title: 'lorem', views: 1000 },
                meta: undefined,
            });
        });
    });

    it('should allow to undo the update after confirmation if mutationMode is undoable', async () => {
        const dataProvider = testDataProvider({
            // @ts-ignore
            getOne: () =>
                Promise.resolve({
                    data: { id: 123, title: 'lorem', views: 1000 },
                }),
            update: jest.fn().mockResolvedValueOnce({ data: { id: 123 } }),
        });
        const EditToolbar = props => (
            <Toolbar {...props}>
                <UpdateWithConfirmButton
                    data={{ views: 0 }}
                    mutationMode="undoable"
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
        // waitFor for the dataProvider.getOne() return
        await waitFor(() => {
            expect(screen.queryByDisplayValue('lorem')).not.toBeNull();
        });
        fireEvent.click(await screen.findByLabelText('ra.action.update'));
        fireEvent.click(screen.getByText('ra.action.confirm'));

        await waitFor(() => {
            expect(
                screen.queryByText('resources.posts.notifications.updated')
            ).not.toBeNull();
        });
        expect(screen.queryByText('ra.action.undo')).not.toBeNull();
    });

    it('should allow to override the success side effects', async () => {
        const dataProvider = testDataProvider({
            // @ts-ignore
            getOne: () =>
                Promise.resolve({
                    data: { id: 123, title: 'lorem', views: 1000 },
                }),
            update: jest.fn().mockResolvedValueOnce({ data: { id: 123 } }),
        });
        const onSuccess = jest.fn();
        const EditToolbar = props => (
            <Toolbar {...props}>
                <UpdateWithConfirmButton
                    data={{ views: 0 }}
                    mutationOptions={{ onSuccess }}
                />
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
        fireEvent.click(await screen.findByLabelText('ra.action.update'));
        fireEvent.click(screen.getByText('ra.action.confirm'));
        await waitFor(() => {
            expect(dataProvider.update).toHaveBeenCalled();
            expect(onSuccess).toHaveBeenCalledWith(
                { id: 123 },
                {
                    id: 123,
                    data: { views: 0 },
                    previousData: { id: 123, title: 'lorem', views: 1000 },
                    meta: undefined,
                    resource: 'posts',
                },
                { snapshot: expect.any(Array) }
            );
        });
    });

    it('should allow to override the error side effects', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const dataProvider = testDataProvider({
            // @ts-ignore
            getOne: () =>
                Promise.resolve({
                    data: { id: 123, title: 'lorem', views: 1000 },
                }),
            update: jest.fn().mockRejectedValueOnce(new Error('not good')),
        });
        const onError = jest.fn();
        const EditToolbar = props => (
            <Toolbar {...props}>
                <UpdateWithConfirmButton
                    data={{ views: 0 }}
                    mutationOptions={{ onError }}
                />
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
        fireEvent.click(await screen.findByLabelText('ra.action.update'));
        fireEvent.click(screen.getByText('ra.action.confirm'));
        await waitFor(() => {
            expect(dataProvider.update).toHaveBeenCalled();
            expect(onError).toHaveBeenCalledWith(
                new Error('not good'),
                {
                    id: 123,
                    data: { views: 0 },
                    previousData: { id: 123, title: 'lorem', views: 1000 },
                    meta: undefined,
                    resource: 'posts',
                },
                { snapshot: expect.any(Array) }
            );
        });
    });

    it('should close the dialog even with custom success side effect', async () => {
        render(<MutationOptions />);
        await screen.findByText('Reset views');
        fireEvent.click(await screen.findByText('Reset views'));
        await screen.findByRole('dialog');
        await screen.findByText(
            'Are you sure you want to update this post?',
            undefined,
            { timeout: 4000 }
        );
        fireEvent.click(screen.getByText('Confirm'));
        await screen.findByText('Reset views success', undefined, {
            timeout: 2000,
        });
        // wait until next tick, as the settled side effect is called after the success side effect
        await waitFor(() => new Promise(resolve => setTimeout(resolve, 300)));
        expect(
            screen.queryByText('Are you sure you want to update this post?')
        ).toBeNull();
    });
});
