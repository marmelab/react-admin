import * as React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import expect from 'expect';
import { DataProvider, DataProviderContext, MutationMode } from 'ra-core';
import { QueryClientProvider, QueryClient } from 'react-query';
import { renderWithRedux, TestContext } from 'ra-test';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { Toolbar, SimpleForm } from '../form';
import { Edit } from '../detail';
import { TextInput } from '../input';
import { DeleteWithUndoButton } from './DeleteWithUndoButton';

const theme = createTheme();

const invalidButtonDomProps = {
    basePath: '',
    handleSubmit: jest.fn(),
    handleSubmitWithRedirect: jest.fn(),
    invalid: false,
    onSave: jest.fn(),
    pristine: false,
    record: { id: 123, foo: 'bar' },
    redirect: 'list',
    resource: 'posts',
    saving: false,
    submitOnEnter: true,
    mutationMode: 'undoable' as MutationMode,
};

describe('<DeleteWithUndoButton />', () => {
    it('should render a button with no DOM errors', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const { getByLabelText } = render(
            <TestContext
                initialState={{
                    admin: {
                        resources: {
                            posts: {
                                data: {
                                    1: {
                                        id: 1,
                                        foo: 'bar',
                                    },
                                },
                            },
                        },
                    },
                }}
            >
                <ThemeProvider theme={theme}>
                    <DeleteWithUndoButton {...invalidButtonDomProps} />
                </ThemeProvider>
            </TestContext>
        );

        expect(spy).not.toHaveBeenCalled();
        expect(getByLabelText('ra.action.delete').getAttribute('type')).toEqual(
            'button'
        );

        spy.mockRestore();
    });

    const defaultEditProps = {
        basePath: '',
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
        const dataProvider = ({
            getOne: () =>
                Promise.resolve({
                    data: { id: 123, title: 'lorem' },
                }),
            delete: () => Promise.resolve({ data: { id: 123 } }),
        } as unknown) as DataProvider;
        const onSuccess = jest.fn();
        const EditToolbar = props => (
            <Toolbar {...props}>
                <DeleteWithUndoButton onSuccess={onSuccess} />
            </Toolbar>
        );
        const { queryByDisplayValue, getByLabelText } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={new QueryClient()}>
                    <DataProviderContext.Provider value={dataProvider}>
                        <Edit {...defaultEditProps}>
                            <SimpleForm toolbar={<EditToolbar />}>
                                <TextInput source="title" />
                            </SimpleForm>
                        </Edit>
                    </DataProviderContext.Provider>
                </QueryClientProvider>
            </ThemeProvider>
        );
        // waitFor for the dataProvider.getOne() return
        await waitFor(() => {
            expect(queryByDisplayValue('lorem')).not.toBeNull();
        });
        fireEvent.click(getByLabelText('ra.action.delete'));
        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalledWith({});
        });
    });
});
