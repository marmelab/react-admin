import * as React from 'react';
import {
    useDataTableRenderContext,
    type SortPayload,
    type ExtractRecordPaths,
    type HintedString,
} from 'ra-core';
import { type SxProps, type TableCellProps } from '@mui/material';

import { DataTableCell } from './DataTableCell';
import { DataTableHeadCell } from './DataTableHeadCell';
import { ColumnsSelectorItem } from './ColumnsSelectorItem';
import { genericMemo } from '../../field/genericMemo';

// FIXME remove custom type when using TypeScript >= 5.4 as it is now native
type NoInfer<T> = T extends infer U ? U : never;

export interface DataTableColumnProps<
    RecordType extends Record<string, any> = Record<string, any>,
> extends Omit<TableCellProps, 'component'> {
    cellSx?: (record: RecordType) => SxProps;
    cellClassName?: string;
    headerClassName?: string;
    render?: (record: RecordType) => React.ReactNode;
    field?: React.ElementType;
    source?: NoInfer<HintedString<ExtractRecordPaths<RecordType>>>;
    label?: React.ReactNode;
    disableSort?: boolean;
    sortByOrder?: SortPayload['order'];
}

const DataTableColumnImpl = React.forwardRef<
    HTMLTableCellElement,
    DataTableColumnProps
>((props, ref) => {
    const renderContext = useDataTableRenderContext();
    switch (renderContext) {
        case 'columnsSelector':
            return <ColumnsSelectorItem {...props} />;
        case 'header':
            return <DataTableHeadCell {...props} ref={ref} />;
        case 'data':
            return <DataTableCell {...props} ref={ref} />;
        case 'footer':
            return <DataTableCell {...props} ref={ref} />;
    }
}) as <RecordType extends Record<string, any> = Record<string, any>>(
    props: DataTableColumnProps<RecordType>
) => React.JSX.Element;

export const DataTableColumn = genericMemo(DataTableColumnImpl);
