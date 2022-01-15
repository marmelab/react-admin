import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import expect from 'expect';
import {
    CoreAdminContext,
    FormWithRedirect,
    MutationMode,
    required,
    testDataProvider,
    useNotificationContext,
} from 'ra-core';

import { SaveButton } from './SaveButton';
import { SimpleForm, Toolbar } from '../form';
import { Edit } from '../detail';
import { TextInput } from '../input';
import { AdminContext } from '../AdminContext';

const invalidButtonDomProps = {
    disabled: true,
    record: { id: 123, foo: 'bar' },
    resource: 'posts',
    submitOnEnter: true,
    mutationMode: 'pessimistic' as MutationMode,
};

describe('<SaveButton />', () => {
    it('should render as submit type with no DOM errors', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const { getByLabelText } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    render={() => <SaveButton {...invalidButtonDomProps} />}
                />
            </AdminContext>
        );

        expect(spy).not.toHaveBeenCalled();
        expect(getByLabelText('ra.action.save').getAttribute('type')).toEqual(
            'submit'
        );

        spy.mockRestore();
    });

    it('should render a disabled button', () => {
        const { getByLabelText } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    render={() => <SaveButton disabled={true} />}
                />
            </AdminContext>
        );
        expect(getByLabelText('ra.action.save')['disabled']).toEqual(true);
    });

    it('should render as submit type when submitOnEnter is true', () => {
        const { getByLabelText } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect render={() => <SaveButton submitOnEnter />} />
            </AdminContext>
        );
        expect(getByLabelText('ra.action.save').getAttribute('type')).toEqual(
            'submit'
        );
    });

    it('should render as button type when submitOnEnter is false', () => {
        const { getByLabelText } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    render={() => <SaveButton submitOnEnter={false} />}
                />
            </AdminContext>
        );

        expect(getByLabelText('ra.action.save').getAttribute('type')).toEqual(
            'button'
        );
    });

    it('should trigger submit action when clicked if no saving is in progress', async () => {
        const onSubmit = jest.fn();
        const { getByLabelText } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    onSubmit={onSubmit}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <SaveButton submitOnEnter />
                        </form>
                    )}
                />
            </AdminContext>
        );

        fireEvent.click(getByLabelText('ra.action.save'));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalled();
        });
    });

    it('should not trigger submit action when clicked if saving is in progress', () => {
        const onSubmit = jest.fn();

        const { getByLabelText } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    onSubmit={onSubmit}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <SaveButton saving submitOnEnter />
                        </form>
                    )}
                />
            </AdminContext>
        );

        fireEvent.click(getByLabelText('ra.action.save'));
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should allow to override the onSuccess side effects', async () => {
        const dataProvider = testDataProvider({
            getOne: () =>
                Promise.resolve({
                    data: { id: 123, title: 'lorem' },
                }),
            update: (_, { data }) => Promise.resolve({ data }),
        });
        const onSuccess = jest.fn();
        const EditToolbar = props => (
            <Toolbar {...props}>
                <SaveButton mutationOptions={{ onSuccess }} />
            </Toolbar>
        );
        const { queryByDisplayValue, getByLabelText, getByText } = render(
            <AdminContext dataProvider={dataProvider}>
                <Edit {...defaultEditProps}>
                    <SimpleForm toolbar={<EditToolbar />}>
                        <TextInput source="title" />
                    </SimpleForm>
                </Edit>
            </AdminContext>
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

    it('should allow to override the onError side effects', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        const dataProvider = testDataProvider({
            getOne: () =>
                Promise.resolve({
                    data: { id: 123, title: 'lorem' },
                }),
            update: () => Promise.reject({ message: 'not good' }),
        });
        const onError = jest.fn();
        const EditToolbar = props => (
            <Toolbar {...props}>
                <SaveButton mutationOptions={{ onError }} />
            </Toolbar>
        );
        const { queryByDisplayValue, getByLabelText, getByText } = render(
            <AdminContext dataProvider={dataProvider}>
                <Edit {...defaultEditProps}>
                    <SimpleForm toolbar={<EditToolbar />}>
                        <TextInput source="title" />
                    </SimpleForm>
                </Edit>
            </AdminContext>
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
            expect(onError).toHaveBeenCalledWith(
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
        const dataProvider = testDataProvider({
            getOne: () =>
                Promise.resolve({
                    data: { id: 123, title: 'lorem' },
                }),
            update,
        });
        const transform = jest.fn().mockImplementationOnce(data => ({
            ...data,
            transformed: true,
        }));
        const EditToolbar = props => (
            <Toolbar {...props}>
                <SaveButton transform={transform} />
            </Toolbar>
        );
        const { queryByDisplayValue, getByLabelText, getByText } = render(
            <AdminContext dataProvider={dataProvider}>
                <Edit {...defaultEditProps}>
                    <SimpleForm toolbar={<EditToolbar />}>
                        <TextInput source="title" />
                    </SimpleForm>
                </Edit>
            </AdminContext>
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
        const dataProvider = testDataProvider({
            getOne: () =>
                Promise.resolve({
                    data: { id: 123, title: 'lorem' },
                }),
        });

        const validateAsync = async (value, allValues) => {
            await new Promise(resolve => setTimeout(resolve, 250));
            if (value === 'ipsum') {
                return 'Already used!';
            }
            return undefined;
        };

        const { queryByDisplayValue, getByLabelText } = render(
            <AdminContext dataProvider={dataProvider}>
                <Edit {...defaultEditProps}>
                    <SimpleForm mode="onChange">
                        <TextInput source="title" validate={validateAsync} />
                    </SimpleForm>
                </Edit>
            </AdminContext>
        );
        // waitFor for the dataProvider.getOne() return
        await waitFor(() => {
            expect(queryByDisplayValue('lorem')).toBeDefined();
        });

        // change one input to enable the SaveButton (which is disabled when the form is pristine)
        fireEvent.change(getByLabelText('resources.posts.fields.title'), {
            target: { value: 'ipsum' },
        });

        await waitFor(() => {
            // console.log(getByLabelText('ra.action.save'));
            expect(getByLabelText('ra.action.save')['disabled']).toEqual(true);
        });
        // The SaveButton should be enabled again after validation
        await waitFor(() => {
            expect(getByLabelText('ra.action.save')['disabled']).toEqual(false);
        });
    });

    it('Displays a notification on save when invalid and is not a submit', async () => {
        const Notification = () => {
            const { notifications } = useNotificationContext();
            return notifications.length > 0 ? (
                <div>{notifications[0].message}</div>
            ) : null;
        };

        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <>
                    <FormWithRedirect
                        onSubmit={jest.fn()}
                        render={({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <TextInput
                                    source="name"
                                    validate={required()}
                                />
                                <SaveButton
                                    mutationOptions={{
                                        onSuccess: jest.fn(),
                                    }}
                                />
                            </form>
                        )}
                    />
                    <Notification />
                </>
            </CoreAdminContext>
        );

        fireEvent.click(screen.getByText('ra.action.save'));
        await waitFor(() => {
            screen.getByText('ra.message.invalid_form');
        });
    });
});
