import * as React from 'react';
import expect from 'expect';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';

import { useReferenceArrayFieldController } from './useReferenceArrayFieldController';
import { testDataProvider } from '../../dataProvider';
import { CoreAdminContext, ResourceContextProvider } from '../../core';
import { memoryStore } from '../../store';
import { Basic } from './useReferenceArrayFieldController.stories';

const ReferenceArrayFieldController = props => {
    const { children, ...rest } = props;
    const controllerProps = useReferenceArrayFieldController({
        sort: {
            field: 'id',
            order: 'ASC',
        },
        ...rest,
    });
    return children(controllerProps);
};

describe('<useReferenceArrayFieldController />', () => {
    const dataProvider = testDataProvider({
        getMany: jest.fn().mockResolvedValue({
            data: [
                { id: 1, title: 'bar1' },
                { id: 2, title: 'bar2' },
            ],
        }),
    });

    afterEach(async () => {
        // @ts-ignore
        dataProvider.getMany.mockClear();
        // wait for the getManyAggregate batch to resolve
        await waitFor(() => new Promise(resolve => setTimeout(resolve, 0)));
    });

    it('should set the isLoading prop to true when related records are not yet fetched', () => {
        const children = jest.fn().mockReturnValue('child');
        render(
            <CoreAdminContext
                dataProvider={testDataProvider({
                    getMany: () => new Promise(() => {}),
                })}
            >
                <ReferenceArrayFieldController
                    resource="foo"
                    reference="bar"
                    record={{ id: 1, barIds: [1, 2] }}
                    source="barIds"
                >
                    {children}
                </ReferenceArrayFieldController>
            </CoreAdminContext>
        );
        expect(children).toHaveBeenCalledWith(
            expect.objectContaining({
                sort: { field: 'id', order: 'ASC' },
                isFetching: true,
                isLoading: true,
                data: undefined,
                error: null,
            })
        );
    });

    it('should call dataProvider.getMAny on mount and return the result in the data prop', async () => {
        const children = jest.fn().mockReturnValue('child');
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ReferenceArrayFieldController
                    resource="foo"
                    reference="bar"
                    record={{ id: 1, barIds: [1, 2] }}
                    source="barIds"
                >
                    {children}
                </ReferenceArrayFieldController>
            </CoreAdminContext>
        );
        await waitFor(() =>
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1)
        );
        expect(children).toHaveBeenCalledWith(
            expect.objectContaining({
                sort: { field: 'id', order: 'ASC' },
                isFetching: false,
                isLoading: false,
                data: [
                    { id: 1, title: 'bar1' },
                    { id: 2, title: 'bar2' },
                ],
                error: null,
            })
        );
    });

    it('should filter string data based on the filter props', async () => {
        const children = jest.fn().mockReturnValue('child');
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ReferenceArrayFieldController
                    resource="foo"
                    reference="bar"
                    record={{ id: 1, barIds: [1, 2] }}
                    filter={{ title: 'bar1' }}
                    source="barIds"
                >
                    {children}
                </ReferenceArrayFieldController>
            </CoreAdminContext>
        );
        await waitFor(() =>
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1)
        );
        expect(children).toHaveBeenCalledWith(
            expect.objectContaining({
                sort: { field: 'id', order: 'ASC' },
                isFetching: false,
                isLoading: false,
                data: [{ id: 1, title: 'bar1' }],
                error: null,
            })
        );
    });

    it('should filter array data based on the filter props', async () => {
        const children = jest.fn().mockReturnValue('child');
        const dataProvider = testDataProvider({
            getMany: jest.fn().mockResolvedValue({
                data: [
                    { id: 1, items: ['one', 'two'] },
                    { id: 2, items: ['three'] },
                    { id: 3, items: 'four' },
                    { id: 4, items: ['five'] },
                ],
            }),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ReferenceArrayFieldController
                    resource="foo"
                    reference="bar"
                    record={{ id: 1, barIds: [1, 2, 3, 4] }}
                    filter={{ items: ['two', 'four', 'five'] }}
                    source="barIds"
                >
                    {children}
                </ReferenceArrayFieldController>
            </CoreAdminContext>
        );
        await waitFor(() =>
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1)
        );
        expect(children).toHaveBeenCalledWith(
            expect.objectContaining({
                sort: { field: 'id', order: 'ASC' },
                isFetching: false,
                isLoading: false,
                data: [
                    { id: 1, items: ['one', 'two'] },
                    { id: 3, items: 'four' },
                    { id: 4, items: ['five'] },
                ],
                error: null,
            })
        );
    });

    describe('onSelectAll', () => {
        it('should select all records', async () => {
            render(<Basic />);
            await waitFor(() => {
                expect(screen.getByTestId('selected_ids').textContent).toBe(
                    'Selected ids: []'
                );
            });
            fireEvent.click(await screen.findByText('Select All'));
            await waitFor(() => {
                expect(screen.getByTestId('selected_ids').textContent).toBe(
                    'Selected ids: [1,2]'
                );
            });
        });

        it('should select all records even though some records are already selected', async () => {
            render(<Basic />);
            await waitFor(() => {
                expect(screen.getByTestId('selected_ids').textContent).toBe(
                    'Selected ids: []'
                );
            });
            fireEvent.click(await screen.findByTestId('checkbox-1'));
            await waitFor(() => {
                expect(screen.getByTestId('selected_ids').textContent).toBe(
                    'Selected ids: [1]'
                );
            });
            fireEvent.click(await screen.findByText('Select All'));
            await waitFor(() => {
                expect(screen.getByTestId('selected_ids').textContent).toBe(
                    'Selected ids: [1,2]'
                );
            });
        });
    });

    it('should keep its selection specific to the record', async () => {
        const store = memoryStore();
        render(
            <CoreAdminContext dataProvider={dataProvider} store={store}>
                <ResourceContextProvider value="foo">
                    {[1, 2].map(id => (
                        <ReferenceArrayFieldController
                            key={id}
                            reference="bar"
                            record={{ id, barIds: [1, 2] }}
                            source="barIds"
                        >
                            {({ onToggleItem, selectedIds }) => (
                                <button onClick={() => onToggleItem(1)}>
                                    Record {id} selection:{' '}
                                    {JSON.stringify(selectedIds)}
                                </button>
                            )}
                        </ReferenceArrayFieldController>
                    ))}
                </ResourceContextProvider>
            </CoreAdminContext>
        );
        fireEvent.click(screen.getByText('Record 1 selection: []'));
        await screen.findByText('Record 1 selection: [1]');
        screen.getByText('Record 2 selection: []');
        expect(store.getItem('foo.selectedIds')).toBeUndefined();
        expect(store.getItem('bar.selectedIds')).toBeUndefined();
    });

    it('should unselect the records that no longer exist', async () => {
        const bars = [
            { id: 1, title: 'bar1' },
            { id: 2, title: 'bar2' },
        ];
        render(
            <CoreAdminContext
                dataProvider={testDataProvider({
                    getMany: jest.fn(() =>
                        Promise.resolve({ data: [...bars] })
                    ),
                })}
            >
                <ResourceContextProvider value="foo">
                    <ReferenceArrayFieldController
                        reference="bar"
                        record={{ id: 1, barIds: [1, 2] }}
                        source="barIds"
                    >
                        {({ onToggleItem, refetch, selectedIds }) => (
                            <>
                                <button onClick={() => onToggleItem(1)}>
                                    Select 1
                                </button>
                                <button onClick={() => refetch()}>
                                    Refetch
                                </button>
                                <p>Selection: {JSON.stringify(selectedIds)}</p>
                            </>
                        )}
                    </ReferenceArrayFieldController>
                </ResourceContextProvider>
            </CoreAdminContext>
        );
        fireEvent.click(screen.getByText('Select 1'));
        await screen.findByText('Selection: [1]');
        bars.shift();
        fireEvent.click(screen.getByText('Refetch'));
        await screen.findByText('Selection: []');
    });
});
