import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import expect from 'expect';
import {
    Form,
    MutationMode,
    required,
    testDataProvider,
    useNotificationContext,
} from 'ra-core';

import { SaveButton } from './SaveButton';
import { SimpleForm, Toolbar } from '../form';
import { Edit } from '../detail';
import {
    TextInput,
    ArrayInput,
    SimpleFormIterator,
    NumberInput,
} from '../input';
import { AdminContext } from '../AdminContext';

const invalidButtonDomProps = {
    disabled: true,
    resource: 'posts',
};

describe('<SaveButton />', () => {
    it('should render as submit type with no DOM errors', async () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <Form>
                    {' '}
                    <SaveButton {...invalidButtonDomProps} />
                </Form>
            </AdminContext>
        );

        expect(spy).not.toHaveBeenCalled();
        await waitFor(() =>
            expect(
                screen.getByLabelText('ra.action.save').getAttribute('type')
            ).toEqual('submit')
        );

        spy.mockRestore();
    });

    it('should render a disabled button', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <Form>
                    <SaveButton disabled={true} />
                </Form>
            </AdminContext>
        );
        await waitFor(() =>
            expect(screen.getByLabelText('ra.action.save')['disabled']).toEqual(
                true
            )
        );
    });

    it('should render as submit type by default', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <Form>
                    <SaveButton />
                </Form>
            </AdminContext>
        );
        await waitFor(() =>
            expect(
                screen.getByLabelText('ra.action.save').getAttribute('type')
            ).toEqual('submit')
        );
    });

    it('should render as button type when type prop is "button"', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <Form>
                    <SaveButton type="button" />
                </Form>
            </AdminContext>
        );

        await waitFor(() =>
            expect(
                screen.getByLabelText('ra.action.save').getAttribute('type')
            ).toEqual('button')
        );
    });

    it('should trigger submit action when clicked if no saving is in progress', async () => {
        const onSubmit = jest.fn();
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <Form onSubmit={onSubmit}>
                    <SaveButton alwaysEnable />
                </Form>
            </AdminContext>
        );

        fireEvent.click(screen.getByLabelText('ra.action.save'));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalled();
        });
    });

    it('should not trigger submit action when clicked if saving is in progress', async () => {
        const onSubmit = jest.fn();

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <Form onSubmit={onSubmit}>
                    <SaveButton />
                </Form>
            </AdminContext>
        );

        fireEvent.click(screen.getByLabelText('ra.action.save'));
        await waitFor(() => {
            expect(onSubmit).not.toHaveBeenCalled();
        });
    });

    it('should allow to override the onSuccess side effects', async () => {
        const dataProvider = testDataProvider({
            getOne: () =>
                // @ts-ignore
                Promise.resolve({
                    data: { id: 123, title: 'lorem' },
                }),
            update: (_, { data }) =>
                // @ts-ignore
                Promise.resolve({ data }),
        });
        const onSuccess = jest.fn();
        const EditToolbar = props => (
            <Toolbar {...props}>
                <SaveButton mutationOptions={{ onSuccess }} type="button" />
            </Toolbar>
        );
        render(
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
            expect(screen.queryByDisplayValue('lorem')).toBeDefined();
        });
        // change one input to enable the SaveButton (which is disabled when the form is pristine)
        fireEvent.change(
            screen.getByLabelText('resources.posts.fields.title'),
            {
                target: { value: 'ipsum' },
            }
        );
        fireEvent.click(screen.getByText('ra.action.save'));
        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalledWith(
                {
                    id: 123,
                    title: 'ipsum',
                },
                {
                    id: '123',
                    data: { id: 123, title: 'ipsum' },
                    resource: 'posts',
                },
                { snapshot: [] }
            );
        });
    });

    it('should allow to override the onError side effects', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const dataProvider = testDataProvider({
            getOne: () =>
                // @ts-ignore
                Promise.resolve({
                    data: { id: 123, title: 'lorem' },
                }),
            update: () => Promise.reject({ message: 'not good' }),
        });
        const onError = jest.fn();
        const EditToolbar = props => (
            <Toolbar {...props}>
                <SaveButton mutationOptions={{ onError }} type="button" />
            </Toolbar>
        );
        render(
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
            expect(screen.queryByDisplayValue('lorem')).toBeDefined();
        });
        // change one input to enable the SaveButton (which is disabled when the form is pristine)
        fireEvent.change(
            screen.getByLabelText('resources.posts.fields.title'),
            {
                target: { value: 'ipsum' },
            }
        );
        fireEvent.click(screen.getByText('ra.action.save'));
        await waitFor(() => {
            expect(onError).toHaveBeenCalledWith(
                {
                    message: 'not good',
                },
                {
                    id: '123',
                    data: { id: 123, title: 'ipsum' },
                    resource: 'posts',
                },
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
                // @ts-ignore
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
                <SaveButton transform={transform} type="button" />
            </Toolbar>
        );
        render(
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
            expect(screen.queryByDisplayValue('lorem')).toBeDefined();
        });
        // change one input to enable the SaveButton (which is disabled when the form is pristine)
        fireEvent.change(
            screen.getByLabelText('resources.posts.fields.title'),
            {
                target: { value: 'ipsum' },
            }
        );
        fireEvent.click(screen.getByText('ra.action.save'));
        await waitFor(() => {
            expect(transform).toHaveBeenCalledWith(
                { id: 123, title: 'ipsum' },
                { previousData: { id: 123, title: 'lorem' } }
            );
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
                // @ts-ignore
                Promise.resolve({
                    data: { id: 123, title: 'lorem' },
                }),
        });

        const validateAsync = async value => {
            await new Promise(resolve => setTimeout(resolve, 250));
            if (value === 'ipsum') {
                return 'Already used!';
            }
            return undefined;
        };

        render(
            <AdminContext dataProvider={dataProvider}>
                <Form mode="onChange">
                    <TextInput
                        label="title"
                        source="title"
                        validate={validateAsync}
                    />
                    <SaveButton />
                </Form>
            </AdminContext>
        );
        // waitFor for the dataProvider.getOne() return
        await waitFor(() => {
            expect(screen.queryByDisplayValue('lorem')).toBeDefined();
        });

        // change one input to enable the SaveButton (which is disabled when the form is pristine)
        fireEvent.change(screen.getByLabelText('title'), {
            target: { value: 'ipsum' },
        });

        await waitFor(() => {
            expect(screen.getByLabelText('ra.action.save')['disabled']).toEqual(
                true
            );
        });
        // The SaveButton should be enabled again after validation
        await waitFor(() => {
            expect(screen.getByLabelText('ra.action.save')['disabled']).toEqual(
                false
            );
        });
    });

    it('should display a notification on save when invalid and is not of type submit', async () => {
        const Notification = () => {
            const { notifications } = useNotificationContext();
            return notifications.length > 0 ? (
                <div>{notifications[0].message}</div>
            ) : null;
        };

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <>
                    <Form onSubmit={jest.fn()}>
                        <TextInput source="name" validate={required()} />
                        <SaveButton
                            alwaysEnable
                            type="button"
                            mutationOptions={{
                                onSuccess: jest.fn(),
                            }}
                        />
                    </Form>
                    <Notification />
                </>
            </AdminContext>
        );

        fireEvent.click(screen.getByText('ra.action.save'));
        await waitFor(() => {
            screen.getByText('ra.message.invalid_form');
        });
    });

    it('should render enabled if alwaysEnable is true', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <Form>
                    <SaveButton alwaysEnable={true} />
                </Form>
            </AdminContext>
        );
        await waitFor(() =>
            expect(screen.getByLabelText('ra.action.save')['disabled']).toEqual(
                false
            )
        );
    });

    it('should not be enabled if no inputs have changed', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    resource="myresource"
                    onSubmit={jest.fn}
                    defaultValues={{
                        test: 'test',
                    }}
                >
                    <TextInput source="test" />
                    <ArrayInput resource="foo" source="arr">
                        <SimpleFormIterator>
                            <NumberInput source="id" />
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            </AdminContext>
        );

        const testInput = screen.getByLabelText(
            'resources.myresource.fields.test'
        );
        fireEvent.focus(testInput);
        fireEvent.blur(testInput);

        await waitFor(() =>
            expect(screen.getByLabelText('ra.action.save')['disabled']).toEqual(
                true
            )
        );
    });
});
