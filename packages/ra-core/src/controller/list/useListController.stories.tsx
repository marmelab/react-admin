import * as React from 'react';
import fakeDataProvider from 'ra-data-fakerest';

import { CoreAdminContext } from '../../core';
import { ListController } from './ListController';
import type { DataProvider } from '../../types';
import type { ListControllerResult } from './useListController';

export default {
    title: 'ra-core/controller/list/useListController',
    excludeStories: ['defaultDataProvider'],
};

export const defaultDataProvider = fakeDataProvider(
    {
        posts: [
            { id: 1, title: 'Morbi suscipit malesuada' },
            { id: 2, title: 'Quisque sodales ipsum' },
            { id: 3, title: 'Maecenas at tortor' },
            { id: 4, title: 'Integer commodo est' },
            { id: 5, title: 'In eget accumsan' },
            { id: 6, title: 'Curabitur fringilla tellus' },
            { id: 7, title: 'Nunc ut purus' },
        ],
    },
    process.env.NODE_ENV === 'development'
);

const defaultRender = params => (
    <div>
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
            }}
        >
            <button
                onClick={() => params.onSelectAll()}
                disabled={params.total === params.selectedIds.length}
            >
                Select All
            </button>
            <button
                onClick={() => params.onSelect([1])}
                disabled={params.selectedIds.includes(1)}
            >
                Select item 1
            </button>
            <button
                onClick={() => params.onSelectAll({ limit: 3 })}
                disabled={params.selectedIds.length >= 3}
            >
                Limited Select All
            </button>
            <button
                onClick={params.onUnselectItems}
                disabled={params.selectedIds.length === 0}
            >
                Unselect All
            </button>
            <p data-testid="selected_ids">
                Selected ids: {JSON.stringify(params.selectedIds)}
            </p>
        </div>
        <ul
            style={{
                listStyleType: 'none',
            }}
        >
            {params.data?.map(record => (
                <li key={record.id}>
                    <input
                        type="checkbox"
                        checked={params.selectedIds.includes(record.id)}
                        onChange={() => params.onToggleItem(record.id)}
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
);

export const Basic = ({
    dataProvider = defaultDataProvider,
    children = defaultRender,
}: {
    dataProvider?: DataProvider;
    children?: (params: ListControllerResult) => JSX.Element;
}) => (
    <CoreAdminContext dataProvider={dataProvider}>
        <ListController resource="posts">{children}</ListController>
    </CoreAdminContext>
);
