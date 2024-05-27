import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
    CoreAdminContext,
    testDataProvider,
    ListContextProvider,
    useRecordContext,
    ResourceContextProvider,
} from 'ra-core';
import { ThemeProvider, createTheme } from '@mui/material';
import { Datagrid } from './Datagrid';

const TitleField = (): JSX.Element => {
    const record = useRecordContext();
    return <span>{record.title}</span>;
};

const Wrapper = ({ children, listContext }) => (
    <ThemeProvider theme={createTheme()}>
        <CoreAdminContext dataProvider={testDataProvider()}>
            <ResourceContextProvider value={listContext.resource}>
                <ListContextProvider value={listContext}>
                    {children}
                </ListContextProvider>
            </ResourceContextProvider>
        </CoreAdminContext>
    </ThemeProvider>
);
describe('<Datagrid />', () => {
    const defaultData = [
        { id: 1, title: 'title 1' },
        { id: 2, title: 'title 2' },
        { id: 3, title: 'title 3' },
        { id: 4, title: 'title 4' },
    ];

    const contextValue = {
        resource: 'posts',
        data: defaultData,
        isFetching: false,
        isLoading: false,
        selectedIds: [],
        sort: { field: 'title', order: 'ASC' },
        onToggleItem: jest.fn(),
        onSelect: jest.fn(),
    };

    afterEach(() => {
        contextValue.onToggleItem.mockClear();
        contextValue.onSelect.mockClear();
    });

    it('should call onToggleItem when the shift key is not pressed', () => {
        render(
            <Wrapper listContext={contextValue}>
                <Datagrid>
                    <TitleField />
                </Datagrid>
            </Wrapper>
        );
        fireEvent.click(screen.queryAllByRole('checkbox')[1]);
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

        const { rerender } = render(
            <Wrapper listContext={emptyData}>
                <Datagrid empty={<Empty />}>
                    <TitleField />
                </Datagrid>
            </Wrapper>
        );

        expect(screen.queryByText('No records to show')).toBeTruthy();

        const undefinedData = {
            ...contextValue,
            data: undefined,
            ids: [],
        };

        rerender(
            <Wrapper listContext={undefinedData}>
                <Datagrid empty={<Empty />}>
                    <TitleField />
                </Datagrid>
            </Wrapper>
        );

        expect(screen.queryByText('No records to show')).toBeTruthy();
    });

    it('should not allow to expand all rows when `expandSingle` prop is true', () => {
        render(
            <Wrapper listContext={contextValue}>
                <Datagrid expand={<div>Expanded panel</div>} expandSingle>
                    <TitleField />
                </Datagrid>
            </Wrapper>
        );
        expect(screen.queryAllByTestId('ExpandMoreIcon')).toHaveLength(
            defaultData.length
        );
    });

    describe('selecting items with the shift key', () => {
        it('should call onSelect with the correct ids when the last selection is after the first', () => {
            const Test = ({ selectedIds = [] }) => (
                <Wrapper listContext={{ ...contextValue, selectedIds }}>
                    <Datagrid>
                        <TitleField />
                    </Datagrid>
                </Wrapper>
            );
            const { rerender } = render(<Test />);
            const checkboxes = screen.queryAllByRole('checkbox');
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
                <Wrapper listContext={{ ...contextValue, selectedIds }}>
                    <Datagrid>
                        <TitleField />
                    </Datagrid>
                </Wrapper>
            );
            const { rerender } = render(<Test />);
            const checkboxes = screen.queryAllByRole('checkbox');
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
                <Wrapper listContext={{ ...contextValue, selectedIds }}>
                    <Datagrid>
                        <TitleField />
                    </Datagrid>
                </Wrapper>
            );
            const { rerender } = render(<Test selectedIds={[1, 2, 4]} />);
            const checkboxes = screen.queryAllByRole('checkbox');
            fireEvent.click(checkboxes[3], { checked: true });
            rerender(<Test selectedIds={[1, 2, 4, 3]} />);
            fireEvent.click(checkboxes[4], { shiftKey: true });
            expect(contextValue.onToggleItem).toHaveBeenCalledTimes(1);
            expect(contextValue.onSelect).toHaveBeenCalledWith([1, 2]);
        });

        it('should call onToggeItem when the last selected id is not in the ids', () => {
            const Test = ({ selectedIds = [], data = defaultData }: any) => (
                <Wrapper listContext={{ ...contextValue, selectedIds, data }}>
                    <Datagrid>
                        <TitleField />
                    </Datagrid>
                </Wrapper>
            );
            const { rerender } = render(<Test />);
            fireEvent.click(screen.queryAllByRole('checkbox')[1], {
                checked: true,
            });

            // Simulate page change
            const newData = [{ id: 5, title: 'title 5' }];
            rerender(<Test selectedIds={[1]} data={newData} />);

            fireEvent.click(screen.queryAllByRole('checkbox')[1], {
                checked: true,
                shiftKey: true,
            });

            expect(contextValue.onToggleItem).toHaveBeenCalledTimes(2);
            expect(contextValue.onSelect).toHaveBeenCalledTimes(0);
        });

        it('should not extend selection when selectedIds is cleared', () => {
            const Test = ({ selectedIds = [] }) => (
                <Wrapper listContext={{ ...contextValue, selectedIds }}>
                    <Datagrid>
                        <TitleField />
                    </Datagrid>
                </Wrapper>
            );
            const { rerender } = render(<Test />);
            const checkboxes = screen.queryAllByRole('checkbox');
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
                <Wrapper listContext={{ ...contextValue, selectedIds }}>
                    <Datagrid isRowSelectable={record => record.id !== 2}>
                        <TitleField />
                    </Datagrid>
                </Wrapper>
            );
            render(<Test />);
            const checkboxes = screen.queryAllByRole('checkbox');
            expect(checkboxes.length).toBe(5); // 1 for the header, 4 for the rows
            fireEvent.click(checkboxes[1], { checked: true }); // first row, id = 1
            fireEvent.click(checkboxes[3], {
                // third row, id = 3
                shiftKey: true,
                checked: true,
            });
            expect(contextValue.onToggleItem).toHaveBeenCalledTimes(1);
            expect(contextValue.onSelect).toHaveBeenCalledWith([1, 3]);
        });

        it('should not use as last selected the item that was unselected', () => {
            const Test = ({ selectedIds = [] }) => (
                <Wrapper listContext={{ ...contextValue, selectedIds }}>
                    <Datagrid>
                        <TitleField />
                    </Datagrid>
                </Wrapper>
            );
            const { rerender } = render(<Test />);
            const checkboxes = screen.queryAllByRole('checkbox');
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

    it('should display a message when there is no result', () => {
        render(
            <Wrapper listContext={{ ...contextValue, data: [], total: 0 }}>
                <Datagrid>
                    <TitleField />
                </Datagrid>
            </Wrapper>
        );
        expect(screen.queryByText('ra.navigation.no_results')).not.toBeNull();
    });
});
