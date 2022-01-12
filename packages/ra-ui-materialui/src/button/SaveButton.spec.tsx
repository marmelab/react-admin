import * as React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import expect from 'expect';
import {
    DataProviderContext,
    DataProvider,
    FormWithRedirect,
    MutationMode,
} from 'ra-core';
import { renderWithRedux, TestContext } from 'ra-test';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { QueryClientProvider, QueryClient } from 'react-query';

import { SaveButton } from './SaveButton';
import { SimpleForm, Toolbar } from '../form';
import { Edit } from '../detail';
import { TextInput } from '../input';

const theme = createTheme();

const invalidButtonDomProps = {
    basePath: '',
    invalid: false,
    disabled: true,
    pristine: false,
    record: { id: 123, foo: 'bar' },
    resource: 'posts',
    saving: false,
    submitOnEnter: true,
    mutationMode: 'pessimistic' as MutationMode,
};

describe('<SaveButton />', () => {
    it('should render as submit type with no DOM errors', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const { getByLabelText } = render(
            <TestContext>
                <ThemeProvider theme={theme}>
                    <FormWithRedirect
                        render={() => <SaveButton {...invalidButtonDomProps} />}
                    />
                </ThemeProvider>
            </TestContext>
        );

        expect(spy).not.toHaveBeenCalled();
        expect(getByLabelText('ra.action.save').getAttribute('type')).toEqual(
            'submit'
        );

        spy.mockRestore();
    });

    it('should render a disabled button', () => {
        const { getByLabelText } = render(
            <TestContext>
                <ThemeProvider theme={theme}>
                    <FormWithRedirect
                        render={() => <SaveButton disabled={true} />}
                    />
                </ThemeProvider>
            </TestContext>
        );
        expect(getByLabelText('ra.action.save')['disabled']).toEqual(true);
    });

    it('should render as submit type when submitOnEnter is true', () => {
        const { getByLabelText } = render(
            <TestContext>
                <ThemeProvider theme={theme}>
                    <FormWithRedirect
                        render={() => <SaveButton submitOnEnter />}
                    />
                </ThemeProvider>
            </TestContext>
        );
        expect(getByLabelText('ra.action.save').getAttribute('type')).toEqual(
            'submit'
        );
    });

    it('should render as button type when submitOnEnter is false', () => {
        const { getByLabelText } = render(
            <TestContext>
                <ThemeProvider theme={theme}>
                    <FormWithRedirect
                        render={() => <SaveButton submitOnEnter={false} />}
                    />
                </ThemeProvider>
            </TestContext>
        );

        expect(getByLabelText('ra.action.save').getAttribute('type')).toEqual(
            'button'
        );
    });

    it('should trigger submit action when clicked if no saving is in progress', () => {
        const onSubmit = jest.fn();
        const { getByLabelText } = render(
            <TestContext>
                <ThemeProvider theme={theme}>
                    <FormWithRedirect
                        onSubmit={onSubmit}
                        render={({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <SaveButton submitOnEnter />
                            </form>
                        )}
                    />
                </ThemeProvider>
            </TestContext>
        );

        fireEvent.click(getByLabelText('ra.action.save'));
        expect(onSubmit).toHaveBeenCalled();
    });

    it('should not trigger submit action when clicked if saving is in progress', () => {
        const onSubmit = jest.fn();

        const { getByLabelText } = render(
            <TestContext>
                <ThemeProvider theme={theme}>
                    <FormWithRedirect
                        onSubmit={onSubmit}
                        render={({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <SaveButton saving submitOnEnter />
                            </form>
                        )}
                    />
                </ThemeProvider>
            </TestContext>
        );

        fireEvent.click(getByLabelText('ra.action.save'));
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should allow to override the onSuccess side effects', async () => {
        const dataProvider = ({
            getOne: () =>
                Promise.resolve({
                    data: { id: 123, title: 'lorem' },
                }),
            update: (_, { data }) => Promise.resolve({ data }),
        } as unknown) as DataProvider;
        const onSuccess = jest.fn();
        const EditToolbar = props => (
            <Toolbar {...props}>
                <SaveButton onSuccess={onSuccess} />
            </Toolbar>
        );
        const {
            queryByDisplayValue,
            getByLabelText,
            getByText,
        } = renderWithRedux(
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
            expect(queryByDisplayValue('lorem')).toBeDefined();
        });
        // change one input to enable the SaveButton (which is disabled when the form is pristine)
        fireEvent.change(getByLabelText('resources.posts.fields.title'), {
            target: { value: 'ipsum' },
        });
        fireEvent.click(getByText('ra.action.save'));
        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalledWith(
                {
                    id: 123,
                    title: 'ipsum',
                },
                { data: { id: 123, title: 'ipsum' }, resource: 'posts' },
                { snapshot: [] }
            );
        });
    });

    it('should allow to override the onFailure side effects', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        const dataProvider = ({
            getOne: () =>
                Promise.resolve({
                    data: { id: 123, title: 'lorem' },
                }),
            update: () => Promise.reject({ message: 'not good' }),
        } as unknown) as DataProvider;
        const onFailure = jest.fn();
        const EditToolbar = props => (
            <Toolbar {...props}>
                <SaveButton onFailure={onFailure} />
            </Toolbar>
        );
        const {
            queryByDisplayValue,
            getByLabelText,
            getByText,
        } = renderWithRedux(
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
            expect(queryByDisplayValue('lorem')).toBeDefined();
        });
        // change one input to enable the SaveButton (which is disabled when the form is pristine)
        fireEvent.change(getByLabelText('resources.posts.fields.title'), {
            target: { value: 'ipsum' },
        });
        fireEvent.click(getByText('ra.action.save'));
        await waitFor(() => {
            expect(onFailure).toHaveBeenCalledWith(
                {
                    message: 'not good',
                },
                { data: { id: 123, title: 'ipsum' }, resource: 'posts' },
                { snapshot: [] }
            );
        });
    });

    it('should allow to transform the record before save', async () => {
        const update = jest
            .fn()
            .mockImplementationOnce((_, { data }) => Promise.resolve({ data }));
        const dataProvider = ({
            getOne: () =>
                Promise.resolve({
                    data: { id: 123, title: 'lorem' },
                }),
            update,
        } as unknown) as DataProvider;
        const transform = jest.fn().mockImplementationOnce(data => ({
            ...data,
            transformed: true,
        }));
        const EditToolbar = props => (
            <Toolbar {...props}>
                <SaveButton transform={transform} />
            </Toolbar>
        );
        const {
            queryByDisplayValue,
            getByLabelText,
            getByText,
        } = renderWithRedux(
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
            expect(queryByDisplayValue('lorem')).toBeDefined();
        });
        // change one input to enable the SaveButton (which is disabled when the form is pristine)
        fireEvent.change(getByLabelText('resources.posts.fields.title'), {
            target: { value: 'ipsum' },
        });
        fireEvent.click(getByText('ra.action.save'));
        await waitFor(() => {
            expect(transform).toHaveBeenCalledWith({ id: 123, title: 'ipsum' });
            expect(update).toHaveBeenCalledWith('posts', {
                id: '123',
                data: { id: 123, title: 'ipsum', transformed: true },
                previousData: { id: 123, title: 'lorem' },
            });
        });
    });

    const defaultEditProps = {
        basePath: '',
        id: '123',
        resource: 'posts',
        location: {
            pathname: '/customers/123',
            search: '',
            state: {},
            hash: '',
        },
        match: {
            params: { id: 123 },
            isExact: true,
            path: '/customers/123',
            url: '/customers/123',
        },
        mutationMode: 'pessimistic' as MutationMode,
    };

    it('should disable <SaveButton/> if an input is being validated asynchronously', async () => {
        const dataProvider = ({
            getOne: () =>
                Promise.resolve({
                    data: { id: 123, title: 'lorem' },
                }),
        } as unknown) as DataProvider;

        const validateAsync = async (value, allValues) => {
            await new Promise(resolve => setTimeout(resolve, 400));

            if (value === 'ipsum') {
                return 'Already used!';
            }
            return undefined;
        };

        const { queryByDisplayValue, getByLabelText } = renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <ThemeProvider theme={theme}>
                        <Edit {...defaultEditProps}>
                            <SimpleForm>
                                <TextInput
                                    source="title"
                                    validate={validateAsync}
                                />
                            </SimpleForm>
                        </Edit>
                    </ThemeProvider>
                </DataProviderContext.Provider>
            </QueryClientProvider>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        // waitFor for the dataProvider.getOne() return
        await waitFor(() => {
            expect(queryByDisplayValue('lorem')).toBeDefined();
        });

        // change one input to enable the SaveButton (which is disabled when the form is pristine)
        fireEvent.change(getByLabelText('resources.posts.fields.title'), {
            target: { value: 'ipsum' },
        });

        expect(getByLabelText('ra.action.save')['disabled']).toEqual(true);

        // The SaveButton should be enabled again after validation
        await waitFor(() => {
            expect(getByLabelText('ra.action.save')['disabled']).toEqual(false);
        });
    });
});
