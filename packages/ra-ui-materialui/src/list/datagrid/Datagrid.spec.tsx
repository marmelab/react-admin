import * as React from 'react';
import { fireEvent } from '@testing-library/react';
import { ListContextProvider } from 'ra-core';
import { renderWithRedux } from 'ra-test';
import Datagrid from './Datagrid';

const TitleField = ({ record }: any): JSX.Element => (
    <span>{record.title}</span>
);

describe('<Datagrid />', () => {
    const defaultData = {
        1: { id: 1, title: 'title 1' },
        2: { id: 2, title: 'title 2' },
        3: { id: 3, title: 'title 3' },
        4: { id: 4, title: 'title 4' },
    };

    const contextValue = {
        resource: 'posts',
        basePath: '',
        data: defaultData,
        ids: [1, 2, 3, 4],
        loaded: true,
        loading: false,
        selectedIds: [],
        currentSort: { field: 'title', order: 'ASC' },
        onToggleItem: jest.fn(),
        onSelect: jest.fn(),
    };

    afterEach(() => {
        contextValue.onToggleItem.mockClear();
        contextValue.onSelect.mockClear();
    });

    it('should call onToggleItem when the shift key is not pressed', () => {
        const { queryAllByRole } = renderWithRedux(
            <ListContextProvider value={contextValue}>
                <Datagrid hasBulkActions>
                    <TitleField />
                </Datagrid>
            </ListContextProvider>
        );
        fireEvent.click(queryAllByRole('checkbox')[1]);
        expect(contextValue.onToggleItem).toHaveBeenCalledWith(1);
        expect(contextValue.onSelect).toHaveBeenCalledTimes(0);
    });

    it('should display the correct empty component', () => {
        const Empty = () => <div>No records to show</div>;

        const emptyData = {
            ...contextValue,
            data: [],
            ids: [],
        };

        const { queryByText } = renderWithRedux(
            <ListContextProvider value={emptyData}>
                <Datagrid empty={<Empty />} hasBulkActions>
                    <TitleField />
                </Datagrid>
            </ListContextProvider>
        );

        expect(queryByText('No records to show')).toBeTruthy();
    });

    describe('selecting items with the shift key', () => {
        it('should call onSelect with the correct ids when the last selection is after the first', () => {
            const Test = ({ selectedIds = [] }) => (
                <ListContextProvider value={{ ...contextValue, selectedIds }}>
                    <Datagrid hasBulkActions>
                        <TitleField />
                    </Datagrid>
                </ListContextProvider>
            );
            const { queryAllByRole, rerender } = renderWithRedux(<Test />);
            const checkboxes = queryAllByRole('checkbox');
            fireEvent.click(checkboxes[1]);
            rerender(<Test selectedIds={[1]} />);
            fireEvent.click(checkboxes[3], {
                shiftKey: true,
                checked: true,
            });
            expect(contextValue.onToggleItem).toHaveBeenCalledTimes(1);
            expect(contextValue.onSelect).toHaveBeenCalledWith([1, 2, 3]);
        });

        it('should call onSelect with the correct ids when the last selection is before the first', () => {
            const Test = ({ selectedIds = [] }) => (
                <ListContextProvider value={{ ...contextValue, selectedIds }}>
                    <Datagrid hasBulkActions>
                        <TitleField />
                    </Datagrid>
                </ListContextProvider>
            );
            const { queryAllByRole, rerender } = renderWithRedux(<Test />);
            const checkboxes = queryAllByRole('checkbox');
            fireEvent.click(checkboxes[3], { checked: true });
            rerender(<Test selectedIds={[3]} />);
            fireEvent.click(checkboxes[1], {
                shiftKey: true,
                checked: true,
            });
            expect(contextValue.onToggleItem).toHaveBeenCalledTimes(1);
            expect(contextValue.onSelect).toHaveBeenCalledWith([3, 1, 2]);
        });

        it('should call onSelect with the correct ids when unselecting items', () => {
            const Test = ({ selectedIds = [] }) => (
                <ListContextProvider value={{ ...contextValue, selectedIds }}>
                    <Datagrid hasBulkActions>
                        <TitleField />
                    </Datagrid>
                </ListContextProvider>
            );
            const { queryAllByRole, rerender } = renderWithRedux(
                <Test selectedIds={[1, 2, 4]} />
            );
            const checkboxes = queryAllByRole('checkbox');
            fireEvent.click(checkboxes[3], { checked: true });
            rerender(<Test selectedIds={[1, 2, 4, 3]} />);
            fireEvent.click(checkboxes[4], { shiftKey: true });
            expect(contextValue.onToggleItem).toHaveBeenCalledTimes(1);
            expect(contextValue.onSelect).toHaveBeenCalledWith([1, 2]);
        });

        it('should call onToggeItem when the last selected id is not in the ids', () => {
            const Test = ({
                selectedIds = [],
                ids = [1, 2, 3, 4],
                data = defaultData,
            }: any) => (
                <ListContextProvider
                    value={{ ...contextValue, selectedIds, ids, data }}
                >
                    <Datagrid hasBulkActions>
                        <TitleField />
                    </Datagrid>
                </ListContextProvider>
            );
            const { queryAllByRole, rerender } = renderWithRedux(<Test />);
            fireEvent.click(queryAllByRole('checkbox')[1], { checked: true });

            // Simulate page change
            const newData = { 5: { id: 5, title: 'title 5' } };
            rerender(<Test ids={[5]} selectedIds={[1]} data={newData} />);

            fireEvent.click(queryAllByRole('checkbox')[1], {
                checked: true,
                shiftKey: true,
            });

            expect(contextValue.onToggleItem).toHaveBeenCalledTimes(2);
            expect(contextValue.onSelect).toHaveBeenCalledTimes(0);
        });

        it('should not extend selection when selectedIds is cleared', () => {
            const Test = ({ selectedIds = [] }) => (
                <ListContextProvider value={{ ...contextValue, selectedIds }}>
                    <Datagrid hasBulkActions>
                        <TitleField />
                    </Datagrid>
                </ListContextProvider>
            );
            const { queryAllByRole, rerender } = renderWithRedux(<Test />);
            const checkboxes = queryAllByRole('checkbox');
            fireEvent.click(checkboxes[1], { checked: true });
            rerender(<Test selectedIds={[1]} />);

            // Simulate unselecting all items
            rerender(<Test />);

            fireEvent.click(checkboxes[1], {
                checked: true,
                shiftKey: true,
            });

            expect(contextValue.onToggleItem).toHaveBeenCalledTimes(2);
            expect(contextValue.onSelect).toHaveBeenCalledTimes(0);
        });

        it('should respect isRowSelectable when calling onSelect', () => {
            const Test = ({ selectedIds = [] }) => (
                <ListContextProvider value={{ ...contextValue, selectedIds }}>
                    <Datagrid
                        isRowSelectable={record => record.id !== 2}
                        hasBulkActions
                    >
                        <TitleField />
                    </Datagrid>
                </ListContextProvider>
            );
            const { queryAllByRole, rerender } = renderWithRedux(<Test />);
            const checkboxes = queryAllByRole('checkbox');
            fireEvent.click(checkboxes[1], { checked: true });
            rerender(<Test selectedIds={[1]} />);
            fireEvent.click(checkboxes[2], {
                shiftKey: true,
                checked: true,
            });
            expect(contextValue.onToggleItem).toHaveBeenCalledTimes(1);
            expect(contextValue.onSelect).toHaveBeenCalledWith([1, 3]);
        });

        it('should not use as last selected the item that was unselected', () => {
            const Test = ({ selectedIds = [] }) => (
                <ListContextProvider value={{ ...contextValue, selectedIds }}>
                    <Datagrid hasBulkActions>
                        <TitleField />
                    </Datagrid>
                </ListContextProvider>
            );
            const { queryAllByRole, rerender } = renderWithRedux(<Test />);
            const checkboxes = queryAllByRole('checkbox');
            fireEvent.click(checkboxes[1], { checked: true });
            expect(contextValue.onToggleItem).toHaveBeenCalledWith(1);

            rerender(<Test selectedIds={[1]} />);
            fireEvent.click(checkboxes[2], { shiftKey: true, checked: true });
            expect(contextValue.onSelect).toHaveBeenCalledWith([1, 2]);

            rerender(<Test selectedIds={[1, 2]} />);
            fireEvent.click(checkboxes[2]);
            expect(contextValue.onToggleItem).toHaveBeenCalledWith(2);

            rerender(<Test selectedIds={[1]} />);
            fireEvent.click(checkboxes[4], { shiftKey: true, checked: true });
            expect(contextValue.onToggleItem).toHaveBeenCalledWith(4);

            expect(contextValue.onToggleItem).toHaveBeenCalledTimes(3);
            expect(contextValue.onSelect).toHaveBeenCalledTimes(1);
        });
    });
});
