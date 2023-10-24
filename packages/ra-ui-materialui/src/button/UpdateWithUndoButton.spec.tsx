import * as React from 'react';
import { screen, render, waitFor, fireEvent } from '@testing-library/react';
import expect from 'expect';
import { MutationMode, CoreAdminContext, testDataProvider } from 'ra-core';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { Toolbar, SimpleForm } from '../form';
import { Edit } from '../detail';
import { TextInput } from '../input';
import { UpdateWithUndoButton } from './UpdateWithUndoButton';

const theme = createTheme();

const invalidButtonDomProps = {
    record: { id: 123, foo: 'bar' },
    redirect: 'list',
    resource: 'posts',
};

describe('<UpdateWithUndoButton />', () => {
    it('should render a button with no DOM errors', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <ThemeProvider theme={theme}>
                    <UpdateWithUndoButton
                        data={{}}
                        {...invalidButtonDomProps}
                    />
                </ThemeProvider>
            </CoreAdminContext>
        );

        expect(spy).not.toHaveBeenCalled();
        expect(
            screen.getByLabelText('ra.action.update').getAttribute('type')
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
            // @ts-ignore
            getOne: () =>
                Promise.resolve({
                    data: { id: 123, title: 'lorem', views: 1000 },
                }),
            // @ts-ignore
            update: () => Promise.resolve({ data: { id: 123 } }),
        });
        const onSuccess = jest.fn();
        const EditToolbar = props => (
            <Toolbar {...props}>
                <UpdateWithUndoButton
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
        fireEvent.click(screen.getByLabelText('ra.action.update'));
        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalledWith(
                { id: 123, title: 'lorem', views: 0 },
                {
                    id: 123,
                    data: { views: 0 },
                    meta: undefined,
                    previousData: { id: 123, title: 'lorem', views: 1000 },
                    resource: 'posts',
                },
                { snapshot: expect.any(Array) }
            );
        });
    });
});
