import * as React from 'react';
import expect from 'expect';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient } from 'react-query';
import {
    testDataProvider,
    useChoicesContext,
    CoreAdminContext,
    Form,
} from 'ra-core';

import { ReferenceInput } from './ReferenceInput';
import { AdminContext } from '../AdminContext';
import { SimpleForm } from '../form';
import {
    Basic,
    WithSelectInput,
    dataProviderWithAuthors,
    SelfReference,
} from './ReferenceInput.stories';

describe('<ReferenceInput />', () => {
    const defaultProps = {
        reference: 'posts',
        resource: 'comments',
        source: 'post_id',
    };

    it('should display an error if error is defined', async () => {
        jest.spyOn(console, 'error')
            .mockImplementationOnce(() => {})
            .mockImplementationOnce(() => {});

        render(
            <AdminContext
                queryClient={
                    new QueryClient({
                        defaultOptions: { queries: { retry: false } },
                    })
                }
                dataProvider={testDataProvider({
                    getList: () => Promise.reject(new Error('fetch error')),
                })}
            >
                <SimpleForm onSubmit={jest.fn()}>
                    <ReferenceInput {...defaultProps} />
                </SimpleForm>
            </AdminContext>
        );
        await waitFor(() => {
            expect(screen.queryByText('fetch error')).not.toBeNull();
        });
    });

    it('should render an AutocompleteInput using recordRepresentation by default', async () => {
        render(<Basic />);
        await screen.findByDisplayValue('Leo Tolstoy');
    });

    it('should pass the correct resource down to child component', async () => {
        const MyComponent = () => {
            const { resource } = useChoicesContext();
            return <div>{resource}</div>;
        };
        const dataProvider = testDataProvider({
            // @ts-ignore
            getList: () =>
                Promise.resolve({ data: [{ id: 1 }, { id: 2 }], total: 2 }),
        });
        render(
            <AdminContext dataProvider={dataProvider}>
                <SimpleForm onSubmit={jest.fn()}>
                    <ReferenceInput {...defaultProps}>
                        <MyComponent />
                    </ReferenceInput>
                </SimpleForm>
            </AdminContext>
        );
        await waitFor(() => {
            expect(screen.queryByText('posts')).not.toBeNull();
        });
    });

    it('should provide a ChoicesContext with all available choices', async () => {
        const Children = () => {
            const { total } = useChoicesContext();
            return <div aria-label="total">{total}</div>;
        };
        const dataProvider = testDataProvider({
            // @ts-ignore
            getList: () =>
                Promise.resolve({ data: [{ id: 1 }, { id: 2 }], total: 2 }),
        });
        render(
            <AdminContext dataProvider={dataProvider}>
                <SimpleForm onSubmit={jest.fn()}>
                    <ReferenceInput {...defaultProps}>
                        <Children />
                    </ReferenceInput>
                </SimpleForm>
            </AdminContext>
        );
        await waitFor(() => {
            expect(screen.getByLabelText('total').innerHTML).toEqual('2');
        });
    });

    it('should accept meta in queryOptions', async () => {
        const getList = jest
            .fn()
            .mockImplementationOnce(() =>
                Promise.resolve({ data: [], total: 25 })
            );
        const dataProvider = testDataProvider({ getList });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form>
                    <ReferenceInput
                        {...defaultProps}
                        queryOptions={{ meta: { foo: 'bar' } }}
                    />
                </Form>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(getList).toHaveBeenCalledWith('posts', {
                filter: {},
                pagination: { page: 1, perPage: 25 },
                sort: { field: 'id', order: 'DESC' },
                meta: { foo: 'bar' },
            });
        });
    });

    it('should use meta when fetching current value', async () => {
        const getMany = jest
            .fn()
            .mockImplementationOnce(() => Promise.resolve({ data: [] }));
        const dataProvider = testDataProvider({ getMany });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form record={{ post_id: 23 }}>
                    <ReferenceInput
                        {...defaultProps}
                        queryOptions={{ meta: { foo: 'bar' } }}
                    />
                </Form>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(getMany).toHaveBeenCalledWith('posts', {
                ids: [23],
                meta: { foo: 'bar' },
            });
        });
    });

    it('should convert empty values to null with AutocompleteInput', async () => {
        jest.spyOn(console, 'log').mockImplementationOnce(() => {});
        const dataProvider = {
            ...dataProviderWithAuthors,
            update: jest
                .fn()
                .mockImplementation((resource, params) =>
                    Promise.resolve(params)
                ),
        };
        render(<Basic dataProvider={dataProvider} />);
        await screen.findByDisplayValue('Leo Tolstoy');
        const input = screen.getByLabelText('Author') as HTMLInputElement;
        input.focus();
        screen.getByLabelText('Clear value').click();
        screen.getByLabelText('Save').click();
        await waitFor(() => {
            expect(
                (screen.getByLabelText('Save') as HTMLButtonElement).disabled
            ).toBeTruthy();
        });
        expect(dataProvider.update).toHaveBeenCalledWith(
            'books',
            expect.objectContaining({
                data: expect.objectContaining({
                    author: null,
                }),
            })
        );
    });

    it('should convert empty values to null with SelectInput', async () => {
        jest.spyOn(console, 'log').mockImplementationOnce(() => {});
        const dataProvider = {
            ...dataProviderWithAuthors,
            update: jest
                .fn()
                .mockImplementation((resource, params) =>
                    Promise.resolve(params)
                ),
        };
        render(<WithSelectInput dataProvider={dataProvider} />);
        const input = (await screen.findByDisplayValue(
            '1'
        )) as HTMLInputElement;
        fireEvent.change(input, {
            target: { value: '' },
        });
        screen.getByLabelText('Save').click();
        await waitFor(() => {
            expect(
                (screen.getByLabelText('Save') as HTMLButtonElement).disabled
            ).toBeTruthy();
        });
        expect(dataProvider.update).toHaveBeenCalledWith(
            'books',
            expect.objectContaining({
                data: expect.objectContaining({
                    author: null,
                }),
            })
        );
    });

    it('should not throw an error on save when it is a self reference and the reference is undefined', async () => {
        jest.spyOn(console, 'log').mockImplementationOnce(() => {});
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        render(<SelfReference />);
        fireEvent.click(await screen.findByLabelText('Self reference'));
        expect(await screen.findAllByRole('option')).toHaveLength(5);
        const titleInput = await screen.findByDisplayValue('War and Peace');
        fireEvent.change(titleInput, {
            target: { value: 'War and Peace 2' },
        });
        screen.getByLabelText('Save').click();
        await screen.findByText('Proust', undefined, { timeout: 5000 });
    });
});
