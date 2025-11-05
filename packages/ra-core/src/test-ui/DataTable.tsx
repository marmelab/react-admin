import * as React from 'react';
import {
    DataTableBase,
    DataTableBaseProps,
    DataTableRenderContext,
    RaRecord,
    RecordContextProvider,
    useDataTableCallbacksContext,
    useDataTableRenderContext,
    useEvent,
    useFieldValue,
    useGetPathForRecordCallback,
    useListContext,
    useRecordContext,
    useResourceContext,
} from '../';
import { useNavigate } from 'react-router';

const DataTableCol = (props: {
    children?: React.ReactNode;
    render?: (record: RaRecord) => React.ReactNode;
    field?: React.ElementType;
    source?: string;
    label?: React.ReactNode;
}) => {
    const renderContext = useDataTableRenderContext();
    switch (renderContext) {
        case 'header':
            return <DataTableHeadCell {...props} />;
        case 'data':
            return <DataTableCell {...props} />;
    }
};

const DataTableHeadCell = (props: {
    label?: React.ReactNode;
    source?: string;
}) => {
    return (
        <th>
            {props.label ?? (
                <>
                    {props.source?.substring(0, 1).toUpperCase()}
                    {props.source?.substring(1)}
                </>
            )}
        </th>
    );
};

const DataTableCell = (props: {
    children?: React.ReactNode;
    render?: (record: RaRecord | undefined) => React.ReactNode;
    field?: React.ElementType;
    source?: string;
}) => {
    const record = useRecordContext();
    if (props.render) {
        return <td>{props.render(record)}</td>;
    }
    if (props.children) {
        return <td>{props.children}</td>;
    }
    if (props.field) {
        return (
            <td>
                {React.createElement(props.field, { source: props.source })}
            </td>
        );
    }
    if (props.source) {
        return (
            <td>
                <DataTableCellValue source={props.source} />
            </td>
        );
    }
};

const DataTableCellValue = (props: { source: string }) => {
    const value = useFieldValue(props);
    return <>{value}</>;
};

const DataTableRow = (props: {
    children: React.ReactNode;
    record?: RaRecord;
    resource?: string;
}) => {
    const getPathForRecord = useGetPathForRecordCallback();
    const navigate = useNavigate();
    const record = useRecordContext(props);
    if (!record) {
        throw new Error(
            'DataTableRow can only be used within a RecordContext or be passed a record prop'
        );
    }
    const resource = useResourceContext(props);
    if (!resource) {
        throw new Error(
            'DataTableRow can only be used within a ResourceContext or be passed a resource prop'
        );
    }
    const { rowClick } = useDataTableCallbacksContext();

    const handleClick = useEvent(async (event: React.MouseEvent) => {
        event.persist();
        const temporaryLink =
            typeof rowClick === 'function'
                ? rowClick(record.id, resource, record)
                : rowClick;

        const link = isPromise(temporaryLink)
            ? await temporaryLink
            : temporaryLink;

        const path = await getPathForRecord({
            record,
            resource,
            link,
        });
        if (path === false || path == null) {
            return;
        }
        navigate(path, {
            state: { _scrollToTop: true },
        });
    });

    return <tr onClick={handleClick}>{props.children}</tr>;
};

const isPromise = (value: any): value is Promise<any> =>
    value && typeof value.then === 'function';

export const DataTable = (
    props: Omit<DataTableBaseProps, 'hasBulkActions' | 'empty' | 'loading'>
) => {
    const { data } = useListContext();

    return (
        <DataTableBase
            {...props}
            hasBulkActions={false}
            empty={null}
            loading={null}
        >
            <table
                border={1}
                style={{ width: '100%', borderCollapse: 'collapse' }}
            >
                <DataTableRenderContext.Provider value="header">
                    <thead>
                        <tr>{props.children}</tr>
                    </thead>
                </DataTableRenderContext.Provider>
                <DataTableRenderContext.Provider value="data">
                    <tbody>
                        {data?.map(record => (
                            <RecordContextProvider
                                key={record.id}
                                value={record}
                            >
                                <DataTableRow>{props.children}</DataTableRow>
                            </RecordContextProvider>
                        ))}
                    </tbody>
                </DataTableRenderContext.Provider>
            </table>
        </DataTableBase>
    );
};

DataTable.Col = DataTableCol;
