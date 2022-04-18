import * as React from 'react';
import {
    render,
    screen,
    waitFor,
    within,
    fireEvent,
} from '@testing-library/react';
import { testDataProvider, useChoicesContext } from 'ra-core';

import { AdminContext } from '../AdminContext';
import { SimpleForm } from '../form';
import { DatagridInput } from './DatagridInput';
import { TextField } from '../field';
import { ReferenceArrayInput } from './ReferenceArrayInput';
import { QueryClient } from 'react-query';

describe('<ReferenceArrayInput />', () => {
    const defaultProps = {
        reference: 'tags',
        resource: 'posts',
        source: 'tag_ids',
    };

    afterEach(async () => {
        // wait for the getManyAggregate batch to resolve
        await waitFor(() => new Promise(resolve => setTimeout(resolve, 0)));
    });

    it('should display an error if error is defined', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const MyComponent = () => <span id="mycomponent" />;
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
                    <ReferenceArrayInput {...defaultProps}>
                        <MyComponent />
                    </ReferenceArrayInput>
                </SimpleForm>
            </AdminContext>
        );
        await waitFor(() => {
            expect(screen.queryByDisplayValue('fetch error')).not.toBeNull();
        });
    });
    it('should pass the correct resource down to child component', async () => {
        const MyComponent = () => {
            const { resource } = useChoicesContext();
            return <div>{resource}</div>;
        };
        render(
            <AdminContext>
                <SimpleForm onSubmit={jest.fn()}>
                    <ReferenceArrayInput {...defaultProps}>
                        <MyComponent />
                    </ReferenceArrayInput>
                </SimpleForm>
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
                Promise.resolve({ data: [{ id: 1 }, { id: 2 }], total: 2 }),
        });
        render(
            <AdminContext dataProvider={dataProvider}>
                <SimpleForm onSubmit={jest.fn()}>
                    <ReferenceArrayInput {...defaultProps}>
                        <Children />
                    </ReferenceArrayInput>
                </SimpleForm>
            </AdminContext>
        );
        await waitFor(() => {
            expect(screen.getByLabelText('total').innerHTML).toEqual('2');
        });
    });

    it('should allow to use a Datagrid', async () => {
        const dataProvider = testDataProvider({
            getList: () =>
                Promise.resolve({
                    data: [
                        { id: 5, name: 'test1' },
                        { id: 6, name: 'test2' },
                    ],
                    total: 2,
                }),
            getMany: () =>
                Promise.resolve({
                    data: [{ id: 5, name: 'test1' }],
                }),
        });
        render(
            <AdminContext dataProvider={dataProvider}>
                <SimpleForm
                    onSubmit={jest.fn()}
                    defaultValues={{ tag_ids: [5] }}
                >
                    <ReferenceArrayInput
                        reference="tags"
                        resource="posts"
                        source="tag_ids"
                    >
                        <DatagridInput>
                            <TextField source="name" />
                        </DatagridInput>
                    </ReferenceArrayInput>
                </SimpleForm>
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
            screen
                .getByLabelText('ra.action.select_all')
                .querySelector('input');

        await waitFor(() => {
            expect(getCheckbox1().checked).toEqual(true);
            expect(getCheckbox2().checked).toEqual(false);
        });

        fireEvent.click(getCheckbox2());

        await waitFor(() => {
            expect(getCheckbox1().checked).toEqual(true);
            expect(getCheckbox2().checked).toEqual(true);
            expect(getCheckboxAll().checked).toEqual(true);
        });

        fireEvent.click(getCheckboxAll());

        await waitFor(() => {
            expect(getCheckbox1().checked).toEqual(false);
            expect(getCheckbox2().checked).toEqual(false);
            expect(getCheckboxAll().checked).toEqual(false);
        });

        fireEvent.click(getCheckboxAll());

        await waitFor(() => {
            expect(getCheckbox1().checked).toEqual(true);
            expect(getCheckbox2().checked).toEqual(true);
            expect(getCheckboxAll().checked).toEqual(true);
        });
    });
});
