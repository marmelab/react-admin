import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import expect from 'expect';
import cloneDeep from 'lodash/cloneDeep';

import {
    Basic,
    Omit,
    PreferenceKey,
    LabelElement,
    NullChildren,
    Wrapper,
    data,
} from './DatagridConfigurable.stories';
import { DatagridConfigurable } from './DatagridConfigurable';
import { TextField } from '../../field';
import { EditButton } from '../../button';
import { memoryStore } from 'ra-core';

describe('<DatagridConfigurable>', () => {
    it('should render a datagrid with configurable columns', async () => {
        render(<Basic />);
        screen.getByLabelText('Configure mode').click();
        await screen.findByText('Inspector');
        fireEvent.mouseOver(screen.getByText('Leo Tolstoy'));
        await screen.getByTitle('ra.configurable.customize').click();
        await screen.findByText('Datagrid');
        expect(screen.queryByText('1869')).not.toBeNull();
        screen.getByLabelText('Year').click();
        expect(screen.queryByText('1869')).toBeNull();
        screen.getByLabelText('Year').click();
        expect(screen.queryByText('1869')).not.toBeNull();
    });
    it('should accept fields with a custom label', async () => {
        render(<Basic />);
        screen.getByLabelText('Configure mode').click();
        await screen.findByText('Inspector');
        fireEvent.mouseOver(screen.getByText('Leo Tolstoy'));
        await screen.getByTitle('ra.configurable.customize').click();
        await screen.findByText('Datagrid');
        expect(screen.queryByText('War and Peace')).not.toBeNull();
        screen.getByLabelText('Original title').click();
        expect(screen.queryByText('War and Peace')).toBeNull();
        screen.getByLabelText('Original title').click();
        expect(screen.queryByText('War and Peace')).not.toBeNull();
    });
    it('should accept fields with a label element', async () => {
        render(<LabelElement />);
        screen.getByLabelText('Configure mode').click();
        await screen.findByText('Inspector');
        fireEvent.mouseOver(screen.getByText('Leo Tolstoy'));
        await screen.getByTitle('ra.configurable.customize').click();
        await screen.findByText('Datagrid');
        expect(screen.queryByText('War and Peace')).not.toBeNull();
        screen.getByLabelText('Title').click();
        expect(screen.queryByText('War and Peace')).toBeNull();
        screen.getByLabelText('Title').click();
        expect(screen.queryByText('War and Peace')).not.toBeNull();
    });
    it('accepts null children', async () => {
        render(<NullChildren />);
        screen.getByLabelText('Configure mode').click();
        await screen.findByText('Inspector');
        fireEvent.mouseOver(screen.getByText('Leo Tolstoy'));
        await screen.getByTitle('ra.configurable.customize').click();
        await screen.findByText('Datagrid');
        expect(screen.queryByText('War and Peace')).not.toBeNull();
        screen.getByLabelText('Original title').click();
        expect(screen.queryByText('War and Peace')).toBeNull();
        screen.getByLabelText('Original title').click();
        expect(screen.queryByText('War and Peace')).not.toBeNull();
    });
    it('should accept fields with no source', async () => {
        render(<Basic />);
        screen.getByLabelText('Configure mode').click();
        await screen.findByText('Inspector');
        fireEvent.mouseOver(screen.getByText('Leo Tolstoy'));
        await screen.getByTitle('ra.configurable.customize').click();
        await screen.findByText('Datagrid');
        expect(screen.queryByText('Leo Tolstoy')).not.toBeNull();
        screen.getByLabelText('Author').click();
        expect(screen.queryByText('Leo Tolstoy')).toBeNull();
        screen.getByLabelText('Author').click();
        expect(screen.queryByText('Leo Tolstoy')).not.toBeNull();
    });
    describe('omit', () => {
        it('should not render omitted columns by default', async () => {
            render(<Omit />);
            expect(screen.queryByText('Original title')).toBeNull();
            expect(screen.queryByText('War and Peace')).toBeNull();
            screen.getByLabelText('Configure mode').click();
            await screen.findByText('Inspector');
            fireEvent.mouseOver(screen.getByText('Leo Tolstoy'));
            await screen.getByTitle('ra.configurable.customize').click();
            await screen.findByText('Datagrid');
            screen.getByLabelText('Original title').click();
            expect(screen.queryByText('War and Peace')).not.toBeNull();
        });
    });
    describe('preferenceKey', () => {
        it('should allow two ConfigurableDatagrid not to share the same preferences', async () => {
            render(<PreferenceKey />);
            expect(screen.queryAllByText('War and Peace')).toHaveLength(2);
            screen.getByLabelText('Configure mode').click();
            await screen.findByText('Inspector');
            fireEvent.mouseOver(screen.getAllByText('Leo Tolstoy')[0]);
            await screen.getByTitle('ra.configurable.customize').click();
            await screen.findByText('Datagrid');
            screen.getByLabelText('Original title').click();
            expect(screen.queryAllByText('War and Peace')).toHaveLength(1);
        });
    });
    describe('store/code synchronization', () => {
        const storeDefaultValue = {
            preferences: {
                books1: {
                    datagrid: {
                        columns: ['0', '1', '2', '3', '4'],
                        availableColumns: [
                            {
                                index: '0',
                                source: 'id',
                            },
                            {
                                index: '1',
                                source: 'title',
                                label: 'Original title',
                            },
                            {
                                index: '2',
                                source: 'author',
                            },
                            {
                                index: '3',
                                source: 'year',
                            },
                            {
                                index: '4',
                                label: 'Unlabeled column #4',
                            },
                        ],
                    },
                },
            },
        };

        it('should preserve hidden columns from the store and show new non omitted columns last', async () => {
            const store = memoryStore(cloneDeep(storeDefaultValue));
            store.setItem('preferences.books1.datagrid.columns', [
                '1',
                '0',
                '3',
            ]);
            const { rerender } = render(
                <Wrapper store={store}>
                    <DatagridConfigurable
                        resource="books1"
                        data={data}
                        sort={{ field: 'title', order: 'ASC' }}
                        bulkActionButtons={false}
                    >
                        <TextField source="id" />
                        <TextField source="title" label="Original title" />
                        <TextField source="author" />
                        <EditButton />
                    </DatagridConfigurable>
                </Wrapper>
            );

            await screen.findByText('War and Peace');
            // author column is hidden
            expect(screen.queryByText('Leo Tolstoy')).toBeNull();

            // Render something else (to be able to tell when the next rerender is finished)
            rerender(<Wrapper store={store}>Something Else</Wrapper>);
            await screen.findByText('Something Else');

            // Add 'year' column
            rerender(
                <Wrapper store={store}>
                    <DatagridConfigurable
                        resource="books1"
                        data={data}
                        sort={{ field: 'title', order: 'ASC' }}
                        bulkActionButtons={false}
                    >
                        <TextField source="id" />
                        <TextField source="year" />
                        <TextField source="title" label="Original title" />
                        <TextField source="author" />
                        <EditButton />
                    </DatagridConfigurable>
                </Wrapper>
            );
            await screen.findByText('War and Peace');
            // Year column should be displayed
            await screen.findByText('1869');
            // author column is still hidden
            expect(screen.queryByText('Leo Tolstoy')).toBeNull();
            // Store value should be updated
            expect(
                store.getItem('preferences.books1.datagrid.columns')
            ).toEqual(['2', '0', '1', '4']);
            // Check the order is preserved
            const columnsTexts = Array.from(
                screen.getByText('War and Peace')?.closest('tr')
                    ?.children as HTMLCollection
            ).map(child => child.textContent);
            expect(columnsTexts).toEqual([
                'War and Peace',
                '1',
                '1869',
                'ra.action.edit',
            ]);
        });

        it('should preserve hidden columns from the store when column order is changed in the code', async () => {
            const store = memoryStore(cloneDeep(storeDefaultValue));
            // hide the 'year' column
            store.setItem('preferences.books1.datagrid.columns', [
                '0',
                '1',
                '2',
                '4',
            ]);
            const { rerender } = render(
                <Wrapper store={store}>
                    <DatagridConfigurable
                        resource="books1"
                        data={data}
                        sort={{ field: 'title', order: 'ASC' }}
                        bulkActionButtons={false}
                    >
                        <TextField source="id" />
                        <TextField source="title" label="Original title" />
                        <TextField source="author" />
                        <TextField source="year" />
                        <EditButton />
                    </DatagridConfigurable>
                </Wrapper>
            );

            await screen.findByText('Leo Tolstoy');
            // Year column should be hidden
            expect(screen.queryByText('1869')).toBeNull();
            // Store value should be preserved
            expect(
                store.getItem('preferences.books1.datagrid.columns')
            ).toEqual(['0', '1', '2', '4']);

            // Render something else (to be able to tell when the next rerender is finished)
            rerender(<Wrapper store={store}>Something Else</Wrapper>);
            await screen.findByText('Something Else');

            // Invert 'year' and 'author' columns
            rerender(
                <Wrapper store={store}>
                    <DatagridConfigurable
                        resource="books1"
                        data={data}
                        sort={{ field: 'title', order: 'ASC' }}
                        bulkActionButtons={false}
                    >
                        <TextField source="id" />
                        <TextField source="title" label="Original title" />
                        <TextField source="year" />
                        <TextField source="author" />
                        <EditButton />
                    </DatagridConfigurable>
                </Wrapper>
            );
            await screen.findByText('Leo Tolstoy');
            // Year column should still be hidden
            expect(screen.queryByText('1869')).toBeNull();
            // Store value should be updated
            expect(
                store.getItem('preferences.books1.datagrid.columns')
            ).toEqual(['0', '1', '3', '4']);
        });

        it('should preserve hidden columns from the store when a column is renamed in the code', async () => {
            const store = memoryStore(cloneDeep(storeDefaultValue));
            // invert the 'year' and 'author' columns
            store.setItem('preferences.books1.datagrid.columns', [
                '0',
                '1',
                '3',
                '2',
                '4',
            ]);
            store.setItem('preferences.books1.datagrid.availableColumns', [
                {
                    index: '0',
                    source: 'id',
                },
                {
                    index: '1',
                    source: 'title',
                    label: 'Original title',
                },
                {
                    index: '3',
                    source: 'year',
                },
                {
                    index: '2',
                    source: 'author',
                },
                {
                    index: '4',
                    label: 'Unlabeled column #4',
                },
            ]);
            const { rerender } = render(
                <Wrapper store={store}>
                    <DatagridConfigurable
                        resource="books1"
                        data={data}
                        sort={{ field: 'title', order: 'ASC' }}
                        bulkActionButtons={false}
                    >
                        <TextField source="id" />
                        <TextField source="title" label="Original title" />
                        <TextField source="author" />
                        <TextField source="year" />
                        <EditButton />
                    </DatagridConfigurable>
                </Wrapper>
            );

            await screen.findByText('Leo Tolstoy');
            // Store value should be preserved
            expect(
                store.getItem('preferences.books1.datagrid.columns')
            ).toEqual(['0', '1', '3', '2', '4']);

            // Render something else (to be able to tell when the next rerender is finished)
            rerender(<Wrapper store={store}>Something Else</Wrapper>);
            await screen.findByText('Something Else');

            // Rename the 'title' column
            rerender(
                <Wrapper store={store}>
                    <DatagridConfigurable
                        resource="books1"
                        data={data}
                        sort={{ field: 'title', order: 'ASC' }}
                        bulkActionButtons={false}
                    >
                        <TextField source="id" />
                        <TextField source="title" label="New title" />
                        <TextField source="author" />
                        <TextField source="year" />
                        <EditButton />
                    </DatagridConfigurable>
                </Wrapper>
            );
            await screen.findByText('Leo Tolstoy');
            // Store value should be preserved
            expect(
                store.getItem('preferences.books1.datagrid.columns')
            ).toEqual(['0', '1', '3', '2', '4']);
        });
    });
});
