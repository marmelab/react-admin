import * as React from 'react';
import fakeDataProvider from 'ra-data-fakerest';
import { onlineManager } from '@tanstack/react-query';

import { CoreAdminContext } from '../../core';
import { ListController } from './ListController';
import type { DataProvider } from '../../types';
import type { ListControllerResult } from './useListController';
import { useNotificationContext } from '../../notification';

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
    children?: (params: ListControllerResult) => React.ReactNode;
}) => (
    <CoreAdminContext dataProvider={dataProvider}>
        <ListController resource="posts">{children}</ListController>
    </CoreAdminContext>
);

const OnlineManager = () => {
    const [online, setOnline] = React.useState(onlineManager.isOnline());
    React.useEffect(() => {
        const unsubscribe = onlineManager.subscribe(isOnline => {
            setOnline(isOnline);
        });
        return unsubscribe;
    }, []);
    return (
        <div>
            <button
                onClick={() => {
                    onlineManager.setOnline(true);
                }}
            >
                Go online
            </button>
            <button
                onClick={() => {
                    onlineManager.setOnline(false);
                }}
            >
                Go offline
            </button>
            <p>{online ? 'Online' : 'Offline'}</p>
        </div>
    );
};

const Notifications = () => {
    const { notifications, takeNotification } = useNotificationContext();
    return (
        <div>
            <p>NOTIFICATIONS</p>
            <ul>
                {notifications.map(({ message, type }, id) => (
                    <li key={id}>
                        {message} - {type}
                    </li>
                ))}
            </ul>
            <button onClick={takeNotification}>Take notification</button>
        </div>
    );
};

export const Offline = () => (
    <CoreAdminContext dataProvider={defaultDataProvider}>
        <OnlineManager />
        <ListController resource="posts" perPage={3}>
            {params => (
                <div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                        }}
                    >
                        <button onClick={() => params.setPage(1)}>
                            Page 1
                        </button>
                        <button onClick={() => params.setPage(2)}>
                            Page 2
                        </button>
                        <button onClick={() => params.setPage(3)}>
                            Page 3
                        </button>
                    </div>
                    <ul
                        style={{
                            listStyleType: 'none',
                        }}
                    >
                        {params.data?.map(record => (
                            <li key={record.id}>
                                {record.id} - {record.title}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </ListController>
        <Notifications />
    </CoreAdminContext>
);
