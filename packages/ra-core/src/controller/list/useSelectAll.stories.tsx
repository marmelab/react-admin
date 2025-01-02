import * as React from 'react';
import fakeDataProvider from 'ra-data-fakerest';

import { CoreAdminContext } from '../../core';
import { ListController } from './ListController';
import { useSelectAll } from './useSelectAll';

export default {
    title: 'ra-core/controller/useSelectAll',
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

const ListView = ({ options, ...params }) => (
    <div>
        <SelectAllButton options={options} />
        <p>Selected ids: {JSON.stringify(params.selectedIds)}</p>
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

const SelectAllButton = ({ options }) => {
    const selectAll = useSelectAll({
        resource: 'posts',
        sort: { field: 'id', order: 'ASC' },
    });
    return (
        <button
            onClick={() => selectAll(options)}
            style={{ cursor: 'pointer' }}
        >
            Select All
        </button>
    );
};

export const Basic = ({ dataProvider = defaultDataProvider, options }) => (
    <CoreAdminContext dataProvider={dataProvider}>
        <ListController resource="posts">
            {controllerProps => (
                <ListView {...controllerProps} options={options} />
            )}
        </ListController>
    </CoreAdminContext>
);

export const Limit = ({ dataProvider = defaultDataProvider }) => (
    <Basic dataProvider={dataProvider} options={{ limit: 3 }} />
);

export const QueryOptions = ({ dataProvider = defaultDataProvider }) => (
    <Basic
        dataProvider={dataProvider}
        options={{
            queryOptions: { meta: { foo: 'bar' } },
        }}
    />
);
