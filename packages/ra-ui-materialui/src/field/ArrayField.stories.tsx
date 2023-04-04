import * as React from 'react';
import { MemoryRouter } from 'react-router';
import { useListContext, useRecordContext } from 'ra-core';

import { ArrayField } from './ArrayField';
import { SingleFieldList } from '../list';
import { ChipField } from './ChipField';

export default { title: 'ra-ui-materialui/fields/ArrayField' };

let books = [
    { id: 1, title: 'War and Peace', author_id: 1 },
    { id: 2, title: 'Les Misérables', author_id: 2 },
    { id: 3, title: 'Anna Karenina', author_id: 1 },
    { id: 4, title: 'The Count of Monte Cristo', author_id: 3 },
    { id: 5, title: 'Resurrection', author_id: 1 },
];

export const Basic = () => (
    <MemoryRouter>
        <ArrayField record={{ id: 123, books }} source="books">
            <SingleFieldList>
                <ChipField source="title" />
            </SingleFieldList>
        </ArrayField>
    </MemoryRouter>
);

const SortButton = () => {
    const { setSort } = useListContext();
    return (
        <button onClick={() => setSort({ field: 'title', order: 'ASC' })}>
            Sort by title
        </button>
    );
};

export const FilterButton = () => {
    const { setFilters } = useListContext();
    return (
        <button onClick={() => setFilters({ title: 'Resurrection' }, {})}>
            Filter by title
        </button>
    );
};

export const SelectedChip = () => {
    const { selectedIds, onToggleItem } = useListContext();
    const record = useRecordContext();
    return (
        <ChipField
            source="title"
            clickable
            onClick={() => {
                onToggleItem(record.id);
            }}
            color={selectedIds.includes(record.id) ? 'primary' : 'default'}
        />
    );
};

export const ListContext = () => (
    <MemoryRouter>
        <ArrayField record={{ id: 123, books }} source="books">
            <SingleFieldList sx={{ p: 2 }}>
                <SelectedChip />
            </SingleFieldList>
            <SortButton /> <FilterButton />
        </ArrayField>
    </MemoryRouter>
);
