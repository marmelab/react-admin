import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import {
    Basic,
    Columns,
    Empty,
    Expand,
    ExpandSingle,
    IsRowExpandable,
    IsRowSelectable,
    NonPrimitiveData,
    StandaloneDynamic,
    StandaloneStatic,
} from './DataTable.stories';

describe('DataTable', () => {
    it('should render one row per record in the list', async () => {
        render(<Basic />);
        await waitFor(() => {
            expect(screen.getAllByRole('row')).toHaveLength(6);
        });
        screen.getByText('War and Peace');
        screen.getByText('Pride and Prejudice');
        screen.getByText('The Picture of Dorian Gray');
        screen.getByText('Le Petit Prince');
        screen.getByText('The Alchemist');
    });
    it('should render a header row with one column per child', async () => {
        render(<Basic />);
        await waitFor(() => {
            expect(screen.getAllByRole('columnheader')).toHaveLength(5);
        });
        screen.getByText('Id');
        screen.getByText('Title');
        screen.getByText('Author');
        screen.getByText('Year');
    });
    it('should render non React primitive data without crashing', async () => {
        render(<NonPrimitiveData />);
        await waitFor(() => {
            expect(screen.getAllByRole('row')).toHaveLength(6);
        });
        screen.getByText('War and Peace');
        screen.getByText('Pride and Prejudice');
        screen.getByText('The Picture of Dorian Gray');
        screen.getByText('Le Petit Prince');
        screen.getByText('The Alchemist');
    });
    describe('Sorting', () => {
        it('should show the default sort column with the default sort order', async () => {
            render(<Basic />);
            const idHeaderColumn = (
                await screen.findAllByRole('columnheader')
            )[1].firstChild as HTMLElement;
            expect(
                idHeaderColumn.classList.contains('Mui-active')
            ).toBeTruthy();
            expect(idHeaderColumn.getAttribute('aria-label')).toEqual(
                'Sort by id descending'
            );
            expect(screen.getAllByRole('row')[1].textContent).toEqual(
                '1War and PeaceLeo Tolstoy1869'
            );
        });
        it('should allow to change the sort order by clicking on a column header', async () => {
            render(<Basic />);
            const idHeaderColumn = (
                await screen.findAllByRole('columnheader')
            )[1].firstChild as HTMLElement;
            fireEvent.click(idHeaderColumn);
            await waitFor(() => {
                expect(idHeaderColumn.getAttribute('aria-label')).toEqual(
                    'Sort by id ascending'
                );
            });
            await waitFor(() => {
                expect(screen.getAllByRole('row')[1].textContent).toEqual(
                    '7The Lord of the RingsJ. R. R. Tolkien1954'
                );
            });
            fireEvent.click(idHeaderColumn);
            await waitFor(() => {
                expect(screen.getAllByRole('row')[1].textContent).toEqual(
                    '1War and PeaceLeo Tolstoy1869'
                );
            });
        });
        it('should allow to change the sort column by clicking on another column header', async () => {
            render(<Basic />);
            const titleHeaderColumn = (
                await screen.findAllByRole('columnheader')
            )[2].firstChild as HTMLElement;
            fireEvent.click(titleHeaderColumn);
            await waitFor(() => {
                expect(titleHeaderColumn.getAttribute('aria-label')).toEqual(
                    'Sort by title ascending'
                );
            });
            await waitFor(() => {
                expect(screen.getAllByRole('row')[1].textContent).toEqual(
                    '4Le Petit PrinceAntoine de Saint-Exupéry1943'
                );
            });
        });
    });
    describe('Columns', () => {
        it('should render children as column headers', async () => {
            render(<Columns />);
            await screen.findByText('Id');
        });
        it('should render children as column values', async () => {
            render(<Columns />);
            await screen.findByText('LE PETIT PRINCE');
        });
        it('should accept wrapped columns', async () => {
            render(<Columns />);
            await screen.findByText('resources.books.fields.year');
        });
        it('should accept columns without label', async () => {
            render(<Columns />);
            const actionsHeaderColumn = (
                await screen.findAllByRole('columnheader')
            )[5].firstChild as HTMLElement;
            expect(actionsHeaderColumn.textContent).toEqual('');
        });
    });
    describe('Standalone', () => {
        it('should render a standalone table', async () => {
            render(<StandaloneStatic />);
            await screen.findByText('The Lord of the Rings');
        });
        it('should allow a standalone table to be sortable', async () => {
            render(<StandaloneDynamic />);
            const titleHeaderColumn = (
                await screen.findAllByRole('columnheader')
            )[2].firstChild as HTMLElement;
            await waitFor(() => {
                expect(screen.getAllByRole('row')[1].textContent).toEqual(
                    '7The Lord of the Rings'
                );
            });
            fireEvent.click(titleHeaderColumn);
            await waitFor(() => {
                expect(screen.getAllByRole('row')[1].textContent).toEqual(
                    '4Le Petit Prince'
                );
            });
        });
    });
    describe('empty', () => {
        it('should render the default empty result message', async () => {
            render(<Empty />);
            await screen.findByText('ra.navigation.no_results');
        });
        it('should accept a custom empty element', async () => {
            render(<Empty />);
            await screen.findByText('No books found');
        });
    });
    describe('expand', () => {
        it('should show an expand button on each row and in the header', async () => {
            render(<Expand />);
            await waitFor(() => {
                expect(
                    screen.getAllByLabelText('ra.action.expand')
                ).toHaveLength(6);
            });
        });
        it('should toggle the panel when clicking on the expand button', async () => {
            render(<Expand />);
            const expandButton =
                await screen.findAllByLabelText('ra.action.expand');
            expect(screen.queryByTestId('ExpandPanel')).toBeFalsy();
            fireEvent.click(expandButton[1]);
            await waitFor(() => {
                expect(screen.getByTestId('ExpandPanel')).toBeTruthy();
            });
            fireEvent.click(expandButton[1]);
            await waitFor(() => {
                expect(screen.queryByTestId('ExpandPanel')).toBeFalsy();
            });
        });
        it('should toggle all rows when clicking on the header expand button', async () => {
            render(<Expand />);
            const expandButton =
                await screen.findAllByLabelText('ra.action.expand');
            fireEvent.click(expandButton[0]);
            await waitFor(() => {
                expect(screen.getAllByTestId('ExpandPanel')).toHaveLength(5);
            });
            fireEvent.click(expandButton[0]);
            await waitFor(() => {
                expect(screen.queryByTestId('ExpandPanel')).toBeFalsy();
            });
        });
    });
    describe('expandSingle', () => {
        it('should close other panels when opening one', async () => {
            render(<ExpandSingle />);
            const expandButtons =
                await screen.findAllByLabelText('ra.action.expand');
            fireEvent.click(expandButtons[1]);
            expect(screen.queryAllByTestId('ExpandPanel')).toHaveLength(1);
            fireEvent.click(expandButtons[2]);
            await waitFor(() => {
                expect(screen.queryAllByTestId('ExpandPanel')).toHaveLength(1);
            });
        });
    });
    describe('isRowExpandable', () => {
        it('should hide the expand button when the row is not expandable', async () => {
            render(<IsRowExpandable />);
            await waitFor(() => {
                expect(
                    screen.getAllByLabelText('ra.action.expand')
                ).toHaveLength(4);
            });
        });
    });
    describe('bulkActionButtons', () => {
        it('should reveal bulk delete button by default on row selection', async () => {
            render(<Basic />);
            const checkboxes = await screen.findAllByRole('checkbox');
            fireEvent.click(checkboxes[1]);
            await screen.findByLabelText('Delete');
            await screen.findByText('1 item selected');
            fireEvent.click(checkboxes[2]);
            await screen.findByText('2 items selected');
        });
        it('should reveal select all button when selecting the entire page', async () => {
            render(<Basic />);
            const checkboxes = await screen.findAllByRole('checkbox');
            fireEvent.click(checkboxes[0]);
            const selectAllButton = await screen.findByText('Select all');
            selectAllButton.click();
            await screen.findByText('7 items selected');
        });
        it('should only unselect the current page records', async () => {
            render(<Basic />);
            const checkboxes = await screen.findAllByRole('checkbox');
            fireEvent.click(checkboxes[0]);
            const selectAllButton = await screen.findByText('Select all');
            selectAllButton.click();
            await screen.findByText('7 items selected');
            fireEvent.click(checkboxes[0]);
            await screen.findByText('2 items selected');
        });
        it('should support alternating shift-select and shift-deselect', async () => {
            render(<Basic />);
            const checkboxes = await screen.findAllByRole('checkbox');
            fireEvent.click(checkboxes[1]);
            fireEvent.click(checkboxes[4], { shiftKey: true });
            await screen.findByText('4 items selected');
            fireEvent.click(checkboxes[5], { shiftKey: true });
            await screen.findByText('5 items selected');
            fireEvent.click(checkboxes[3], { shiftKey: true });
            await screen.findByText('2 items selected');
            fireEvent.click(checkboxes[5], { shiftKey: true });
            await screen.findByText('5 items selected');
        });
        it('should support shift-deselect after select all then deselect one', async () => {
            render(<Basic />);
            const checkboxes = await screen.findAllByRole('checkbox');
            fireEvent.click(checkboxes[0]);
            const selectAllButton = await screen.findByText('Select all');
            selectAllButton.click();
            await screen.findByText('7 items selected');
            fireEvent.click(checkboxes[2]);
            await screen.findByText('6 items selected');
            fireEvent.click(checkboxes[4], { shiftKey: true });
            await screen.findByText('4 items selected');
        });
        it('should not create duplicate selections when checking page after individual selections', async () => {
            render(<Basic />);
            const checkboxes = await screen.findAllByRole('checkbox');
            fireEvent.click(checkboxes[1]);
            fireEvent.click(checkboxes[2]);
            await screen.findByText('2 items selected');
            fireEvent.click(checkboxes[0]);
            await screen.findByText('5 items selected');
            const selectAllButton = await screen.findByText('Select all');
            selectAllButton.click();
            await screen.findByText('7 items selected');
        });
        it('should handle uncheck and recheck without duplicates', async () => {
            render(<Basic />);
            const checkboxes = await screen.findAllByRole('checkbox');
            fireEvent.click(checkboxes[1]);
            fireEvent.click(checkboxes[2]);
            await screen.findByText('2 items selected');
            fireEvent.click(checkboxes[0]);
            await screen.findByText('5 items selected');
            fireEvent.click(checkboxes[0]);
            await waitFor(() => {
                expect(screen.queryByText('items selected')).toBeNull();
            });
            fireEvent.click(checkboxes[0]);
            await screen.findByText('5 items selected');
        });
    });
    describe('isRowSelectable', () => {
        it('should allow to disable row selection', async () => {
            render(<IsRowSelectable />);
            const checkboxes = await screen.findAllByRole('checkbox');
            expect(checkboxes[1].getAttribute('disabled')).toEqual(null);
            expect(checkboxes[2].getAttribute('disabled')).toEqual('');
        });
    });
});
