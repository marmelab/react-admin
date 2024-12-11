import * as React from 'react';
import {
    CoreAdminContext,
    type CoreAdminContextProps,
    type GetManyResult,
    type ListControllerResult,
    testDataProvider,
    useReferenceManyFieldController,
} from '../..';

const defaultDataProvider = testDataProvider({
    getManyReference: (_resource, params): Promise<GetManyResult> =>
        Promise.resolve({
            data: [
                { id: 0, title: 'bar0' },
                { id: 1, title: 'bar1' },
            ].slice(0, params.pagination.perPage),
            total: params.pagination.perPage || 2,
        }),
});

const ReferenceManyFieldController = props => {
    const { children, ...rest } = props;
    const controllerProps = useReferenceManyFieldController({
        sort: {
            field: 'id',
            order: 'ASC',
        },
        ...rest,
    });
    return children(controllerProps);
};

const ReferenceManyFieldComponent = (props: ListControllerResult) => (
    <div>
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
            }}
        >
            <button
                onClick={() => props.onSelectAll()}
                disabled={props.total === props.selectedIds.length}
            >
                Select All
            </button>
            <button
                onClick={props.onUnselectItems}
                disabled={props.selectedIds.length === 0}
            >
                Unselect All
            </button>
            <p>Selected ids: {JSON.stringify(props.selectedIds)}</p>
        </div>
        <ul
            style={{
                listStyleType: 'none',
            }}
        >
            {props.data?.map(record => (
                <li key={record.id}>
                    <input
                        type="checkbox"
                        checked={props.selectedIds.includes(record.id)}
                        onChange={() => props.onToggleItem(record.id)}
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

export const ReferenceManyField = ({
    children = ReferenceManyFieldComponent,
    dataProvider = defaultDataProvider,
}: {
    children?: (props: ListControllerResult) => React.ReactNode;
    dataProvider?: CoreAdminContextProps['dataProvider'];
}) => (
    <CoreAdminContext dataProvider={dataProvider}>
        <ReferenceManyFieldController
            resource="authors"
            source="id"
            record={{ id: 123, name: 'James Joyce' }}
            reference="books"
            target="author_id"
        >
            {children}
        </ReferenceManyFieldController>
    </CoreAdminContext>
);

export default {
    title: 'ra-core/fields/ReferenceManyField',
};