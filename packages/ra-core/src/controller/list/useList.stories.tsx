import React from 'react';

import { ListContextProvider, useList, useListContext } from '.';
import type { UseListValue } from '.';

export default {
    title: 'ra-core/controller/list/useList',
};

const ListView = () => {
    const listContext = useListContext();
    return (
        <div>
            {listContext.isPending ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <div>
                        <p data-testid="selected_ids">
                            Selected ids:{' '}
                            {JSON.stringify(listContext.selectedIds)}
                        </p>
                    </div>
                    <ul
                        style={{
                            listStyleType: 'none',
                        }}
                    >
                        {listContext.data?.map(record => (
                            <li key={record.id}>
                                <input
                                    type="checkbox"
                                    checked={listContext.selectedIds.includes(
                                        record.id
                                    )}
                                    onChange={() =>
                                        listContext.onToggleItem(record.id)
                                    }
                                    style={{
                                        cursor: 'pointer',
                                        marginRight: '10px',
                                    }}
                                />
                                {record.id} - {record.title}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const data = [
    { id: 1, title: 'War and Peace' },
    { id: 2, title: 'The Little Prince' },
    { id: 3, title: "Swann's Way" },
    { id: 4, title: 'A Tale of Two Cities' },
    { id: 5, title: 'The Lord of the Rings' },
    { id: 6, title: 'And Then There Were None' },
    { id: 7, title: 'Dream of the Red Chamber' },
    { id: 8, title: 'The Hobbit' },
    { id: 9, title: 'She: A History of Adventure' },
    { id: 10, title: 'The Lion, the Witch and the Wardrobe' },
];

const Wrapper = ({
    children = <ListView />,
    callback,
    ...props
}: {
    children: React.ReactNode;
    callback?: (value: UseListValue) => void;
}) => {
    const value = useList({
        data,
        sort: { field: 'id', order: 'ASC' },
        ...props,
    });
    callback && callback(value);
    return <ListContextProvider value={value}>{children}</ListContextProvider>;
};

export const Basic = props => <Wrapper {...props} />;

const SortButton = () => {
    const listContext = useListContext();
    return (
        <div style={{ display: 'flex', gap: '10px', margin: '10px' }}>
            <button
                onClick={() =>
                    listContext.sort.field === 'id' &&
                    listContext.sort.order === 'ASC'
                        ? listContext.setSort({ field: 'id', order: 'DESC' })
                        : listContext.setSort({ field: 'id', order: 'ASC' })
                }
            >
                Sort by id{' '}
                {listContext.sort.field === 'id' &&
                listContext.sort.order === 'ASC'
                    ? 'DESC'
                    : 'ASC'}
            </button>
            <button
                onClick={() =>
                    listContext.sort.field === 'title' &&
                    listContext.sort.order === 'ASC'
                        ? listContext.setSort({ field: 'title', order: 'DESC' })
                        : listContext.setSort({ field: 'title', order: 'ASC' })
                }
            >
                Sort by title{' '}
                {listContext.sort.field === 'title' &&
                listContext.sort.order === 'ASC'
                    ? 'DESC'
                    : 'ASC'}
            </button>
        </div>
    );
};

export const Sort = props => (
    <Wrapper {...props}>
        <SortButton />
        <ListView />
    </Wrapper>
);

const SelectAllButton = () => {
    const value = useListContext();
    return (
        <div
            style={{
                display: 'flex',
                gap: '10px',
                margin: '10px',
            }}
        >
            <button onClick={() => value.onSelectAll()} name="Select All">
                Select All
            </button>
            <button onClick={() => value.onSelect([1])} name="Select item 1">
                Select item 1
            </button>
        </div>
    );
};

export const SelectAll = props => (
    <Wrapper {...props}>
        <SelectAllButton />
        <ListView />
    </Wrapper>
);
