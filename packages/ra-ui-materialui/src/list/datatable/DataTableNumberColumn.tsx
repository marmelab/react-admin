import * as React from 'react';
import { NumberField } from '../../field/NumberField';

import { DataTableColumn, type DataTableColumnProps } from './DataTableColumn';

export interface DataTableNumberColumnProps extends DataTableColumnProps {
    source: string;
    locales?: string | string[];
    options?: Intl.NumberFormatOptions;
}

export const DataTableNumberColumn = React.memo(
    React.forwardRef<HTMLTableCellElement, DataTableNumberColumnProps>(
        ({ source, options, locales, ...rest }, ref) => (
            <DataTableColumn source={source} {...rest} align="right" ref={ref}>
                <NumberField
                    source={source}
                    options={options}
                    locales={locales}
                />
            </DataTableColumn>
        )
    )
);

DataTableNumberColumn.displayName = 'DataTableNumberColumn';
