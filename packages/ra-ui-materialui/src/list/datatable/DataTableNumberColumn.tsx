import * as React from 'react';
import { type ExtractRecordPaths, type HintedString } from 'ra-core';
import { NumberField } from '../../field/NumberField';
import { genericMemo } from '../../field/genericMemo';
import { DataTableColumn, type DataTableColumnProps } from './DataTableColumn';

export interface DataTableNumberColumnProps<
    RecordType extends Record<string, any> = Record<string, any>,
> extends DataTableColumnProps<RecordType> {
    source: HintedString<ExtractRecordPaths<RecordType>>;
    locales?: string | string[];
    options?: Intl.NumberFormatOptions;
}

const DataTableNumberColumnImpl = React.forwardRef<
    HTMLTableCellElement,
    DataTableNumberColumnProps
>(({ source, options, locales, ...rest }, ref) => (
    <DataTableColumn source={source} {...rest} align="right" ref={ref}>
        <NumberField source={source} options={options} locales={locales} />
    </DataTableColumn>
)) as <RecordType extends Record<string, any> = Record<string, any>>(
    props: DataTableNumberColumnProps<RecordType>
) => React.JSX.Element;

export const DataTableNumberColumn = genericMemo(DataTableNumberColumnImpl);
