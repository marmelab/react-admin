import * as React from 'react';
import {
    render,
    screen,
    waitFor,
    within,
    fireEvent,
} from '@testing-library/react';
import {
    testDataProvider,
    useChoicesContext,
    CoreAdminContext,
    Form,
    useInput,
    ResourceContextProvider,
} from 'ra-core';
import { QueryClient } from '@tanstack/react-query';

import { AdminContext } from '../AdminContext';
import { SimpleForm } from '../form';
import { DatagridInput } from './DatagridInput';
import { TextField } from '../field';
import { ReferenceArrayInput } from './ReferenceArrayInput';
import { SelectArrayInput } from './SelectArrayInput';
import { DifferentIdTypes } from './ReferenceArrayInput.stories';

describe('<ReferenceArrayInput />', () => {
    const defaultProps = {
        reference: 'tags',
        source: 'tag_ids',
    };

    afterEach(async () => {
        // wait for the getManyAggregate batch to resolve
        await waitFor(() => new Promise(resolve => setTimeout(resolve, 0)));
    });

    it('should display an error if error is defined', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
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
                <ResourceContextProvider value="posts">
                    <SimpleForm onSubmit={jest.fn()}>
                        <ReferenceArrayInput {...defaultProps}>
                            <SelectArrayInput optionText="name" />
                        </ReferenceArrayInput>
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        await waitFor(() => {
            expect(screen.queryByText('fetch error')).not.toBeNull();
        });
    });
    it('should pass the correct resource down to child component', async () => {
        const MyComponent = () => {
            const { resource } = useChoicesContext();
            return <div>{resource}</div>;
        };
        render(
            <AdminContext>
                <ResourceContextProvider value="posts">
                    <SimpleForm onSubmit={jest.fn()}>
                        <ReferenceArrayInput {...defaultProps}>
                            <MyComponent />
                        </ReferenceArrayInput>
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        await waitFor(() => {
            expect(screen.queryByText('tags')).not.toBeNull();
        });
    });

    it('should provide a ChoicesContext with all available choices', async () => {
        const Children = () => {
            const { total } = useChoicesContext({});
            return <div aria-label="total">{total}</div>;
        };
        const dataProvider = testDataProvider({
            getList: () =>
                // @ts-ignore
                Promise.resolve({
                    data: [{ id: 1 }, { id: 2 }],
                    total: 2,
                }),
        });
        render(
            <AdminContext dataProvider={dataProvider}>
                <ResourceContextProvider value="posts">
                    <SimpleForm onSubmit={jest.fn()}>
                        <ReferenceArrayInput {...defaultProps}>
                            <Children />
                        </ReferenceArrayInput>
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        await waitFor(() => {
            expect(screen.getByLabelText('total').innerHTML).toEqual('2');
        });
    });

    it('should apply default values', async () => {
        const MyComponent = () => {
            useInput({ source: 'tag_ids', defaultValue: [1, 2] });
            const { allChoices } = useChoicesContext();
            return <div>{allChoices?.map(item => item.id).join()}</div>;
        };
        const dataProvider = testDataProvider({
            getMany: jest
                .fn()
                .mockResolvedValue({ data: [{ id: 1 }, { id: 2 }] }),
        });

        render(
            <AdminContext dataProvider={dataProvider}>
                <ResourceContextProvider value="posts">
                    <SimpleForm onSubmit={jest.fn()}>
                        <ReferenceArrayInput {...defaultProps}>
                            <MyComponent />
                        </ReferenceArrayInput>
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(screen.queryByText('1,2')).not.toBeNull();
        });
    });

    it('should allow to use a Datagrid', async () => {
        const dataProvider = testDataProvider({
            getList: () =>
                // @ts-ignore
                Promise.resolve({
                    data: [
                        { id: 5, name: 'test1' },
                        { id: 6, name: 'test2' },
                    ],
                    total: 2,
                }),
            getMany: () =>
                // @ts-ignore
                Promise.resolve({
                    data: [{ id: 5, name: 'test1' }],
                }),
        });
        render(
            <AdminContext dataProvider={dataProvider}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={jest.fn()}
                        defaultValues={{ tag_ids: [5] }}
                    >
                        <ReferenceArrayInput reference="tags" source="tag_ids">
                            <DatagridInput>
                                <TextField source="name" />
                            </DatagridInput>
                        </ReferenceArrayInput>
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        await waitFor(() => {
            screen.getByText('test1');
            screen.getByText('test2');
        });

        const getCheckbox1 = () =>
            within(screen.queryByText('test1').closest('tr'))
                .getByLabelText('ra.action.select_row')
                .querySelector('input');
        const getCheckbox2 = () =>
            within(screen.queryByText('test2').closest('tr'))
                .getByLabelText('ra.action.select_row')
                .querySelector('input');
        const getCheckboxAll = () =>
            screen.getByLabelText('ra.action.select_all');
        await waitFor(() => {
            expect(getCheckbox1()?.checked).toEqual(true);
            expect(getCheckbox2()?.checked).toEqual(false);
        });

        fireEvent.click(getCheckbox2());

        await waitFor(() => {
            expect(getCheckbox1()?.checked).toEqual(true);
            expect(getCheckbox2()?.checked).toEqual(true);
            expect(getCheckboxAll().checked).toEqual(true);
        });

        fireEvent.click(getCheckboxAll());

        await waitFor(() => {
            expect(getCheckbox1()?.checked).toEqual(false);
            expect(getCheckbox2()?.checked).toEqual(false);
            expect(getCheckboxAll().checked).toEqual(false);
        });

        fireEvent.click(getCheckboxAll());

        await waitFor(() => {
            expect(getCheckbox1()?.checked).toEqual(true);
            expect(getCheckbox2()?.checked).toEqual(true);
            expect(getCheckboxAll().checked).toEqual(true);
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
                    <ReferenceArrayInput
                        {...defaultProps}
                        queryOptions={{ meta: { foo: 'bar' } }}
                    >
                        <SelectArrayInput optionText="name" />
                    </ReferenceArrayInput>
                </Form>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(getList).toHaveBeenCalledWith('tags', {
                filter: {},
                pagination: { page: 1, perPage: 25 },
                sort: { field: 'id', order: 'DESC' },
                meta: { foo: 'bar' },
                signal: undefined,
            });
        });
    });

    it('should support different types of ids', async () => {
        render(<DifferentIdTypes />);
        await screen.findByText('artist_1', {
            selector: 'div.MuiChip-root .MuiChip-label',
        });
        expect(
            screen.queryByText('artist_2', {
                selector: 'div.MuiChip-root .MuiChip-label',
            })
        ).not.toBeNull();
        expect(
            screen.queryByText('artist_3', { selector: 'div.MuiChip-root' })
        ).toBeNull();
    });

    it('should unselect a value when types of ids are different', async () => {
        render(<DifferentIdTypes />);

        const chip1 = await screen.findByText('artist_1', {
            selector: '.MuiChip-label',
        });
        const chip2 = await screen.findByText('artist_2', {
            selector: '.MuiChip-label',
        });

        if (chip2.nextSibling) fireEvent.click(chip2.nextSibling);
        expect(
            screen.queryByText('artist_2', {
                selector: '.MuiChip-label',
            })
        ).toBeNull();

        if (chip1.nextSibling) fireEvent.click(chip1.nextSibling);
        expect(
            screen.queryByText('artist_1', {
                selector: '.MuiChip-label',
            })
        ).toBeNull();
    });
});
