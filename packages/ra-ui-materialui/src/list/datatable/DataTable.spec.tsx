import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
    Basic,
    Columns,
    Empty,
    StandaloneStatic,
    StandaloneDynamic,
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
});
