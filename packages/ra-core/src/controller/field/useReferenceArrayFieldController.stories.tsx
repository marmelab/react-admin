import * as React from 'react';
import {
    CoreAdminContext,
    type GetManyResult,
    type ListControllerResult,
    testDataProvider,
    useReferenceArrayFieldController,
} from '../..';

const dataProvider = testDataProvider({
    getMany: (_resource, _params): Promise<GetManyResult> =>
        Promise.resolve({
            data: [
                { id: 1, title: 'bar1' },
                { id: 2, title: 'bar2' },
            ],
        }),
});

/**
 * Render prop version of the controller hook
 */
const ReferenceArrayFieldController = props => {
    const { children, ...rest } = props;
    const controllerProps = useReferenceArrayFieldController({
        sort: {
            field: 'id',
            order: 'ASC',
        },
        ...rest,
    });
    return children(controllerProps);
};

const defaultRenderProp = (props: ListControllerResult) => (
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
            <p data-testid="selected_ids">
                Selected ids: {JSON.stringify(props.selectedIds)}
            </p>
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
                        data-testid={`checkbox-${record.id}`}
                    />
                    {record.id} - {record.title}
                </li>
            ))}
        </ul>
    </div>
);

export const Basic = ({ children = defaultRenderProp }) => (
    <CoreAdminContext dataProvider={dataProvider}>
        <ReferenceArrayFieldController
            resource="foo"
            reference="bar"
            record={{ id: 1, barIds: [1, 2] }}
            source="barIds"
        >
            {children}
        </ReferenceArrayFieldController>
    </CoreAdminContext>
);

export default {
    title: 'ra-core/controller/useReferenceArrayFieldController',
};
