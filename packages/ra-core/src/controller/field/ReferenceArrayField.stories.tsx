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

const ReferenceArrayFieldComponent = (props: ListControllerResult) => (
    <div>
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
            }}
        >
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

export const ReferenceArrayField = ({
    children = ReferenceArrayFieldComponent,
}) => (
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
    title: 'ra-core/fields/ReferenceArrayField',
};
