import { render, cleanup, wait, fireEvent } from '@testing-library/react';
import * as React from 'react';
import expect from 'expect';
import {
    DataProvider,
    DataProviderContext,
    renderWithRedux,
    TestContext,
} from 'ra-core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import DeleteWithConfirmButton from './DeleteWithConfirmButton';
import { Toolbar, SimpleForm } from '../form';
import { Edit } from '../detail';
import { TextInput } from '../input';

const theme = createMuiTheme();

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
    undoable: false,
};

describe('<DeleteWithConfirmButton />', () => {
    afterEach(cleanup);

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
                    <DeleteWithConfirmButton {...invalidButtonDomProps} />
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
        location: {},
        match: {},
        undoable: false,
    };

    it('should allow to override the onSuccess side effects', async () => {
        const dataProvider = ({
            getOne: () =>
                Promise.resolve({
                    data: { id: 123, title: 'lorem' },
                }),
            delete: jest.fn().mockResolvedValueOnce({ data: { id: 123 } }),
        } as unknown) as DataProvider;
        const onSuccess = jest.fn();
        const EditToolbar = props => (
            <Toolbar {...props}>
                <DeleteWithConfirmButton onSuccess={onSuccess} />
            </Toolbar>
        );
        const {
            queryByDisplayValue,
            getByLabelText,
            getByText,
        } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <DataProviderContext.Provider value={dataProvider}>
                    <Edit {...defaultEditProps}>
                        <SimpleForm toolbar={<EditToolbar />}>
                            <TextInput source="title" />
                        </SimpleForm>
                    </Edit>
                </DataProviderContext.Provider>
            </ThemeProvider>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        // wait for the dataProvider.getOne() return
        await wait(() => {
            expect(queryByDisplayValue('lorem')).not.toBeNull();
        });
        fireEvent.click(getByLabelText('ra.action.delete'));
        fireEvent.click(getByText('ra.action.confirm'));
        await wait(() => {
            expect(dataProvider.delete).toHaveBeenCalled();
            expect(onSuccess).toHaveBeenCalledWith({
                data: { id: 123 },
            });
        });
    });

    it('should allow to override the onFailure side effects', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        const dataProvider = ({
            getOne: () =>
                Promise.resolve({
                    data: { id: 123, title: 'lorem' },
                }),
            delete: jest.fn().mockRejectedValueOnce({ message: 'not good' }),
        } as unknown) as DataProvider;
        const onFailure = jest.fn();
        const EditToolbar = props => (
            <Toolbar {...props}>
                <DeleteWithConfirmButton onFailure={onFailure} />
            </Toolbar>
        );
        const {
            queryByDisplayValue,
            getByLabelText,
            getByText,
        } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <DataProviderContext.Provider value={dataProvider}>
                    <Edit {...defaultEditProps}>
                        <SimpleForm toolbar={<EditToolbar />}>
                            <TextInput source="title" />
                        </SimpleForm>
                    </Edit>
                </DataProviderContext.Provider>
            </ThemeProvider>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        // wait for the dataProvider.getOne() return
        await wait(() => {
            expect(queryByDisplayValue('lorem')).toBeDefined();
        });
        fireEvent.click(getByLabelText('ra.action.delete'));
        fireEvent.click(getByText('ra.action.confirm'));
        await wait(() => {
            expect(dataProvider.delete).toHaveBeenCalled();
            expect(onFailure).toHaveBeenCalledWith({
                message: 'not good',
            });
        });
    });
});
